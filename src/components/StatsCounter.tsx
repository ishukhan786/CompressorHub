import React from 'react';
import { HardDrive, FileCheck, Shield, Zap } from 'lucide-react';

export function StatsCounter() {
  const stats = [
    {
      icon: <HardDrive className="w-5 h-5 text-indigo-500" />,
      value: '14.8 TB',
      label: 'Bandwidth & Storage Saved',
    },
    {
      icon: <FileCheck className="w-5 h-5 text-emerald-500" />,
      value: '1,280,000+',
      label: 'Files Processed Today',
    },
    {
      icon: <Shield className="w-5 h-5 text-purple-500" />,
      value: '0 Bytes',
      label: 'Stored on Servers',
    },
    {
      icon: <Zap className="w-5 h-5 text-amber-500" />,
      value: '0.4s Avg',
      label: 'Compression Latency',
    },
  ];

  return (
    <div className="my-12 px-4 max-w-7xl mx-auto">
      <div className="p-8 rounded-3xl bg-white/80 dark:bg-white/5 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 shadow-lg dark:shadow-2xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-white/10">
          {stats.map((stat, idx) => (
            <div key={idx} className="pt-4 md:pt-0 px-2">
              <div className="flex items-center justify-center gap-2 mb-2">
                {stat.icon}
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-indigo-900 to-indigo-600 dark:from-white dark:via-indigo-200 dark:to-indigo-300">
                  {stat.value}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-indigo-100/70 font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
