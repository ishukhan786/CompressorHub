import React from 'react';
import { Zap, Lock, ShieldCheck, Heart } from 'lucide-react';
import { CompressorType } from '../types';

interface FooterProps {
  onSelectCategory: (category: CompressorType | 'all') => void;
  onOpenSitemap: () => void;
  onScrollToDropzone: () => void;
}

export function Footer({
  onSelectCategory,
  onOpenSitemap,
  onScrollToDropzone,
}: FooterProps) {
  const toolsList: { id: CompressorType; label: string }[] = [
    { id: 'image', label: 'Image Compressor (JPG, PNG, WebP)' },
    { id: 'pdf', label: 'PDF Document Compressor' },
    { id: 'video', label: 'Video Compressor (MP4, MOV)' },
    { id: 'audio', label: 'Audio Track Compressor (MP3, WAV)' },
    { id: 'zip', label: 'ZIP Archive Compressor' },
    { id: 'word', label: 'Word Document Compressor (.docx)' },
    { id: 'excel', label: 'Excel Spreadsheet Compressor (.xlsx)' },
    { id: 'powerpoint', label: 'PowerPoint Deck Compressor (.pptx)' },
  ];

  return (
    <footer className="mt-20 border-t border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-2xl text-slate-600 dark:text-indigo-100/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md border border-white/20">
                <Zap className="w-4 h-4 fill-white" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
                CompressHub AI
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-indigo-100/70 max-w-sm leading-relaxed">
              Modern, privacy-first file compression platform. Reduce images, PDFs, videos, audio, and documents by up to 90% without visible quality loss. Free & unlimited forever.
            </p>

            <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-500/15 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-400/30 backdrop-blur-md w-fit">
              <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-300" />
              <span>Zero-Storage Auto-Purge Commitment</span>
            </div>
          </div>

          {/* Tools Grid */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Compression Tools
            </h4>
            <ul className="space-y-2 text-xs">
              {toolsList.map((t) => (
                <li key={t.id}>
                  <button
                    onClick={() => {
                      onSelectCategory(t.id);
                      onScrollToDropzone();
                    }}
                    className="hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors text-left"
                  >
                    {t.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Privacy & Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Security & SEO
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={onOpenSitemap}
                  className="hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors"
                >
                  SEO Sitemap & Robots Protocol
                </button>
              </li>
              <li className="flex items-center gap-1 text-slate-500 dark:text-indigo-100/60">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-300" />
                <span>SSL Encrypted Transmission</span>
              </li>
              <li className="text-slate-500 dark:text-indigo-100/60">
                <span>No File Retention Guarantee</span>
              </li>
              <li className="text-slate-500 dark:text-indigo-100/60">
                <span>Memory Buffer Purge Engine</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-indigo-200/60">
          <p>© {new Date().getFullYear()} CompressHub AI. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" /> by <span className="font-bold text-slate-700 dark:text-indigo-200 tracking-wide">Ishtiaq Uddin Bangash</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
