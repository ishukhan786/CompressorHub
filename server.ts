/// <reference types="node" />
/// <reference types="express" />
/// <reference types="multer" />
// @ts-ignore
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import os from 'os';
import fs from 'fs/promises';
import { spawn } from 'child_process';
// @ts-ignore
import multer from 'multer';
import sharp from 'sharp';
import { PDFDocument } from 'pdf-lib';
import AdmZip from 'adm-zip';
import { createServer as createViteServer } from 'vite';
// @ts-ignore
import ffmpegPath from 'ffmpeg-static';

// --- Types & Interfaces ---
interface CompressionSettings {
  quality?: number;
  preserveMetadata?: boolean;
  outputFormat?: string;
  targetSizeKb?: number;
  videoResolution?: string;
}

interface CompressedResult {
  buffer: Buffer;
  format: string;
}

interface AIAnalysisResponse {
  recommendedQuality: number;
  suggestedFormat: string;
  advice: string;
}

// --- Configuration ---
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const MAX_FILE_SIZE = 1024 * 1024 * 1024; // 1GB

const RESOLUTION_HEIGHTS: Record<string, number | null> = {
  '4k': 2160,
  '2k': 1440,
  '1080p': 1080,
  '720p': 720,
  '480p': 480,
  '360p': 360,
  original: null,
};

// --- App Setup ---
const app = express();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
});

app.use(express.json());

// --- Utilities ---
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

function parseSettings(rawSettings: unknown): CompressionSettings {
  if (typeof rawSettings === 'string' && rawSettings.trim() !== '') {
    try {
      return JSON.parse(rawSettings) as CompressionSettings;
    } catch {
      return {};
    }
  }
  if (typeof rawSettings === 'object' && rawSettings !== null) {
    return rawSettings as CompressionSettings;
  }
  return {};
}

// --- Engines ---
async function processImagePipeline(buffer: Buffer, format: string, quality: number, preserveMetadata: boolean, scale: number = 1.0): Promise<Buffer> {
  let pipeline = sharp(buffer, { failOn: 'none' });

  if (preserveMetadata) {
    pipeline = pipeline.withMetadata();
  }

  if (scale < 1.0) {
    const metadata = await sharp(buffer).metadata();
    if (metadata.width) {
      pipeline = pipeline.resize(Math.max(1, Math.round(metadata.width * scale)));
    }
  }

  switch (format) {
    case 'jpeg':
    case 'jpg':
      pipeline = pipeline.jpeg({ quality, mozjpeg: true, progressive: true, chromaSubsampling: '4:4:4' });
      break;
    case 'png':
      const colors = Math.max(16, quality * 2.5);
      pipeline = pipeline.png({ palette: true, compressionLevel: 9, colors: Math.min(256, Math.floor(colors)) });
      break;
    case 'webp':
      pipeline = pipeline.webp({ quality, effort: 6, smartSubsample: true });
      break;
    case 'avif':
      pipeline = pipeline.avif({ quality, effort: 6, chromaSubsampling: '4:4:4' });
      break;
    case 'gif':
      pipeline = pipeline.gif({});
      break;
    default:
      pipeline = pipeline.toFormat(format as any);
  }

  return pipeline.toBuffer();
}

