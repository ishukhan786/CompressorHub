import express, { Request, Response } from 'express';
import path from 'path';
import os from 'os';
import fs from 'fs/promises';
import { spawn } from 'child_process';
import multer from 'multer';
import sharp from 'sharp';
import { PDFDocument } from 'pdf-lib';
import AdmZip from 'adm-zip';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

// Setup Multer memory storage (Max 1GB per file, stored in memory)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 1024 * 1024, // 1GB
  },
});

app.use(express.json());

// Helper to determine file category
function getFileCategory(filename: string, mimeType: string): string {
  const ext = path.extname(filename).toLowerCase();
  if (['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif', '.tiff', '.bmp'].includes(ext) || mimeType.startsWith('image/')) {
    return 'image';
  }
  if (ext === '.pdf' || mimeType === 'application/pdf') {
    return 'pdf';
  }
  if (['.mp4', '.webm', '.mov', '.avi', '.mkv'].includes(ext) || mimeType.startsWith('video/')) {
    return 'video';
  }
  if (['.mp3', '.wav', '.aac', '.ogg', '.flac', '.m4a'].includes(ext) || mimeType.startsWith('audio/')) {
    return 'audio';
  }
  if (ext === '.zip' || mimeType.includes('zip')) {
    return 'zip';
  }
  if (['.docx', '.doc'].includes(ext)) {
    return 'word';
  }
  if (['.xlsx', '.xls'].includes(ext)) {
    return 'excel';
  }
  if (['.pptx', '.ppt'].includes(ext)) {
    return 'powerpoint';
  }
  return 'general';
}

// ---------------------------------------------------------------------------
// Image compression engine using Sharp
// ---------------------------------------------------------------------------
async function compressImage(
  buffer: Buffer,
  filename: string,
  settings: {
    quality?: number;
    preserveMetadata?: boolean;
    outputFormat?: string;
    targetSizeKb?: number;
  }
): Promise<{ buffer: Buffer; format: string }> {
  const quality = Math.max(10, Math.min(100, settings.quality ?? 75));
  const ext = path.extname(filename).toLowerCase().replace('.', '');
  let format = settings.outputFormat || (ext === 'jpg' ? 'jpeg' : ext);
  if (!['jpeg', 'png', 'webp', 'avif', 'gif'].includes(format)) {
    format = 'jpeg';
  }

  let pipeline = sharp(buffer, { failOn: 'none' });

  if (settings.preserveMetadata) {
    pipeline = pipeline.withMetadata();
  }

  if (format === 'jpeg' || format === 'jpg') {
    pipeline = pipeline.jpeg({ quality, mozjpeg: true });
  } else if (format === 'png') {
    const compressionLevel = Math.floor((100 - quality) / 10); // 0-9
    pipeline = pipeline.png({ compressionLevel: Math.min(9, Math.max(1, compressionLevel)), palette: quality < 80 });
  } else if (format === 'webp') {
    pipeline = pipeline.webp({ quality, effort: 6 });
  } else if (format === 'avif') {
    pipeline = pipeline.avif({ quality, effort: 4 });
  } else if (format === 'gif') {
    pipeline = pipeline.gif({});
  }

  let outputBuffer = await pipeline.toBuffer();

  // If a target size is requested and we're still above it, iteratively
  // reduce quality then dimensions — always via the real encoder, never
  // by slicing bytes.
  if (settings.targetSizeKb && settings.targetSizeKb > 0) {
    const targetBytes = settings.targetSizeKb * 1024;
    let currentQuality = quality;
    let currentScale = 1.0;
    const metadata = await sharp(buffer).metadata();

    while (outputBuffer.length > targetBytes && (currentQuality > 5 || currentScale > 0.1)) {
      if (currentQuality > 10) {
        currentQuality = Math.max(5, currentQuality - 15);
      } else {
        currentScale = Math.max(0.1, currentScale - 0.2);
      }

      let iterative = sharp(buffer, { failOn: 'none' });
      if (settings.preserveMetadata) iterative = iterative.withMetadata();

      if (currentScale < 1.0 && metadata.width) {
        iterative = iterative.resize(Math.max(1, Math.round(metadata.width * currentScale)));
      }

      if (format === 'jpeg' || format === 'jpg') {
        iterative = iterative.jpeg({ quality: currentQuality, mozjpeg: true });
      } else if (format === 'webp') {
        iterative = iterative.webp({ quality: currentQuality });
      } else if (format === 'png') {
        iterative = iterative.png({ palette: true, colors: Math.max(16, currentQuality * 2) });
      } else if (format === 'avif') {
        iterative = iterative.avif({ quality: currentQuality });
      } else {
        iterative = iterative.toFormat(format as keyof sharp.FormatEnum);
      }

      outputBuffer = await iterative.toBuffer();
    }
  }

  return { buffer: outputBuffer, format };
}

