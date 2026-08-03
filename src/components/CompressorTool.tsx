import { useState, useEffect } from 'react';
import {
  Zap,
  Download,
  RotateCcw,
  Sliders,
  Sparkles,
  FileText,
  Image as ImageIcon,
  Film,
  Music,
  Archive,
  CheckCircle2,
  AlertCircle,
  Eye,
  X,
  FileCode,
  FolderArchive,
  ArrowRight,
} from 'lucide-react';
import { FileItem, CompressionPreset, CompressionSettings } from '../types';
import { compressFileApi, fetchAiRecommendation } from '../services/api';
import { ComparisonSlider } from './ComparisonSlider';
import JSZip from 'jszip';

interface CompressorToolProps {
  files: FileItem[];
  onUpdateFile: (updated: FileItem) => void;
  onRemoveFile: (id: string) => void;
  onClearFiles: () => void;
  onAddMoreFiles: () => void;
}

export function CompressorTool({
  files,
  onUpdateFile,
  onRemoveFile,
  onClearFiles,
  onAddMoreFiles,
}: CompressorToolProps) {
  // Global preset settings
  const [globalPreset, setGlobalPreset] = useState<CompressionPreset>('balanced');
  const [globalQuality, setGlobalQuality] = useState<number>(75);
  const [customTargetKb, setCustomTargetKb] = useState<string>('');
  const [preserveMetadata, setPreserveMetadata] = useState<boolean>(false);
  const [outputFormat, setOutputFormat] = useState<string>('original');
  const [isProcessingAll, setIsProcessingAll] = useState<boolean>(false);

  // Active modal comparison file
  const [comparisonFile, setComparisonFile] = useState<FileItem | null>(null);

  // AI tip callout
  const [aiTip, setAiTip] = useState<string | null>(null);

  useEffect(() => {
    // If files uploaded, run fast AI check on the first file for smart suggestion
    if (files.length > 0 && !aiTip) {
      fetchAiRecommendation(files[0].file).then((rec) => {
        if (rec && rec.advice) {
          setAiTip(rec.advice);
        }
      });
    }
  }, [files]);

  const handlePresetChange = (preset: CompressionPreset) => {
    setGlobalPreset(preset);
    if (preset === 'extreme') setGlobalQuality(35);
    else if (preset === 'balanced') setGlobalQuality(75);
    else if (preset === 'low') setGlobalQuality(90);
  };

  const getSettingsForFile = (): CompressionSettings => {
    return {
      preset: globalPreset,
      quality: globalQuality,
      targetSizeKb: customTargetKb ? parseFloat(customTargetKb) : undefined,
      preserveMetadata,
      outputFormat: outputFormat !== 'original' ? outputFormat : undefined,
    };
  };

  const processSingleFile = async (item: FileItem) => {
    const updatedItem: FileItem = {
      ...item,
      status: 'processing',
      progress: 20,
      settings: getSettingsForFile(),
    };
    onUpdateFile(updatedItem);

    try {
      const settings = getSettingsForFile();
      const res = await compressFileApi(item.file, settings);

      const completedItem: FileItem = {
        ...item,
        status: 'completed',
        progress: 100,
        originalSize: res.originalSize,
        compressedSize: res.compressedSize,
        savedPercentage: res.savedPercentage,
        compressedUrl: res.dataUrl,
        processingTimeMs: res.processingTimeMs,
        settings,
      };
      onUpdateFile(completedItem);
    } catch (err: any) {
      const errorItem: FileItem = {
        ...item,
        status: 'error',
        progress: 0,
        error: err?.message || 'Compression failed',
      };
      onUpdateFile(errorItem);
    }
  };

  const processAllFiles = async () => {
    setIsProcessingAll(true);
    for (const item of files) {
      if (item.status !== 'completed') {
        await processSingleFile(item);
      }
    }
    setIsProcessingAll(false);
  };

  const handleDownloadSingle = (item: FileItem) => {
    if (!item.compressedUrl) return;
    const a = document.createElement('a');
    a.href = item.compressedUrl;
    const ext = item.settings.outputFormat || item.name.split('.').pop() || 'file';
    const baseName = item.name.substring(0, item.name.lastIndexOf('.')) || item.name;
    a.download = `${baseName}_compressed.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadAllZip = async () => {
    const completedFiles = files.filter((f) => f.status === 'completed' && f.compressedUrl);
    if (completedFiles.length === 0) return;

    try {
      const zip = new JSZip();
      for (const fileItem of completedFiles) {
        if (!fileItem.compressedUrl) continue;
        const ext = fileItem.settings.outputFormat || fileItem.name.split('.').pop() || 'file';
        const baseName = fileItem.name.substring(0, fileItem.name.lastIndexOf('.')) || fileItem.name;
        const fileName = `${baseName}_compressed.${ext}`;

        const parts = fileItem.compressedUrl.split(',');
        if (parts.length === 2) {
          zip.file(fileName, parts[1], { base64: true });
        } else {
          const response = await fetch(fileItem.compressedUrl);
          const blob = await response.blob();
          zip.file(fileName, blob);
        }
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'CompressHub_Batch_Compressed.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Batch Zip Error:', err);
      // Fallback: download each individually
      completedFiles.forEach((f) => handleDownloadSingle(f));
    }
  };

  const formatSize = (bytes: number) => {
    if (!bytes) return '0 B';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="w-5 h-5 text-indigo-500" />;
      case 'pdf':
        return <FileText className="w-5 h-5 text-rose-500" />;
      case 'video':
        return <Film className="w-5 h-5 text-purple-500" />;
      case 'audio':
        return <Music className="w-5 h-5 text-blue-500" />;
      case 'zip':
        return <Archive className="w-5 h-5 text-emerald-500" />;
      default:
        return <FileCode className="w-5 h-5 text-amber-500" />;
    }
  };

  const totalOriginalSize = files.reduce((acc, f) => acc + f.originalSize, 0);
  const totalCompressedSize = files.reduce(
    (acc, f) => acc + (f.compressedSize || f.originalSize),
    0
  );
  const totalSavedBytes = Math.max(0, totalOriginalSize - totalCompressedSize);
  const totalSavedPercent =
    totalOriginalSize > 0
      ? Math.round((totalSavedBytes / totalOriginalSize) * 100)
      : 0;

  const completedCount = files.filter((f) => f.status === 'completed').length;

  return (
    <div className="w-full max-w-5xl mx-auto my-8 px-4 animate-fade-in">
      {/* AI Recommendation Tip Banner */}
      {aiTip && (
        <div className="mb-6 p-4 rounded-2xl bg-indigo-50/90 dark:bg-indigo-500/10 backdrop-blur-xl border border-indigo-200 dark:border-indigo-400/20 flex items-start gap-3 shadow-md dark:shadow-lg">
          <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-slate-800 dark:text-indigo-100">
            <span className="font-bold text-indigo-700 dark:text-indigo-300">AI Optimization Tip:</span>{' '}
            {aiTip}
          </div>
        </div>
      )}

      {/* Main Control Panel & Settings Header */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl backdrop-blur-2xl mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-white/10">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Compression Configuration
            </h2>
            <p className="text-xs text-slate-500 dark:text-indigo-200/70 mt-1">
              Customize compression parameters or set exact target file size limit.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onAddMoreFiles}
              className="px-3.5 py-2 text-xs font-medium rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 dark:text-indigo-100 dark:bg-white/10 dark:hover:bg-white/20 dark:border-white/10 backdrop-blur-md transition-colors"
            >
              + Add Files
            </button>
            <button
              onClick={onClearFiles}
              className="px-3.5 py-2 text-xs font-medium rounded-xl text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 dark:text-rose-300 dark:bg-rose-500/15 dark:hover:bg-rose-500/25 dark:border-rose-400/20 backdrop-blur-md transition-colors"
            >
              Clear Queue
            </button>
          </div>
        </div>

        {/* Compression Level Selector */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-6">
          <button
            onClick={() => handlePresetChange('extreme')}
            className={`p-4 rounded-2xl border text-left transition-all backdrop-blur-md ${
              globalPreset === 'extreme'
                ? 'border-indigo-500 bg-indigo-50/90 text-slate-900 dark:border-indigo-400/60 dark:bg-indigo-500/20 ring-2 ring-indigo-400/50 shadow-md'
                : 'border-slate-200/80 bg-white/80 hover:bg-white text-slate-700 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900 dark:text-white">Extreme</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-400/30">
                -85%
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-indigo-200/70 mt-1">
              Maximum file reduction. Great for low bandwidth.
            </p>
          </button>

          <button
            onClick={() => handlePresetChange('balanced')}
            className={`p-4 rounded-2xl border text-left transition-all backdrop-blur-md ${
              globalPreset === 'balanced'
                ? 'border-indigo-500 bg-indigo-50/90 text-slate-900 dark:border-indigo-400/60 dark:bg-indigo-500/20 ring-2 ring-indigo-400/50 shadow-md'
                : 'border-slate-200/80 bg-white/80 hover:bg-white text-slate-700 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900 dark:text-white">Recommended</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-400/30">
                Balanced
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-indigo-200/70 mt-1">
              Best ratio of sharp visual quality & file size saving.
            </p>
          </button>

          <button
            onClick={() => handlePresetChange('low')}
            className={`p-4 rounded-2xl border text-left transition-all backdrop-blur-md ${
              globalPreset === 'low'
                ? 'border-indigo-500 bg-indigo-50/90 text-slate-900 dark:border-indigo-400/60 dark:bg-indigo-500/20 ring-2 ring-indigo-400/50 shadow-md'
                : 'border-slate-200/80 bg-white/80 hover:bg-white text-slate-700 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900 dark:text-white">Light</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-400/30">
                High Quality
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-indigo-200/70 mt-1">
              Light touch-up compression with lossless feel.
            </p>
          </button>

          <button
            onClick={() => handlePresetChange('custom')}
            className={`p-4 rounded-2xl border text-left transition-all backdrop-blur-md ${
              globalPreset === 'custom'
                ? 'border-indigo-500 bg-indigo-50/90 text-slate-900 dark:border-indigo-400/60 dark:bg-indigo-500/20 ring-2 ring-indigo-400/50 shadow-md'
                : 'border-slate-200/80 bg-white/80 hover:bg-white text-slate-700 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900 dark:text-white">Custom Target</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-200 dark:bg-purple-500/20 dark:text-purple-300 dark:border-purple-400/30">
                KB / MB
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-indigo-200/70 mt-1">
              Specify exact target size threshold for attachments.
            </p>
          </button>
        </div>

        {/* Detailed Slider & Inputs */}
        <div className="mt-6 pt-6 border-t border-slate-200/80 dark:border-white/10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Quality Slider */}
          <div>
            <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-indigo-100 mb-2">
              <span>Quality Factor:</span>
              <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-400/30">
                {globalQuality}%
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={globalQuality}
              onChange={(e) => {
                setGlobalQuality(parseInt(e.target.value));
                setGlobalPreset('custom');
              }}
              className="w-full accent-indigo-600 dark:accent-indigo-400 cursor-pointer"
            />
          </div>

          {/* Custom Size KB Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-indigo-100 mb-2">
              Target Size Limit (Optional KB):
            </label>
            <input
              type="number"
              placeholder="e.g. 500 KB"
              value={customTargetKb}
              onChange={(e) => {
                setCustomTargetKb(e.target.value);
                setGlobalPreset('custom');
              }}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-white/10 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-indigo-200/50 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 backdrop-blur-md"
            />
          </div>

          {/* Format Conversion Options */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-indigo-100 mb-2">
              Convert Image Format:
            </label>
            <select
              value={outputFormat}
              onChange={(e) => setOutputFormat(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-slate-900/80 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 backdrop-blur-md"
            >
              <option value="original">Keep Original Format</option>
              <option value="webp">Convert to WebP (Recommended)</option>
              <option value="avif">Convert to AVIF (Next-Gen)</option>
              <option value="jpeg">Convert to JPEG</option>
              <option value="png">Convert to PNG</option>
            </select>
          </div>
        </div>

        {/* Checkbox Options */}
        <div className="mt-4 flex items-center gap-6 text-xs text-slate-600 dark:text-indigo-200/80">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={preserveMetadata}
              onChange={(e) => setPreserveMetadata(e.target.checked)}
              className="rounded-xs text-indigo-600 focus:ring-indigo-500 dark:text-indigo-500 dark:focus:ring-indigo-400"
            />
            <span>Preserve EXIF & Camera Metadata</span>
          </label>
        </div>

        {/* Global Batch Process Button */}
        <div className="mt-6 pt-6 border-t border-slate-200/80 dark:border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-slate-500 dark:text-indigo-200/70">
            {files.length} file(s) queued ({formatSize(totalOriginalSize)})
          </div>

          <div className="flex items-center gap-3">
            {completedCount > 1 && (
              <button
                onClick={handleDownloadAllZip}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600/80 dark:hover:bg-emerald-500 border border-emerald-500 dark:border-emerald-400/30 backdrop-blur-md transition-all shadow-md shadow-emerald-600/20"
              >
                <FolderArchive className="w-4 h-4" />
                Download All ZIP ({completedCount})
              </button>
            )}

            <button
              onClick={processAllFiles}
              disabled={isProcessingAll}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600/90 dark:hover:bg-indigo-500 border border-indigo-500 dark:border-indigo-400/30 backdrop-blur-md transition-all shadow-md dark:shadow-lg dark:shadow-indigo-600/30 disabled:opacity-50"
            >
              <Zap className="w-4 h-4 fill-white" />
              {isProcessingAll ? 'Compressing Batch...' : 'Compress All Files'}
            </button>
          </div>
        </div>
      </div>

      {/* Total Savings Summary Banner if any file completed */}
      {completedCount > 0 && (
        <div className="mb-6 p-5 rounded-2xl bg-emerald-50 border border-emerald-200 dark:bg-emerald-500/15 backdrop-blur-xl dark:border-emerald-400/25 flex flex-wrap items-center justify-between gap-4 animate-fade-in shadow-md dark:shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-400/30">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Compression Complete! Saved {formatSize(totalSavedBytes)} ({totalSavedPercent}%)
              </h3>
              <p className="text-xs text-slate-600 dark:text-indigo-100/70">
                Reduced total file footprint from {formatSize(totalOriginalSize)} down to {formatSize(totalCompressedSize)}.
              </p>
            </div>
          </div>

          <button
            onClick={handleDownloadAllZip}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 dark:text-emerald-100 dark:bg-emerald-500/20 dark:hover:bg-emerald-500/30 dark:border-emerald-400/30 backdrop-blur-md transition-colors"
          >
            <Download className="w-4 h-4" />
            Instant Download
          </button>
        </div>
      )}

      {/* File Queue List */}
      <div className="space-y-4">
        {files.map((fileItem) => {
          const isCompleted = fileItem.status === 'completed';
          const isProcessing = fileItem.status === 'processing';
          const isError = fileItem.status === 'error';

          return (
            <div
              key={fileItem.id}
              className="bg-white/80 dark:bg-white/5 backdrop-blur-xl p-5 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-md dark:shadow-lg transition-all hover:border-indigo-300 dark:hover:border-white/20 hover:bg-white dark:hover:bg-white/10"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* File Header Details */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 shrink-0">
                    {getFileIcon(fileItem.type)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                      {fileItem.name}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-indigo-200/70 mt-0.5">
                      <span>Original: {formatSize(fileItem.originalSize)}</span>
                      {isCompleted && (
                        <>
                          <span>•</span>
                          <span className="font-bold text-indigo-700 dark:text-indigo-300">
                            Compressed: {formatSize(fileItem.compressedSize || 0)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Status / Controls */}
                <div className="flex items-center gap-3 shrink-0">
                  {isCompleted && (
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-400/30 backdrop-blur-md">
                        -{fileItem.savedPercentage}%
                      </span>

                      {fileItem.type === 'image' && fileItem.compressedUrl && (
                        <button
                          onClick={() => setComparisonFile(fileItem)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 dark:text-indigo-100 dark:bg-white/10 dark:hover:bg-white/20 dark:border-white/10 backdrop-blur-md transition-colors"
                          title="Compare Visual Quality"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Compare</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleDownloadSingle(fileItem)}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600/90 dark:hover:bg-indigo-500 border border-indigo-500 dark:border-indigo-400/30 backdrop-blur-md transition-colors shadow-sm"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>
                    </div>
                  )}

                  {!isCompleted && !isProcessing && (
                    <button
                      onClick={() => processSingleFile(fileItem)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600/90 dark:hover:bg-indigo-500 border border-indigo-500 dark:border-indigo-400/30 backdrop-blur-md transition-colors"
                    >
                      <Zap className="w-3.5 h-3.5 fill-white" />
                      <span>Compress</span>
                    </button>
                  )}

                  {isProcessing && (
                    <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-300">
                      <div className="w-4 h-4 border-2 border-indigo-500 dark:border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </div>
                  )}

                  {isError && (
                    <div className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-300 font-medium">
                      <AlertCircle className="w-4 h-4" />
                      <span>Failed</span>
                    </div>
                  )}

                  <button
                    onClick={() => onRemoveFile(fileItem.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:text-indigo-200/60 dark:hover:text-white dark:hover:bg-white/10 transition-colors"
                    title="Remove from queue"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Progress bar during processing */}
              {isProcessing && (
                <div className="mt-3 w-full bg-slate-200 dark:bg-white/10 rounded-full h-1.5 overflow-hidden border border-slate-300 dark:border-white/5">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-400 dark:to-purple-400 h-full transition-all duration-300 shadow-sm"
                    style={{ width: `${fileItem.progress}%` }}
                  ></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Comparison Modal for Images */}
      {comparisonFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-3xl p-6 bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-zinc-800 mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Visual Quality Comparison: {comparisonFile.name}
              </h3>
              <button
                onClick={() => setComparisonFile(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <ComparisonSlider
              originalUrl={URL.createObjectURL(comparisonFile.file)}
              compressedUrl={comparisonFile.compressedUrl!}
              originalSize={comparisonFile.originalSize}
              compressedSize={comparisonFile.compressedSize!}
              savedPercentage={comparisonFile.savedPercentage!}
            />

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setComparisonFile(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white"
              >
                Close View
              </button>
              <button
                onClick={() => {
                  handleDownloadSingle(comparisonFile);
                  setComparisonFile(null);
                }}
                className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md"
              >
                <Download className="w-4 h-4" />
                Download Compressed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
