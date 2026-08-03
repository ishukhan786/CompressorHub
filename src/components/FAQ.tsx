import React, { useState } from 'react';
import { ChevronDown, Search, HelpCircle } from 'lucide-react';
import { FAQ_ITEMS } from '../data/compressors';

export function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = FAQ_ITEMS.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="py-16 px-4 max-w-4xl mx-auto border-t border-slate-200/80 dark:border-white/10">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-300 dark:border-indigo-400/30 backdrop-blur-md text-xs font-semibold mb-3">
          <HelpCircle className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-300" />
          <span>Frequently Asked Questions</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Got Questions? We Have Answers.
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-indigo-100/80">
          Everything you need to know about privacy, compression quality, and file limits.
        </p>

        {/* Search Bar */}
        <div className="mt-6 relative max-w-md mx-auto">
          <Search className="w-4 h-4 text-slate-400 dark:text-indigo-200/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-white/10 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-indigo-200/50 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 backdrop-blur-md"
          />
        </div>
      </div>

      <div className="space-y-3">
        {filteredItems.map((item, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-xl overflow-hidden transition-all hover:border-indigo-300 dark:hover:border-white/20"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-white/10 transition-colors"
              >
                <span>{item.question}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 dark:text-indigo-200/60 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-indigo-600 dark:text-indigo-300' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-indigo-100/80 leading-relaxed border-t border-slate-200 dark:border-white/10 animate-fade-in">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
