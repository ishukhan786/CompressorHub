import React from 'react';
import {
  Image as ImageIcon,
  FileText,
  Film,
  Music,
  Archive,
  FileCode,
  Table,
  Presentation,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { COMPRESSORS } from '../data/compressors';
import { CompressorType } from '../types';

interface SupportedFormatsProps {
  onSelectCategory: (category: CompressorType) => void;
  onScrollToDropzone: () => void;
}

export function SupportedFormats({
  onSelectCategory,
  onScrollToDropzone,
}: SupportedFormatsProps) {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Image':
        return <ImageIcon className="w-6 h-6" />;
      case 'FileText':
        return <FileText className="w-6 h-6" />;
      case 'Video':
        return <Film className="w-6 h-6" />;
      case 'Music':
        return <Music className="w-6 h-6" />;
      case 'Archive':
        return <Archive className="w-6 h-6" />;
      case 'FileCode':
        return <FileCode className="w-6 h-6" />;
      case 'Table':
        return <Table className="w-6 h-6" />;
      case 'Presentation':
        return <Presentation className="w-6 h-6" />;
      default:
        return <ImageIcon className="w-6 h-6" />;
    }
  };

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Supported Compression Modules
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-indigo-100/80">
          Tailored compression algorithms engineered for every file format. Select any tool to start compressing.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {COMPRESSORS.map((tool) => (
          <div
            key={tool.id}
            onClick={() => {
              onSelectCategory(tool.id);
              onScrollToDropzone();
            }}
            className="group cursor-pointer relative p-6 rounded-3xl bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-md dark:shadow-xl hover:border-indigo-400 hover:bg-white dark:hover:border-indigo-400/80 dark:hover:bg-white/10 glass-hover transition-all duration-300 hover:-translate-y-1"
          >
            {tool.popular && (
              <span className="absolute top-4 right-4 text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-300 dark:border-indigo-400/30 backdrop-blur-md">
                Popular
              </span>
            )}

            <div
              className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${tool.color} flex items-center justify-center text-white shadow-md mb-5 group-hover:scale-110 transition-transform border border-white/20`}
            >
              {getIcon(tool.iconName)}
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center justify-between">
              <span>{tool.title}</span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 dark:text-indigo-200/60 dark:group-hover:text-indigo-300 group-hover:translate-x-1 transition-all" />
            </h3>

            <p className="text-xs text-slate-600 dark:text-indigo-100/70 mt-2 leading-relaxed">
              {tool.description}
            </p>

            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/10 flex flex-wrap items-center gap-1.5">
              {tool.extensions.map((ext) => (
                <span
                  key={ext}
                  className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-indigo-200 border border-slate-200 dark:border-white/10"
                >
                  {ext}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
