import React, { useState } from 'react';
import { BookOpen, Clock, ArrowRight, X, ChevronRight, ChevronLeft } from 'lucide-react';
import { ARTICLES } from '../data/compressors';
import { Article } from '../types';

const CATEGORY_COLORS: Record<string, string> = {
  'Image Optimization': 'text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-300 dark:bg-amber-500/10 dark:border-amber-400/20',
  'Document Management': 'text-rose-700 bg-rose-50 border-rose-200 dark:text-rose-300 dark:bg-rose-500/10 dark:border-rose-400/20',
  'Video Processing': 'text-violet-700 bg-violet-50 border-violet-200 dark:text-violet-300 dark:bg-violet-500/10 dark:border-violet-400/20',
  'Archive Compression': 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-300 dark:bg-emerald-500/10 dark:border-emerald-400/20',
  'Audio Optimization': 'text-blue-700 bg-blue-50 border-blue-200 dark:text-blue-300 dark:bg-blue-500/10 dark:border-blue-400/20',
};

const ARTICLES_PER_PAGE = 6;

const categories = ['All', ...Array.from(new Set(ARTICLES.map((a) => a.category)))];

export function BlogPreview() {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [page, setPage] = useState(0);

  const filtered = activeCategory === 'All'
    ? ARTICLES
    : ARTICLES.filter((a) => a.category === activeCategory);

  const totalPages = Math.ceil(filtered.length / ARTICLES_PER_PAGE);
  const paginated = filtered.slice(page * ARTICLES_PER_PAGE, (page + 1) * ARTICLES_PER_PAGE);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setPage(0);
  };

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-white/10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-700 border border-purple-200 dark:bg-purple-500/20 dark:text-purple-300 dark:border-purple-400/30 backdrop-blur-md text-xs font-semibold mb-3">
            <BookOpen className="w-3.5 h-3.5 text-purple-600 dark:text-purple-300" />
            <span>Optimization Knowledge Hub</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Compression Guides & Insights
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-indigo-200/60 max-w-xl">
            Expert tutorials on image, video, audio, PDF and document compression — updated regularly for 2026.
          </p>
        </div>
        <span className="text-sm font-semibold text-slate-400 dark:text-indigo-200/50 shrink-0">
          {filtered.length} articles
        </span>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${
              activeCategory === cat
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-500/30'
                : 'bg-white/80 dark:bg-white/5 text-slate-600 dark:text-indigo-200/70 border-slate-200 dark:border-white/10 hover:border-indigo-400 dark:hover:border-indigo-400/50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginated.map((art) => {
          const catColor = CATEGORY_COLORS[art.category] || 'text-indigo-700 bg-indigo-50 border-indigo-200 dark:text-indigo-300 dark:bg-indigo-500/10 dark:border-indigo-400/20';
          return (
            <div
              key={art.id}
              onClick={() => setSelectedArticle(art)}
              className="group cursor-pointer p-6 rounded-3xl bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-md dark:shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between hover:border-indigo-400 hover:bg-white dark:hover:border-indigo-400/80 dark:hover:bg-white/10"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${catColor}`}>
                    {art.category}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-slate-400 dark:text-indigo-200/50 font-medium">
                    <Clock className="w-3 h-3" />
                    {art.readTime}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors leading-snug mb-2">
                  {art.title}
                </h3>

                <p className="text-xs text-slate-500 dark:text-indigo-100/60 line-clamp-3 leading-relaxed">
                  {art.summary}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-300">
                <span>{art.date}</span>
                <div className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-10">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="p-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-white/5 text-slate-600 dark:text-indigo-200/70 hover:border-indigo-400 dark:hover:border-indigo-400/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`w-8 h-8 rounded-xl text-xs font-bold border transition-all ${
                page === i
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                  : 'bg-white/80 dark:bg-white/5 text-slate-600 dark:text-indigo-200/70 border-slate-200 dark:border-white/10 hover:border-indigo-400'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            className="p-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-white/5 text-slate-600 dark:text-indigo-200/70 hover:border-indigo-400 dark:hover:border-indigo-400/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Article Reader Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/70 backdrop-blur-xl animate-fade-in">
          <div className="relative w-full max-w-2xl p-6 sm:p-8 bg-white dark:bg-slate-900/95 rounded-3xl border border-slate-200 dark:border-white/15 shadow-2xl max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-6 right-6 p-1.5 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:text-indigo-200/60 dark:hover:text-white dark:hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-bold mb-4">
              <span className={`px-2.5 py-1 rounded-full border ${CATEGORY_COLORS[selectedArticle.category] || 'text-indigo-600 bg-indigo-50 border-indigo-200 dark:text-indigo-300 dark:bg-indigo-500/10 dark:border-indigo-400/20'}`}>
                {selectedArticle.category}
              </span>
              <span className="text-slate-400 dark:text-indigo-200/50 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {selectedArticle.readTime}
              </span>
              <span className="text-slate-400 dark:text-indigo-200/50">• {selectedArticle.date}</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mb-5 pr-8">
              {selectedArticle.title}
            </h2>

            <div className="prose prose-sm max-w-none text-slate-700 dark:text-indigo-100/80 leading-relaxed whitespace-pre-line">
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
