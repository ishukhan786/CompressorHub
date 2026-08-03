import React from 'react';
import { X, FileText, CheckCircle2, Shield } from 'lucide-react';

interface SitemapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SitemapModal({ isOpen, onClose }: SitemapModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-500" />
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              SEO Sitemap & Robots Protocol
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4 max-h-[60vh] overflow-y-auto pr-1 text-sm text-zinc-600 dark:text-zinc-300">
          <div>
            <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Indexed Endpoints (sitemap.xml)
            </h4>
            <div className="bg-zinc-50 dark:bg-zinc-950 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 font-mono text-xs space-y-1">
              <p>https://compresshub.ai/ [Priority: 1.0]</p>
              <p>https://compresshub.ai/compress-image [Priority: 0.9]</p>
              <p>https://compresshub.ai/compress-pdf [Priority: 0.9]</p>
              <p>https://compresshub.ai/compress-video [Priority: 0.9]</p>
              <p>https://compresshub.ai/compress-audio [Priority: 0.8]</p>
              <p>https://compresshub.ai/compress-zip [Priority: 0.8]</p>
              <p>https://compresshub.ai/compress-word [Priority: 0.8]</p>
              <p>https://compresshub.ai/compress-excel [Priority: 0.8]</p>
              <p>https://compresshub.ai/compress-powerpoint [Priority: 0.8]</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-blue-500" /> Robots Specification (robots.txt)
            </h4>
            <div className="bg-zinc-50 dark:bg-zinc-950 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 font-mono text-xs whitespace-pre-wrap">
{`User-agent: *
Allow: /
Disallow: /api/
Sitemap: https://compresshub.ai/sitemap.xml`}
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-500 transition-colors shadow-sm"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
}