// ---------------------------------------------------------------------------
// PDF compression engine using pdf-lib
//
// IMPORTANT: never slice raw PDF bytes to "hit a target size" — PDFs are a
// structured binary format (xref table, object streams, trailer). Cutting
// bytes off the end produces a file that will not open. If pdf-lib's real
// re-save doesn't shrink the file enough, we just return the best legitimate
// result and report the true saved percentage (which may be 0).
// ---------------------------------------------------------------------------
async function compressPdf(
  buffer: Buffer,
  settings: { quality?: number; preserveMetadata?: boolean }
): Promise<Buffer> {
  try {
    const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });

    if (!settings.preserveMetadata) {
      pdfDoc.setAuthor('');
      pdfDoc.setProducer('CompressHub AI Engine');
      pdfDoc.setCreator('CompressHub AI Engine');
      pdfDoc.setSubject('');
      pdfDoc.setKeywords([]);
    }

    // Re-saving with object streams enabled is a real (if modest) win —
    // it de-duplicates and compresses the internal object table. It will
    // never corrupt the file, unlike byte-slicing.
    const pdfBytes = await pdfDoc.save({
      useObjectStreams: true,
      addDefaultPage: false,
    });

    const compressedBuffer = Buffer.from(pdfBytes);

    // Only use the re-saved version if it's actually smaller or equal —
    // otherwise keep the original untouched. No fallback byte-slicing.
    return compressedBuffer.length <= buffer.length ? compressedBuffer : buffer;
  } catch (err) {
    console.error('PDF compression error, returning original file untouched:', err);
    return buffer;
  }
}

// ---------------------------------------------------------------------------
// Office Document (Word, Excel, PowerPoint) & ZIP compression engine
// ---------------------------------------------------------------------------
async function compressZipOrOffice(
  buffer: Buffer,
  filename: string,
  settings: { quality?: number }
): Promise<Buffer> {
  try {
    const zip = new AdmZip(buffer);
    const newZip = new AdmZip();
    const quality = settings.quality || 75;

    const entries = zip.getEntries();
    for (const entry of entries) {
      if (entry.isDirectory) {
        newZip.addFile(entry.entryName, Buffer.alloc(0));
        continue;
      }

      const entryName = entry.entryName.toLowerCase();
      let entryBuffer = entry.getData();

      if (['.jpg', '.jpeg', '.png'].some((ext) => entryName.endsWith(ext))) {
        try {
          const { buffer: compressedImg } = await compressImage(entryBuffer, entryName, {
            quality,
            preserveMetadata: false,
          });
          if (compressedImg.length < entryBuffer.length) {
            entryBuffer = compressedImg;
          }
        } catch {
          // Keep original image entry if conversion fails
        }
      }

      newZip.addFile(entry.entryName, entryBuffer, entry.comment);
    }

    const outputBuffer = newZip.toBuffer();
    return outputBuffer.length < buffer.length ? outputBuffer : buffer;
  } catch (err) {
    console.error('ZIP/Office compression error, returning original file untouched:', err);
    return buffer;
  }
}

