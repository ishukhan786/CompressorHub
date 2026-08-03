import { Zap, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { CompressorType } from '../types';

interface HeroProps {
  activeCategory: CompressorType | 'all';
  onSelectCategory: (category: CompressorType | 'all') => void;
  onScrollToDropzone: () => void;
}

export function Hero({
  activeCategory,
  onSelectCategory,
  onScrollToDropzone,
}: HeroProps) {
  const categoryPills: { id: CompressorType | 'all'; label: string; count: string }[] = [
    { id: 'all', label: '⚡ All Formats', count: '10+ Types' },
    { id: 'image', label: '🖼️ Images', count: 'JPG, PNG, WebP' },
    { id: 'pdf', label: '📄 PDF', count: 'Smart Flatten' },
    { id: 'video', label: '🎬 Video', count: 'MP4, MOV, WebM' },
    { id: 'audio', label: '🎵 Audio', count: 'MP3, WAV, AAC' },
    { id: 'zip', label: '📦 ZIP Archive', count: 'Level 9 Deflate' },
    { id: 'word', label: '📝 Office Suite', count: 'DOCX, XLSX, PPTX' },
  ];

  return (
    <div className="relative pt-8 pb-6 md:pt-14 md:pb-10 overflow-hidden">
      {/* Background Gradient Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none opacity-40 blur-3xl -z-10">
        <div className="absolute top-10 left-1/4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-screen filter blur-2xl animate-pulse"></div>
        <div className="absolute top-10 right-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-screen filter blur-2xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-4xl mx-auto text-center px-4">
        {/* Top Feature Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50/80 dark:bg-white/10 backdrop-blur-md border border-indigo-200 dark:border-white/20 shadow-md mb-6">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-300 animate-spin-slow" />
          <span className="text-xs font-semibold text-indigo-900 dark:text-indigo-100">
            Next-Gen AI Compression Engine • 100% Free & Unlimited
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
          Compress Files Up to{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-300 dark:via-purple-300 dark:to-pink-300">
            90% Smaller
          </span>{' '}
          Without Losing Quality
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-indigo-100/80 max-w-2xl mx-auto leading-relaxed">
          Ultra-fast, privacy-first compression for Images, PDFs, Videos, Audio, ZIP archives, and Office documents. Zero account needed.
        </p>

        {/* Quick Trust Checklist */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs sm:text-sm font-medium text-slate-700 dark:text-indigo-200/90">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 backdrop-blur-md">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>No Registration</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 backdrop-blur-md">
            <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Instant Auto-Purge Privacy</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 backdrop-blur-md">
            <Zap className="w-4 h-4 text-amber-500 fill-amber-500 dark:text-amber-400 dark:fill-amber-400" />
            <span>Lightning Fast Engine</span>
          </div>
        </div>

        {/* Category Selection Filter Bar */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {categoryPills.map((pill) => {
            const isSelected = activeCategory === pill.id;
            return (
              <button
                key={pill.id}
                onClick={() => {
                  onSelectCategory(pill.id);
                  onScrollToDropzone();
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm dark:shadow-md backdrop-blur-md ${
                  isSelected
                    ? 'bg-indigo-600 text-white border border-indigo-500 dark:bg-indigo-600/90 dark:border-indigo-400/40 scale-105 ring-2 ring-indigo-400/50 shadow-indigo-500/30'
                    : 'bg-white/80 text-slate-700 border border-slate-200/80 hover:bg-white dark:bg-white/10 dark:text-indigo-100 dark:border-white/15 dark:hover:bg-white/20 hover:scale-102'
                }`}
              >
                <span>{pill.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                    isSelected
                      ? 'bg-indigo-700 text-white dark:bg-indigo-400/30 dark:text-white'
                      : 'bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-indigo-200/80 border border-slate-200 dark:border-white/10'
                  }`}
                >
                  {pill.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
