import { CompressorInfo, Article } from '../types';

export const COMPRESSORS: CompressorInfo[] = [
  {
    id: 'image',
    title: 'Image Compressor',
    description: 'Compress JPG, PNG, WebP, AVIF & GIF up to 90% without loss of visible quality.',
    iconName: 'Image',
    extensions: ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif'],
    maxSizeMb: 50,
    color: 'from-amber-500 to-orange-500',
    popular: true,
  },
  {
    id: 'pdf',
    title: 'PDF Compressor',
    description: 'Reduce PDF file size for fast email sharing and web uploads while keeping sharp text.',
    iconName: 'FileText',
    extensions: ['.pdf'],
    maxSizeMb: 100,
    color: 'from-rose-500 to-red-600',
    popular: true,
  },
  {
    id: 'video',
    title: 'Video Compressor',
    description: 'Compress MP4, WebM, MOV, AVI & MKV videos with intelligent frame & audio optimization.',
    iconName: 'Video',
    extensions: ['.mp4', '.webm', '.mov', '.avi', '.mkv'],
    maxSizeMb: 200,
    color: 'from-violet-500 to-purple-600',
    popular: true,
  },
  {
    id: 'audio',
    title: 'Audio Compressor',
    description: 'Optimize MP3, WAV, AAC, OGG & FLAC audio tracks for streaming and storage.',
    iconName: 'Music',
    extensions: ['.mp3', '.wav', '.aac', '.ogg', '.flac'],
    maxSizeMb: 50,
    color: 'from-blue-500 to-indigo-600',
  },
  {
    id: 'zip',
    title: 'ZIP Compressor',
    description: 'Re-compress ZIP archives using maximum Deflate ratios and stripping empty headers.',
    iconName: 'Archive',
    extensions: ['.zip'],
    maxSizeMb: 200,
    color: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'word',
    title: 'Word Compressor',
    description: 'Shrink Microsoft Word (.docx, .doc) files by compressing embedded assets and XML structure.',
    iconName: 'FileCode',
    extensions: ['.docx', '.doc'],
    maxSizeMb: 50,
    color: 'from-sky-500 to-blue-600',
  },
  {
    id: 'excel',
    title: 'Excel Compressor',
    description: 'Optimize Excel spreadsheets (.xlsx, .xls) by purging drawing data and compressing streams.',
    iconName: 'Table',
    extensions: ['.xlsx', '.xls'],
    maxSizeMb: 50,
    color: 'from-green-500 to-emerald-600',
  },
  {
    id: 'powerpoint',
    title: 'PowerPoint Compressor',
    description: 'Compress PPTX presentation decks by optimizing high-res slide images and media clips.',
    iconName: 'Presentation',
    extensions: ['.pptx', '.ppt'],
    maxSizeMb: 100,
    color: 'from-orange-500 to-amber-600',
  },
];

export const FAQ_ITEMS = [
  {
    question: 'How does CompressHub AI compress files without losing quality?',
    answer:
      'CompressHub AI uses smart algorithms (such as MozJPEG, PNGQuant, WebP lossy/lossless encoders, and PDF stream deflating). It analyzes every file to remove invisible metadata, optimize color palettes, and downsample redundant data while keeping visible visual sharpness and document fidelity intact.',
  },
  {
    question: 'Are my files private and secure?',
    answer:
      'Yes! Security and privacy are our top priorities. Files are processed entirely in secure ephemeral memory buffers and automatically deleted immediately after processing. We never store, read, or sell your files or metadata.',
  },
  {
    question: 'Is CompressHub AI completely free to use?',
    answer:
      'Yes, CompressHub AI is 100% free with no account creation, no subscriptions, and no hidden fees. You get unlimited compressions for images, documents, audio, and video.',
  },
  {
    question: 'Can I compress multiple files at once?',
    answer:
      'Absolutely! CompressHub AI supports batch uploads. You can select or drag multiple files, configure individual or global compression levels, and download everything as a single combined ZIP or individual files.',
  },
  {
    question: 'What is the maximum file size limit?',
    answer:
      'We support file sizes up to 200 MB per file for video and ZIP archives, and up to 100 MB for PDFs, presentation decks, and images.',
  },
  {
    question: 'How does custom target file size work?',
    answer:
      'If you specify a custom target size (e.g. 500 KB for an email attachment), our compression engine calculates the optimal quality, resolution scaling, and sample rate parameters required to hit your exact target size threshold.',
  },
];