// ---------------------------------------------------------------------------
// Media (Video / Audio) compression via ffmpeg
//
// IMPORTANT: the previous implementation sliced raw bytes off video/audio
// files, which does NOT compress media — it produces a truncated, unplayable
// file. Real compression requires re-encoding with a codec. This version
// shells out to ffmpeg (must be installed on the host / container image).
// If ffmpeg is not available, it returns the original file untouched rather
// than producing a corrupt one.
// ---------------------------------------------------------------------------
function runFfmpeg(args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const proc = spawn('ffmpeg', args, { stdio: ['ignore', 'ignore', 'pipe'] });
    let stderr = '';
    proc.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });
    proc.on('error', (err) => reject(err)); // e.g. ffmpeg not installed
    proc.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg exited with code ${code}: ${stderr.slice(-500)}`));
    });
  });
}

const RESOLUTION_HEIGHTS: Record<string, number | null> = {
  '4k': 2160,
  '2k': 1440,
  '1080p': 1080,
  '720p': 720,
  '480p': 480,
  '360p': 360,
  original: null,
};

async function compressMedia(
  buffer: Buffer,
  filename: string,
  category: 'video' | 'audio',
  settings: { quality?: number; targetSizeKb?: number; videoResolution?: string }
): Promise<{ buffer: Buffer; ext: string }> {
  const quality = settings.quality ?? 75;
  const origExt = path.extname(filename) || (category === 'video' ? '.mp4' : '.mp3');
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'compresshub-'));
  const inPath = path.join(tmpDir, `input${origExt}`);
  const outExt = category === 'video' ? '.mp4' : '.m4a';
  const outPath = path.join(tmpDir, `output${outExt}`);

  try {
    await fs.writeFile(inPath, buffer);

    const args = ['-y', '-i', inPath];

    if (category === 'video') {
      // Quality 0-100 -> CRF ~18 (best) to ~35 (smallest). Lower CRF = higher quality.
      const crf = Math.round(35 - (quality / 100) * 17);
      args.push('-c:v', 'libx264', '-crf', String(crf), '-preset', 'medium');

      const targetHeight = RESOLUTION_HEIGHTS[settings.videoResolution || 'original'];
      if (targetHeight) {
        args.push('-vf', `scale=-2:'min(${targetHeight},ih)'`);
      }

      // If an explicit target size is given, use two-pass-style bitrate targeting instead of CRF.
      if (settings.targetSizeKb && settings.targetSizeKb > 0) {
        // Rough duration probe isn't done here to keep this dependency-light;
        // fall back to a conservative average bitrate cap instead of CRF.
        const targetBitrateKbps = Math.max(150, Math.floor((settings.targetSizeKb * 8) / 60)); // assumes ~60s if unknown
        args.splice(args.indexOf('-crf'), 2); // remove crf flag pair
        args.push('-b:v', `${targetBitrateKbps}k`, '-maxrate', `${targetBitrateKbps}k`, '-bufsize', `${targetBitrateKbps * 2}k`);
      }

      args.push('-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart');
    } else {
      // Audio: map quality to bitrate
      const bitrateKbps = Math.round(64 + (quality / 100) * 192); // 64k - 256k
      args.push('-c:a', 'aac', '-b:a', `${bitrateKbps}k`);
    }

    args.push(outPath);

    await runFfmpeg(args);
    const resultBuffer = await fs.readFile(outPath);
    return { buffer: resultBuffer, ext: outExt };
  } catch (err) {
    console.error('Media compression unavailable (ffmpeg missing or failed), returning original file untouched:', err);
    return { buffer, ext: origExt };
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true }).catch(() => {});
  }
}

// ---------------------------------------------------------------------------
// Health check endpoint
// ---------------------------------------------------------------------------
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'CompressHub AI Engine', time: new Date().toISOString() });
});

// ---------------------------------------------------------------------------
// Main Compression API Endpoint
// ---------------------------------------------------------------------------
app.post('/api/compress', upload.single('file'), async (req: Request, res: Response) => {
  const startTime = Date.now();
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { buffer, originalname, mimetype, size } = req.file;
    const settingsRaw = req.body.settings ? JSON.parse(req.body.settings) : {};
    const quality = Number(settingsRaw.quality || 75);
    const preserveMetadata = Boolean(settingsRaw.preserveMetadata);
    const outputFormat = settingsRaw.outputFormat || '';
    const targetSizeKb = Number(settingsRaw.targetSizeKb || 0);
    const videoResolution = settingsRaw.videoResolution || 'original';

    const category = getFileCategory(originalname, mimetype);
    let resultBuffer: Buffer = buffer;
    let finalFormat = path.extname(originalname).toLowerCase().replace('.', '');

    if (category === 'image') {
      const imgRes = await compressImage(buffer, originalname, {
        quality,
        preserveMetadata,
        outputFormat,
        targetSizeKb,
      });
      resultBuffer = imgRes.buffer;
      finalFormat = imgRes.format;
    } else if (category === 'pdf') {
      resultBuffer = await compressPdf(buffer, { quality, preserveMetadata });
    } else if (['word', 'excel', 'powerpoint', 'zip'].includes(category)) {
      resultBuffer = await compressZipOrOffice(buffer, originalname, { quality });
    } else if (category === 'video' || category === 'audio') {
      const mediaRes = await compressMedia(buffer, originalname, category, {
        quality,
        targetSizeKb,
        videoResolution,
      });
      resultBuffer = mediaRes.buffer;
      finalFormat = mediaRes.ext.replace('.', '');
    } else {
      resultBuffer = await compressZipOrOffice(buffer, originalname, { quality });
    }

    const compressedSize = resultBuffer.length;
    // Honest saving calculation: never floor to a fake minimum of 1%.
    // If the file didn't actually shrink, report 0%.
    const savedBytes = Math.max(0, size - compressedSize);
    const savedPercentage = savedBytes > 0 ? Math.min(99, Math.round((savedBytes / size) * 100)) : 0;
    const processingTimeMs = Date.now() - startTime;

    const base64Data = resultBuffer.toString('base64');

    let finalMime = mimetype;
    if (category === 'image') {
      if (finalFormat === 'jpg' || finalFormat === 'jpeg') finalMime = 'image/jpeg';
      else if (finalFormat === 'png') finalMime = 'image/png';
      else if (finalFormat === 'webp') finalMime = 'image/webp';
      else if (finalFormat === 'avif') finalMime = 'image/avif';
      else if (finalFormat === 'gif') finalMime = 'image/gif';
    } else if (category === 'video') {
      finalMime = finalFormat === 'mp4' ? 'video/mp4' : mimetype;
    } else if (category === 'audio') {
      finalMime = finalFormat === 'm4a' ? 'audio/mp4' : mimetype;
    }

    return res.json({
      success: true,
      originalName: originalname,
      originalSize: size,
      compressedSize,
      savedBytes,
      savedPercentage,
      processingTimeMs,
      finalFormat,
      category,
      dataUrl: `data:${finalMime};base64,${base64Data}`,
    });
  } catch (error: any) {
    console.error('Compression Endpoint Error:', error);
    return res.status(500).json({
      error: 'Failed to compress file',
      details: error?.message || 'Internal processing error',
    });
  }
});

// ---------------------------------------------------------------------------
// AI analysis endpoint for smart settings recommendation (via OpenRouter)
// ---------------------------------------------------------------------------
app.post('/api/ai-analyze', upload.single('file'), async (req: Request, res: Response) => {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return res.json({
        recommendedQuality: 75,
        suggestedFormat: 'webp',
        advice: 'Smart optimization configured for balanced visual quality and 60-80% file size reduction.',
      });
    }

    const filename = req.file?.originalname || 'document';
    const sizeMb = req.file ? (req.file.size / (1024 * 1024)).toFixed(2) : '1.0';

    const prompt = `You are an expert file compression architect. Analyze this file request: filename="${filename}", size=${sizeMb} MB. Return JSON with:
      {
        "recommendedQuality": number (between 50 and 90),
        "suggestedFormat": string ("webp" | "avif" | "jpeg" | "pdf" | "original"),
        "advice": string (short 1-2 sentence tip on preserving clarity while saving space)
      }`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.statusText}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return res.json(parsed);
    }

    return res.json({
      recommendedQuality: 75,
      suggestedFormat: 'webp',
      advice: 'AI recommends converting images to WebP format for optimal multi-platform speed.',
    });
  } catch (err) {
    console.error('AI Analysis Error:', err);
    return res.json({
      recommendedQuality: 75,
      suggestedFormat: 'webp',
      advice: 'Balanced smart compression level active.',
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else if (!process.env.VERCEL) {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  if (!process.env.VERCEL) {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`CompressHub AI Server running on http://0.0.0.0:${PORT}`);
    });
  }
}

startServer();

export default app;
