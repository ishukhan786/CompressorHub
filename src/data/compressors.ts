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
    content: `
When optimizing images for modern web applications, choosing between WebP and AVIF can dramatically impact page load performance and SEO scores.

### Why AVIF is Winning
AVIF (AV1 Image File Format) leverages the high-efficiency AV1 video codec. It offers superior compression efficiency compared to WebP and JPEG:
- **Smaller File Size:** Typically 20-30% smaller than WebP at equivalent visual quality.
- **HDR Support:** Native support for 10-bit and 12-bit color depth.
- **Transparency & Lossless:** Handles alpha channel transparency with minimal artifacting.

### When to Use WebP
While AVIF is superior in compression, WebP remains a hyper-compatible choice across older browsers and image viewer software.

With **CompressHub AI**, you can effortlessly convert JPG and PNG files into optimized WebP or AVIF formats in a single click!
    `,
  },
  {
    id: 'pdf-compression-secrets',
    title: 'How to Shrink 50MB PDFs to Under 5MB for Instant Email Attachments',
    category: 'Document Management',
    readTime: '3 min read',
    date: 'July 2026',
    summary: 'Learn how removing embedded color profiles, re-deflating XML streams, and downsampling high-res graphics slashes PDF size by 90%.',
    content: `
Large PDF documents often fail to send via email because of 20MB or 25MB attachment limits. Most bloated PDFs are filled with uncompressed high-resolution images and duplicate font subsets.

### The Anatomy of PDF Bloat
1. **Uncompressed Embedded Scans:** Scanned documents stored as raw 300 DPI uncompressed PNG images inside PDF object streams.
2. **Duplicate Font Subsets:** Including entire TrueType font libraries for simple headers.
3. **Redundant Metadata:** Storing revision history and thumbnail cache inside PDF headers.

### How CompressHub AI Fixes PDF Bloat
Our PDF compression engine parses the internal PDF object tree, replaces heavy image streams with optimized lossy WebP/JPEG representations, deflates text streams, and purges obsolete metadata.
    `,
  },
  {
    id: 'video-bitrate-guide',
    title: 'Understanding Video Compression: CRF, Resolution, and Bitrate Tuning',
    category: 'Video Processing',
    readTime: '5 min read',
    date: 'June 2026',
    summary: 'Master video file reduction without ruining crisp 1080p and 4K playback on mobile devices.',
    content: `
Videos account for over 70% of internet traffic. Compressing video files effectively requires balancing three factors: Resolution, Frame Rate, and Bitrate Mode (CRF).

### Constant Rate Factor (CRF)
CRF balances quality and file size by dynamically lowering bitrate during simple scenes and allocating more data during fast-action motion:
- **CRF 18-20:** Near-visually lossless for archiving.
- **CRF 23-28:** The sweet spot for web streaming and messaging apps.
- **CRF 30+:** Extreme compression for low-bandwidth environments.

CompressHub AI automatically computes the ideal CRF and audio sample rate for your target video size.
    `,
  },
];
