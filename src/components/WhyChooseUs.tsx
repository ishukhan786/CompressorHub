import React from 'react';
import { Lock, Zap, Sparkles, UserCheck, ShieldAlert } from 'lucide-react';

export function WhyChooseUs() {
  const pillars = [
    {
      icon: <Lock className="w-6 h-6 text-emerald-500" />,
      title: 'Privacy-First Architecture',
      description:
        'Files are processed in secure isolated memory buffers and deleted instantly after processing. We never store, index, or inspect your files.',
      badge: 'Zero Storage',
    },
    {
      icon: <UserCheck className="w-6 h-6 text-indigo-500" />,
      title: 'No Login or Credit Card Required',
      description:
        'Enjoy 100% free compression without signing up, entering personal email addresses, or dealing with annoying paywalls.',
      badge: '100% Free',
    },
    {
      icon: <Sparkles className="w-6 h-6 text-purple-500" />,
      title: 'Smart Quality Preservation',
      description:
        'Advanced perceptual algorithms remove invisible metadata and redundant bytes while preserving sharp edges, colors, and crisp text.',
      badge: 'Perceptual AI',
    },
    {
      icon: <Zap className="w-6 h-6 text-amber-500 fill-amber-500" />,
      title: 'Lightning Fast Parallel Engine',
      description:
        'Multi-threaded server processing handles single files or batch uploads in under a second for maximum productivity.',
      badge: '< 1s Latency',
    },
  ];

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-white/10">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Why Professionals Trust CompressHub AI
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-indigo-100/80">
          Designed for designers, developers, photographers, and teams who demand high-speed optimization and zero privacy risk.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {pillars.map((item, idx) => (
          <div
            key={idx}
            className="p-6 rounded-3xl bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-md dark:shadow-xl hover:border-indigo-300 dark:hover:border-white/20 hover:bg-white dark:hover:bg-white/10 glass-hover transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-2xl bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10">
                {item.icon}
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-300 dark:border-indigo-400/30 backdrop-blur-md">
                {item.badge}
              </span>
            </div>

            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {item.title}
            </h3>

            <p className="text-xs text-slate-600 dark:text-indigo-100/70 mt-2 leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