export const ARTICLES: Article[] = [
  {
    id: 'webp-vs-avif-2026',
    title: 'WebP vs AVIF: Which Format Should You Choose for Next-Gen Web Speed?',
    category: 'Image Optimization',
    readTime: '4 min read',
    date: 'August 2026',
    summary: 'Discover how AVIF delivers up to 50% smaller file sizes than WebP while preserving rich colors and sharp edges on mobile devices.',
    content: `When optimizing images for modern web applications, choosing between WebP and AVIF can dramatically impact page load performance and SEO scores.

### Why AVIF is Winning
AVIF (AV1 Image File Format) leverages the high-efficiency AV1 video codec. It offers superior compression efficiency compared to WebP and JPEG:
- **Smaller File Size:** Typically 20-30% smaller than WebP at equivalent visual quality.
- **HDR Support:** Native support for 10-bit and 12-bit color depth.
- **Transparency & Lossless:** Handles alpha channel transparency with minimal artifacting.

### When to Use WebP
While AVIF is superior in compression, WebP remains a hyper-compatible choice across older browsers and image viewer software. WebP is supported by 97%+ of browsers worldwide.

### Compression Comparison (500KB JPEG)
- JPEG original: 500 KB
- WebP (quality 80): ~280 KB (44% smaller)
- AVIF (quality 80): ~190 KB (62% smaller)

### Which Should You Choose?
For maximum compatibility, use **WebP**. For maximum performance on modern browsers, use **AVIF**. With **Compressor Hub**, you can effortlessly convert JPG and PNG files into optimized WebP or AVIF formats in a single click!`,
  },
  {
    id: 'pdf-compression-secrets',
    title: 'How to Shrink 50MB PDFs to Under 5MB for Instant Email Attachments',
    category: 'Document Management',
    readTime: '3 min read',
    date: 'July 2026',
    summary: 'Learn how removing embedded color profiles, re-deflating XML streams, and downsampling high-res graphics slashes PDF size by 90%.',
    content: `Large PDF documents often fail to send via email because of 20MB or 25MB attachment limits. Most bloated PDFs are filled with uncompressed high-resolution images and duplicate font subsets.

### The Anatomy of PDF Bloat
1. **Uncompressed Embedded Scans:** Scanned documents stored as raw 300 DPI uncompressed PNG images inside PDF object streams.
2. **Duplicate Font Subsets:** Including entire TrueType font libraries for simple headers.
3. **Redundant Metadata:** Storing revision history and thumbnail cache inside PDF headers.

### Step-by-Step: How to Compress a PDF
1. Upload your PDF to Compressor Hub
2. Set the Quality Factor to your preferred level (75% recommended for email)
3. Or enter a custom target size (e.g. 4 MB)
4. Click Compress and download your optimized file

### Real World Results
A typical 50MB scanned document PDF can be reduced to:
- **25 MB** at quality 90% (archive grade)
- **8 MB** at quality 75% (office sharing)
- **3 MB** at quality 55% (email optimized)

Our PDF compression engine parses the internal PDF object tree, replaces heavy image streams with optimized representations, deflates text streams, and purges obsolete metadata — all without changing the visual appearance.`,
  },
  {
    id: 'video-bitrate-guide',
    title: 'Understanding Video Compression: CRF, Resolution, and Bitrate Tuning',
    category: 'Video Processing',
    readTime: '5 min read',
    date: 'June 2026',
    summary: 'Master video file reduction without ruining crisp 1080p and 4K playback on mobile devices.',
    content: `Videos account for over 70% of internet traffic. Compressing video files effectively requires balancing three factors: Resolution, Frame Rate, and Bitrate Mode (CRF).

### Constant Rate Factor (CRF)
CRF balances quality and file size by dynamically lowering bitrate during simple scenes and allocating more data during fast-action motion:
- **CRF 18-20:** Near-visually lossless for archiving.
- **CRF 23-28:** The sweet spot for web streaming and messaging apps.
- **CRF 30+:** Extreme compression for low-bandwidth environments.

### Resolution vs File Size
Reducing video resolution significantly reduces file size:
- 4K (3840×2160) → 1080p (1920×1080): ~75% size reduction
- 1080p → 720p (1280×720): ~55% size reduction
- 720p → 480p (854×480): ~40% size reduction

### Best Settings for Different Use Cases
- **WhatsApp / Social Media:** 720p, CRF 28, AAC 128kbps
- **YouTube Upload:** 1080p, CRF 23, AAC 192kbps
- **Email Attachment:** 480p, CRF 32, AAC 96kbps

Compressor Hub automatically computes the ideal settings for your target video size — no technical knowledge required!`,
  },
  {
    id: 'compress-images-website',
    title: 'How to Compress Images for Website Speed: A Complete 2026 Guide',
    category: 'Image Optimization',
    readTime: '6 min read',
    date: 'August 2026',
    summary: 'Images are the #1 cause of slow websites. Learn how to compress images to boost Google PageSpeed score from 45 to 95+.',
    content: `According to Google's Core Web Vitals research, images account for over 60% of a webpage's total weight. Unoptimized images directly hurt your SEO ranking, ad revenue, and user retention.

### Why Image Compression Matters for SEO
- Google uses **Page Load Speed** as a ranking factor since 2010
- A 1-second delay in page load reduces conversions by 7%
- Large images increase **Largest Contentful Paint (LCP)** — a key SEO metric

### Ideal Image Sizes for Websites
- **Hero/Banner Images:** Max 200-300 KB (WebP format)
- **Thumbnails / Blog Images:** Max 50-80 KB
- **Product Images (eCommerce):** Max 100-150 KB
- **Background Images:** Max 150-250 KB

### Step-by-Step Image Optimization
1. Upload image to Compressor Hub
2. Select target format: WebP (best for web)
3. Set quality to 80% (optimal balance)
4. Or set custom target size: 150 KB for banners
5. Download and replace on your website

### Results You Can Expect
- JPG 2.5 MB → WebP 180 KB (93% reduction)
- PNG logo 800 KB → WebP 45 KB (94% reduction)
- Your Google PageSpeed score can jump from 45 → 90+

Start compressing your website images today with Compressor Hub — completely free, no registration required!`,
  },
  {
    id: 'reduce-whatsapp-video-size',
    title: 'How to Reduce Video Size for WhatsApp Without Losing Quality',
    category: 'Video Processing',
    readTime: '3 min read',
    date: 'August 2026',
    summary: 'WhatsApp has a 16MB video limit. Learn how to compress any video under 16MB in seconds without blurry results.',
    content: `WhatsApp enforces a strict 16 MB file size limit for videos. If your video is recorded in 4K or 1080p, it can easily reach 100MB+ for just a few minutes of footage.

### WhatsApp Video Limits
- **Standard WhatsApp:** 16 MB maximum
- **WhatsApp Business:** 16 MB maximum
- **Recommended Resolution:** 720p (1280×720)

### How to Compress Video for WhatsApp
1. Open **Compressor Hub** on your phone or computer
2. Upload your large video file (MP4, MOV, AVI supported)
3. In the **Custom Target Size** field, type: **14** (MB)
4. Click **Compress**
5. Download and share on WhatsApp!

### Compression Results
- 1-minute 4K video (200 MB) → 12 MB in WhatsApp quality
- 2-minute 1080p video (80 MB) → 13.5 MB
- 5-minute 720p video (50 MB) → 13 MB

### Pro Tips
- Always leave 1-2 MB buffer below the limit
- For best results, use MP4 format (H.264 codec)
- Avoid over-compression (below 10% quality) as it causes pixelation

Compressor Hub automatically handles all technical settings — just type your target size and hit compress!`,
  },
  {
    id: 'zip-archive-compression',
    title: 'ZIP vs RAR vs 7Z: Which Archive Format Compresses Best in 2026?',
    category: 'Archive Compression',
    readTime: '4 min read',
    date: 'July 2026',
    summary: 'Not all archive formats are equal. Discover which format gives you the smallest file size and fastest extraction speed.',
    content: `Archive formats are essential for bundling multiple files and reducing total storage size. But which format should you use in 2026?

### Format Comparison
| Format | Compression Ratio | Speed | Universal Support |
|--------|------------------|-------|------------------|
| ZIP    | Good             | Fast  | ✅ Excellent      |
| RAR    | Better           | Medium| ⚠️ Needs WinRAR  |
| 7Z     | Best             | Slow  | ⚠️ Needs 7-Zip   |

### When to Use Each Format
- **ZIP:** Always use for maximum compatibility. Windows, Mac, and Linux can open ZIP files natively without any software.
- **RAR:** Good for multi-part archives and recovery records. Requires WinRAR.
- **7Z:** Best compression ratios, ideal for archiving large software or media collections.

### How to Reduce ZIP File Size Further
Already have a ZIP? Compressor Hub can re-compress it using maximum Deflate64 algorithm:
1. Upload your .zip file
2. Select compression level
3. Download an optimized ZIP (typically 10-20% smaller)

### Real World ZIP Compression Results
- 500 MB folder of mixed files → 380 MB ZIP (standard) → 310 MB (max compression)
- 1 GB of similar text/code files → 200 MB ZIP (80% reduction!)

For maximum compatibility, stick with ZIP format and use Compressor Hub to squeeze every byte!`,
  },
  {
    id: 'compress-word-excel-pptx',
    title: 'How to Compress Word, Excel & PowerPoint Files Without Losing Data',
    category: 'Document Management',
    readTime: '3 min read',
    date: 'June 2026',
    summary: 'Office files balloon in size due to embedded images and revision history. Here\'s how to shrink DOCX, XLSX, PPTX files by up to 80%.',
    content: `Microsoft Office files (DOCX, XLSX, PPTX) are secretly ZIP archives containing XML data and embedded media. A single 50 MB PowerPoint presentation might contain 45 MB of uncompressed PNG images.

### Why Office Files Get So Large
1. **Embedded High-Resolution Images:** Every screenshot or photo you paste in is stored at full resolution.
2. **Revision History:** Word stores all edit history inside the file by default.
3. **Embedded Fonts:** Custom fonts are fully embedded, adding MB of font data.
4. **Thumbnail Cache:** Office stores a hidden preview image of every slide/page.

### How Compressor Hub Reduces Office File Sizes
- **DOCX/Word:** Strips revision history, compresses embedded images, removes thumbnail cache
- **XLSX/Excel:** Optimizes chart images and removes cached formula results
- **PPTX/PowerPoint:** Re-encodes all embedded images to optimal quality, removes unused layouts

### Expected Results
- 50 MB PPTX with many images → 8-12 MB (75-84% reduction)
- 20 MB DOCX with embedded photos → 3-5 MB (75-85% reduction)
- 10 MB XLSX with chart images → 2-3 MB (70-80% reduction)

### Step-by-Step Guide
1. Upload your Office file to Compressor Hub
2. Set quality or custom target size
3. Download the compressed file
4. Open and verify — all text, data, and formatting intact!`,
  },
  {
    id: 'audio-compression-guide',
    title: 'MP3 vs AAC vs OGG: Best Audio Format for Streaming and Podcasts',
    category: 'Audio Optimization',
    readTime: '4 min read',
    date: 'May 2026',
    summary: 'Audio format and bitrate choices have a massive impact on streaming costs and listener experience. Here\'s the 2026 guide.',
    content: `Audio files can consume enormous storage if not compressed properly. A single hour of uncompressed WAV audio is 600 MB+. The right format and bitrate can reduce this to under 60 MB with no audible quality difference.

### Audio Format Comparison
| Format | Quality at 128kbps | File Size | Best Use |
|--------|-------------------|-----------|----------|
| WAV    | Lossless          | Very Large| Studio recording |
| MP3    | Good              | Small     | Music, podcasts  |
| AAC    | Better than MP3   | Smaller   | Streaming, mobile |
| OGG    | Best open format  | Small     | Web, games |
| FLAC   | Lossless          | Medium    | Archiving |

### Recommended Bitrates
- **Podcast/Voice:** 96 kbps AAC or 128 kbps MP3
- **Music Streaming:** 192 kbps AAC or 256 kbps MP3
- **High Quality Archive:** 320 kbps MP3 or FLAC
- **WhatsApp Voice:** 32-64 kbps (auto)

### How to Compress Audio Files
1. Upload WAV, FLAC, or high-bitrate MP3 to Compressor Hub
2. Set your quality level (75% = 192kbps equivalent)
3. Or enter custom target size in KB/MB
4. Download optimized audio file

### Real Compression Results
- WAV 600 MB (1 hour) → MP3 320kbps 144 MB → AAC 128kbps 57 MB
- Studio FLAC 200 MB album → MP3 320kbps 60 MB (70% smaller, no audible difference)

For podcasts and web streaming, AAC at 128kbps is the gold standard. Compressor Hub makes it effortless!`,
  },
];

