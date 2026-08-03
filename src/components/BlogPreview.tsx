import React, { useState } from 'react';
import { BookOpen, Clock, ArrowRight, X } from 'lucide-react';
import { ARTICLES } from '../data/compressors';
import { Article } from '../types';

export function BlogPreview() {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-white/10">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-700 border border-purple-200 dark:bg-purple-500/20 dark:text-purple-300 dark:border-purple-400/30 backdrop-blur-md text-xs font-semibold mb-3">
            <BookOpen className="w-3.5 h-3.5 text-purple-600 dark:text-purple-300" />
            <span>Optimization Knowledge Hub</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Latest Compression & Format Insights
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {ARTICLES.map((art) => (
          <div
            key={art.id}
            onClick={() => setSelectedArticle(art)}
            className="group cursor-pointer p-6 rounded-3xl bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-md dark:shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between hover:border-indigo-400 hover:bg-white dark:hover:border-indigo-400/80 dark:hover:bg-white/10 glass-hover"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-indigo-200/60 mb-3">
                <span className="font-bold text-indigo-700 dark:text-indigo-300">
                  {art.category}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {art.readTime}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors leading-snug">
                {art.title}
              </h3>

              <p className="text-xs text-slate-600 dark:text-indigo-100/70 mt-2.5 line-clamp-3 leading-relaxed">
                {art.summary}
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-300">
              <span>Read Full Article</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {/* Article Reader Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/70 backdrop-blur-xl animate-fade-in">
          <div className="relative w-full max-w-2xl p-6 sm:p-8 bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-white/15 shadow-2xl max-h-[80vh] overflow-y-auto">
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-6 right-6 p-1.5 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:text-indigo-200/60 dark:hover:text-white dark:hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-300 mb-2">
              <span>{selectedArticle.category}</span>
              <span>•</span>
              <span>{selectedArticle.readTime}</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mb-4 pr-8">
              {selectedArticle.title}
            </h2>

            <div className="prose prose-sm text-slate-700 dark:text-indigo-100/80 leading-relaxed whitespace-pre-line">
              {selectedArticle.content}
            </div>

            <div className="mt-8 pt-4 border-t border-slate-200 dark:border-white/10 flex justify-end">
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600/90 dark:hover:bg-indigo-500 border border-indigo-500 dark:border-indigo-400/30 rounded-xl transition-colors shadow-sm"
              >
                Done Reading
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