async function compressImage(buffer: Buffer, filename: string, settings: CompressionSettings): Promise<CompressedResult> {
  const ext = path.extname(filename).toLowerCase().replace('.', '');
  let format = settings.outputFormat || (ext === 'jpg' ? 'jpeg' : ext);
  
  if (!['jpeg', 'png', 'webp', 'avif', 'gif'].includes(format)) {
    format = 'jpeg';
  }
  
  const targetQuality = Math.max(10, Math.min(100, settings.quality ?? 75));
  const preserve = Boolean(settings.preserveMetadata);
  
  if (!settings.targetSizeKb || settings.targetSizeKb <= 0) {
    const outBuffer = await processImagePipeline(buffer, format, targetQuality, preserve);
    return { buffer: outBuffer, format };
  }

  const targetBytes = settings.targetSizeKb * 1024;
  
  let lowQ = 10;
  let highQ = targetQuality;
  let bestBuffer = await processImagePipeline(buffer, format, targetQuality, preserve);
  
  if (bestBuffer.length <= targetBytes) {
    return { buffer: bestBuffer, format };
  }

  let iterations = 0;
  while (lowQ <= highQ && iterations < 7) {
    const midQ = Math.floor((lowQ + highQ) / 2);
    const tempBuffer = await processImagePipeline(buffer, format, midQ, preserve);
    
    if (tempBuffer.length === targetBytes) {
      bestBuffer = tempBuffer;
      break;
    }
    
    if (tempBuffer.length > targetBytes) {
      highQ = midQ - 1;
    } else {
      bestBuffer = tempBuffer; 
      lowQ = midQ + 1;
    }
    iterations++;
  }

  let scale = 1.0;
  const finalQuality = lowQ < 10 ? 10 : lowQ;
  
  while (bestBuffer.length > targetBytes && scale > 0.1) {
    scale -= 0.15;
    bestBuffer = await processImagePipeline(buffer, format, finalQuality, preserve, scale);
  }

  return { buffer: bestBuffer, format };
}

async function compressPdf(buffer: Buffer, settings: CompressionSettings): Promise<Buffer> {
  try {
    const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });

    if (!settings.preserveMetadata) {
      pdfDoc.setAuthor('');
      pdfDoc.setProducer('CompressHub Engine');
      pdfDoc.setCreator('CompressHub');
      pdfDoc.setSubject('');
      pdfDoc.setKeywords([]);
    }

    const pdfBytes = await pdfDoc.save({ useObjectStreams: true, addDefaultPage: false });
    const compressedBuffer = Buffer.from(pdfBytes);

    return compressedBuffer.length < buffer.length ? compressedBuffer : buffer;
  } catch (err) {
    console.warn('PDF compression warning:', err instanceof Error ? err.message : String(err));
    return buffer;
  }
}

async function compressZipOrOffice(buffer: Buffer, filename: string, settings: CompressionSettings): Promise<Buffer> {
  try {
    const zip = new AdmZip(buffer);
    const newZip = new AdmZip();
    
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
          const imgRes = await compressImage(entryBuffer, entryName, { quality: settings.quality, preserveMetadata: false });
          if (imgRes.buffer.length < entryBuffer.length) {
            entryBuffer = imgRes.buffer;
          }
        } catch {
           // Proceed with uncompressed
        }
      }
      newZip.addFile(entry.entryName, entryBuffer, entry.comment);
    }

    const outputBuffer = newZip.toBuffer();
    return outputBuffer.length < buffer.length ? outputBuffer : buffer;
  } catch (err) {
    console.warn('ZIP compression warning:', err instanceof Error ? err.message : String(err));
    return buffer;
  }
}

