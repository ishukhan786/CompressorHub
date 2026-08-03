import React, { useState, useRef } from 'react';
import { Upload, Sparkles, AlertCircle, FileCheck2 } from 'lucide-react';
import { CompressorType } from '../types';
import { COMPRESSORS } from '../data/compressors';

interface DropzoneProps {
  activeCategory: CompressorType | 'all';
  onFilesSelected: (files: File[]) => void;
}

export function Dropzone({ activeCategory, onFilesSelected }: DropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const currentTool =
    activeCategory !== 'all'
      ? COMPRESSORS.find((c) => c.id === activeCategory)
      : null;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const processFileList = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setErrorMessage(null);

    const validFiles: File[] = [];
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      // Max 200MB limit check
      if (file.size > 200 * 1024 * 1024) {
        setErrorMessage(`"${file.name}" exceeds the 200 MB file limit.`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    processFileList(e.dataTransfer.files);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFileList(e.target.files);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div id="dropzone-section" className="w-full max-w-4xl mx-auto my-4 px-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative group cursor-pointer p-8 sm:p-12 rounded-3xl border-2 border-dashed transition-all duration-300 text-center overflow-hidden backdrop-blur-2xl ${
          isDragging
            ? 'border-indigo-500 bg-indigo-50 dark:border-indigo-400 dark:bg-indigo-500/20 scale-[1.01] shadow-2xl ring-4 ring-indigo-400/20'
            : 'border-slate-300 bg-white/80 hover:border-indigo-500/80 hover:bg-white dark:border-white/20 dark:bg-white/5 dark:hover:border-indigo-400/80 dark:hover:bg-white/10 glass-hover shadow-xl dark:shadow-2xl dark:shadow-black/40'
        }`}
      >
        {/* Background glow animation */}
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileChange}
          className="hidden"
          accept={
            currentTool
              ? currentTool.extensions.join(',')
              : '.jpg,.jpeg,.png,.webp,.avif,.pdf,.mp4,.webm,.mov,.avi,.mp3,.wav,.zip,.docx,.xlsx,.pptx'
          }
        />

        <div className="relative z-10 flex flex-col items-center justify-center">
          {/* Main Icon */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-xl shadow-indigo-500/40 group-hover:scale-110 transition-transform duration-300 mb-5 border border-white/20">
            <Upload className="w-8 h-8 sm:w-10 sm:h-10 animate-bounce-slow" />
          </div>

          {/* Heading */}
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Drag & Drop your files here
          </h2>

          <p className="mt-2 text-sm text-slate-600 dark:text-indigo-100/80 max-w-md">
            or <span className="font-semibold text-indigo-600 dark:text-indigo-300 underline underline-offset-4 decoration-indigo-400/50">browse from device</span>. Multiple files supported for batch compression.
          </p>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mt-4 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 dark:text-rose-200 dark:bg-rose-500/20 dark:border-rose-400/30 backdrop-blur-md">
              <AlertCircle className="w-4 h-4 text-rose-500 dark:text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Format Badges */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {currentTool ? (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-200 dark:border-indigo-400/30 backdrop-blur-md">
                <FileCheck2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-300" />
                Target Tool: {currentTool.title} ({currentTool.extensions.join(', ')})
              </span>
            ) : (
              <span className="text-xs text-slate-600 dark:text-indigo-200/70 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-300" />
                Supports JPG, PNG, WebP, AVIF, PDF, MP4, MOV, MP3, ZIP, DOCX, XLSX, PPTX (Up to 200MB)
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
