import { useState } from 'react';
import {
  Zap,
  Sun,
  Moon,
  Lock,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';
import { CompressorType } from '../types';

interface HeaderProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  activeCategory: CompressorType | 'all';
  onSelectCategory: (category: CompressorType | 'all') => void;
  onScrollToDropzone: () => void;
}

export function Header({
  isDarkMode,
  onToggleDarkMode,
  activeCategory,
  onSelectCategory,
  onScrollToDropzone,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navCategories: { id: CompressorType | 'all'; label: string }[] = [
    { id: 'all', label: 'All Tools' },
    { id: 'image', label: 'Images' },
    { id: 'pdf', label: 'PDF' },
    { id: 'video', label: 'Video' },
    { id: 'audio', label: 'Audio' },
    { id: 'zip', label: 'ZIP' },
    { id: 'word', label: 'Documents' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/70 dark:bg-slate-900/40 border-b border-slate-200/80 dark:border-white/10 shadow-sm dark:shadow-lg dark:shadow-black/20 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onSelectCategory('all');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 shadow-md shadow-indigo-500/30 group-hover:scale-105 transition-transform border border-white/20">
                <Zap className="w-5 h-5 text-white fill-white" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 via-indigo-900 to-indigo-600 dark:from-white dark:via-indigo-200 dark:to-indigo-400">
                    CompressHub
                  </span>
                  <span className="text-xs font-bold px-1.5 py-0.5 rounded-md bg-indigo-100 text-indigo-700 border border-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-300 dark:border-indigo-400/30 backdrop-blur-sm">
                    AI
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-indigo-200/70 hidden sm:block">
                  Frosted Glass Privacy Compression
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Category Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-200/50 dark:bg-white/5 backdrop-blur-md p-1 rounded-xl border border-slate-300/60 dark:border-white/10 shadow-inner">
            {navCategories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    onSelectCategory(cat.id);
                  }}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md font-semibold border border-indigo-500 dark:bg-indigo-600/80 dark:border-indigo-400/30 backdrop-blur-md'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-white/10'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2.5">
            {/* Privacy Badge */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 dark:text-emerald-300 dark:bg-emerald-500/10 dark:border-emerald-500/20 backdrop-blur-md">
              <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Zero-Storage Privacy</span>
            </div>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-200/60 border border-slate-300/80 dark:text-zinc-300 dark:hover:bg-white/10 dark:border-white/10 backdrop-blur-md transition-colors"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Theme"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button>

            {/* Quick Upload CTA */}
            <button
              onClick={onScrollToDropzone}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600/80 dark:hover:bg-indigo-500/90 rounded-xl border border-indigo-500 dark:border-indigo-400/30 backdrop-blur-md shadow-md dark:shadow-lg dark:shadow-indigo-500/25 transition-all active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Compress Now</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-200/60 border border-slate-300/80 dark:text-zinc-300 dark:hover:bg-white/10 dark:border-white/10 backdrop-blur-md"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-white/10 bg-white/95 dark:bg-slate-900/90 backdrop-blur-2xl px-4 pt-2 pb-4 space-y-2 animate-fade-in">
          <div className="text-xs font-semibold uppercase tracking-wider text-indigo-700 dark:text-indigo-300/60 px-2 pt-1">
            Tools Category
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {navCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id);
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-2 text-xs font-medium rounded-xl text-left transition-colors ${
                  activeCategory === cat.id
                    ? 'bg-indigo-600 text-white font-semibold border border-indigo-500 dark:bg-indigo-600/80 dark:border-indigo-400/30'
                    : 'bg-slate-100 text-slate-700 border border-slate-200 dark:bg-white/5 dark:text-zinc-300 dark:border-white/5 hover:bg-slate-200 dark:hover:bg-white/10'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                onScrollToDropzone();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-white bg-indigo-600/80 hover:bg-indigo-500 rounded-xl border border-indigo-400/30 shadow-lg shadow-indigo-500/20 backdrop-blur-md"
            >
              <Sparkles className="w-4 h-4" />
              Upload Files
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