function runFfmpeg(args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const proc = spawn(ffmpegPath || 'ffmpeg', args, { stdio: ['ignore', 'ignore', 'pipe'] });
    let stderr = '';
    proc.stderr.on('data', (chunk: Buffer) => { stderr += chunk.toString(); });
    proc.on('error', (err) => reject(err));
    proc.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg exited with code ${code}: ${stderr.slice(-500)}`));
    });
  });
}

async function compressMedia(buffer: Buffer, filename: string, category: 'video' | 'audio', settings: CompressionSettings): Promise<CompressedResult> {
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
      const crf = Math.round(35 - (quality / 100) * 17);
      args.push('-c:v', 'libx264', '-crf', String(crf), '-preset', 'medium');

      const targetHeight = RESOLUTION_HEIGHTS[settings.videoResolution || 'original'];
      if (targetHeight) {
        args.push('-vf', `scale=-2:'min(${targetHeight},ih)'`);
      }

      if (settings.targetSizeKb && settings.targetSizeKb > 0) {
        const targetBitrateKbps = Math.max(150, Math.floor((settings.targetSizeKb * 8) / 60)); 
        const crfIndex = args.indexOf('-crf');
        if (crfIndex !== -1) {
          args.splice(crfIndex, 2);
        }
        args.push('-b:v', `${targetBitrateKbps}k`, '-maxrate', `${targetBitrateKbps}k`, '-bufsize', `${targetBitrateKbps * 2}k`);
      }
      args.push('-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart');
    } else {
      const bitrateKbps = Math.round(64 + (quality / 100) * 192); 
      args.push('-c:a', 'aac', '-b:a', `${bitrateKbps}k`);
    }

    args.push(outPath);
    await runFfmpeg(args);
    
    const resultBuffer = await fs.readFile(outPath);
    return { buffer: resultBuffer, format: outExt.replace('.', '') };
  } catch (err) {
    console.warn('Media compression warning (ffmpeg might be missing):', err instanceof Error ? err.message : String(err));
    return { buffer, format: origExt.replace('.', '') };
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true }).catch(() => {});
  }
}

// --- Routes ---
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'CompressHub Engine', time: new Date().toISOString() });
});

app.post('/api/compress', upload.single('file'), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const startTime = Date.now();
  
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    const { buffer, originalname, mimetype, size } = req.file;
    const settings = parseSettings(req.body.settings);
    const category = getFileCategory(originalname, mimetype);

    let resultBuffer: Buffer = buffer;
    let finalFormat = path.extname(originalname).toLowerCase().replace('.', '');

    if (category === 'image') {
      const imgRes = await compressImage(buffer, originalname, settings);
      resultBuffer = imgRes.buffer;
      finalFormat = imgRes.format;
    } else if (category === 'pdf') {
      resultBuffer = await compressPdf(buffer, settings);
    } else if (['word', 'excel', 'powerpoint', 'zip'].includes(category)) {
      resultBuffer = await compressZipOrOffice(buffer, originalname, settings);
    } else if (category === 'video' || category === 'audio') {
      const mediaRes = await compressMedia(buffer, originalname, category, settings);
      resultBuffer = mediaRes.buffer;
      finalFormat = mediaRes.format;
    }

    const compressedSize = resultBuffer.length;
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

    res.json({
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
  } catch (error) {
    console.error('Compression Endpoint Error:', error instanceof Error ? error.message : String(error));
    res.status(500).json({ error: 'Failed to compress file', details: 'Internal processing error' });
  }
});

app.post('/api/ai-analyze', upload.single('file'), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const defaultFallback: AIAnalysisResponse = {
    recommendedQuality: 75,
    suggestedFormat: 'webp',
    advice: 'Balanced smart compression level active.',
  };

  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      res.json({
        ...defaultFallback,
        advice: 'Smart optimization configured for balanced visual quality and file size reduction.',
      });
      return;
    }

    const filename = req.file?.originalname || 'document';
    const sizeMb = req.file ? (req.file.size / (1024 * 1024)).toFixed(2) : '1.0';

    const prompt = `You are an expert file compression architect. Analyze this file request: filename="${filename}", size=${sizeMb} MB. Return JSON with:
      {
        "recommendedQuality": number (between 50 and 90),
        "suggestedFormat": string ("webp" | "avif" | "jpeg" | "pdf" | "original"),
        "advice": string (short 1-2 sentence tip on preserving clarity while saving space)
      }`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ model: 'google/gemini-2.5-flash', messages: [{ role: 'user', content: prompt }] }),
      signal: controller.signal,
    });
    
    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]) as AIAnalysisResponse;
      if (parsed.recommendedQuality && parsed.suggestedFormat && parsed.advice) {
        res.json(parsed);
        return;
      }
    }

    res.json(defaultFallback);
  } catch (err) {
    console.warn('AI Analysis Error:', err instanceof Error ? err.message : String(err));
    res.json(defaultFallback);
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
