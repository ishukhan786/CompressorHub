export type CompressorType =
  | 'image'
  | 'pdf'
  | 'video'
  | 'audio'
  | 'zip'
  | 'word'
  | 'excel'
  | 'powerpoint';

export type CompressionPreset = 'low' | 'balanced' | 'extreme' | 'custom';

export interface CompressionSettings {
  preset: CompressionPreset;
  quality: number; // 1 to 100
  targetSizeKb?: number; // Custom target size in KB
  targetSizeMb?: number; // Custom target size in MB
  preserveMetadata: boolean;
  outputFormat?: string; // Optional format conversion e.g. 'webp', 'avif', 'jpg', 'png'
  resizeMaxDimension?: number; // Optional max width/height in px
}

export interface FileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  type: CompressorType;
  mimeType: string;
  previewUrl?: string;
  status: 'idle' | 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  originalSize: number;
  compressedSize?: number;
  savedPercentage?: number;
  compressedBlob?: Blob;
  compressedUrl?: string;
  error?: string;
  processingTimeMs?: number;
  finalFormat?: string;
  estimatedSeconds?: number;
  settings: CompressionSettings;
}

export interface CompressorInfo {
  id: CompressorType;
  title: string;
  description: string;
  iconName: string;
  extensions: string[];
  maxSizeMb: number;
  color: string;
  popular?: boolean;
}

export interface Article {
  id: string;
  title: string;
  category: string;
  readTime: string;
  date: string;
  summary: string;
  content: string;
}
