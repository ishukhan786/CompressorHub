import React from 'react';
import { Layers, Target, ShieldCheck, RefreshCw, Cpu, HardDrive } from 'lucide-react';

export function FeaturesGrid() {
  const features = [
    {
      icon: <Layers className="w-6 h-6 text-indigo-500" />,
      title: 'Batch Multi-File Compression',
      desc: 'Upload 20+ files simultaneously and download them packaged cleanly in a single ZIP archive.',
    },
    {
      icon: <Target className="w-6 h-6 text-purple-500" />,
      title: 'Custom Target Size Input (KB / MB)',
      desc: 'Specify exact maximum target sizes (e.g. 500 KB limit for job portals or email attachments).',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-rose-500" />,
      title: 'EXIF & GPS Data Stripping',
      desc: 'Protect personal location and device privacy by removing camera EXIF headers automatically.',
    },
    {
      icon: <RefreshCw className="w-6 h-6 text-emerald-500" />,
      title: 'Next-Gen Format Conversion',
      desc: 'Convert heavy PNG/JPG files into WebP or AVIF formats for maximum speed and SEO scores.',
    },
    {
      icon: <Cpu className="w-6 h-6 text-blue-500" />,
      title: 'Sharp & MozJPEG Encoders',
      desc: 'Powered by industry-standard C++ compiled Sharp, MozJPEG, PNGQuant, and PDF-Lib engines.',
    },
    {
      icon: <HardDrive className="w-6 h-6 text-amber-500" />,
      title: 'Zero Storage Footprint',
      desc: 'Files live strictly in temporary memory buffers and are wiped clean post-download.',
    },
  ];

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-white/10">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Comprehensive Toolset & Core Capabilities
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-indigo-100/80">
          Everything you need for effortless document and asset optimization in one place.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feat, idx) => (
          <div
            key={idx}
            className="p-6 rounded-3xl bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-md dark:shadow-xl hover:border-indigo-300 dark:hover:border-white/20 hover:bg-white dark:hover:bg-white/10 glass-hover transition-all"
          >
            <div className="p-3 rounded-2xl bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 w-fit mb-4">
              {feat.icon}
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {feat.title}
            </h3>
            <p className="text-xs text-slate-600 dark:text-indigo-100/70 mt-2 leading-relaxed">
              {feat.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
