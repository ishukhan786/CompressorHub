import React from 'react';
import { Upload, Sliders, Download } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      num: '01',
      icon: <Upload className="w-6 h-6 text-indigo-500" />,
      title: 'Upload Your Files',
      desc: 'Drag & drop single or multiple files (images, PDFs, videos, documents, or ZIPs) into the upload area.',
    },
    {
      num: '02',
      icon: <Sliders className="w-6 h-6 text-purple-500" />,
      title: 'Select Compression Level',
      desc: 'Choose from Extreme, Recommended, Light, or type a custom KB/MB target size for attachments.',
    },
    {
      num: '03',
      icon: <Download className="w-6 h-6 text-emerald-500" />,
      title: 'Download & Purge',
      desc: 'Download your compressed file instantly. All uploaded buffers are automatically wiped clean immediately.',
    },
  ];

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-white/10">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          3 Simple Steps to Smaller Files
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-indigo-100/80">
          Fast, effortless, and intuitive workflow designed for instant productivity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className="relative p-8 rounded-3xl bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-md dark:shadow-xl hover:border-indigo-300 dark:hover:border-white/20 hover:bg-white dark:hover:bg-white/10 glass-hover transition-all"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10">
                {step.icon}
              </div>
              <span className="text-3xl font-black text-slate-300 dark:text-white/20">
                {step.num}
              </span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {step.title}
            </h3>

            <p className="text-xs text-slate-600 dark:text-indigo-100/70 mt-2 leading-relaxed">
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
