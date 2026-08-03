import { useState, useEffect } from 'react';
import { CompressorType, FileItem } from './types';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Dropzone } from './components/Dropzone';
import { CompressorTool } from './components/CompressorTool';
import { SupportedFormats } from './components/SupportedFormats';
import { WhyChooseUs } from './components/WhyChooseUs';
import { FeaturesGrid } from './components/FeaturesGrid';
import { StatsCounter } from './components/StatsCounter';
import { HowItWorks } from './components/HowItWorks';
import { FAQ } from './components/FAQ';
import { BlogPreview } from './components/BlogPreview';
import { Footer } from './components/Footer';
import { SEOMeta } from './components/SEOMeta';
import { SitemapModal } from './components/SitemapModal';

function getCategoryFromMimeOrExt(filename: string, mimeType: string): CompressorType {
  const ext = filename.substring(filename.lastIndexOf('.')).toLowerCase();
  if (['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif'].includes(ext) || mimeType.startsWith('image/')) {
    return 'image';
  }
  if (ext === '.pdf' || mimeType === 'application/pdf') {
    return 'pdf';
  }
  if (['.mp4', '.webm', '.mov', '.avi', '.mkv'].includes(ext) || mimeType.startsWith('video/')) {
    return 'video';
  }
  if (['.mp3', '.wav', '.aac', '.ogg', '.flac'].includes(ext) || mimeType.startsWith('audio/')) {
    return 'audio';
  }
  if (ext === '.zip' || mimeType.includes('zip')) {
    return 'zip';
  }
  if (['.docx', '.doc'].includes(ext)) {
    return 'word';
  }
  if (['.xlsx', '.xls'].includes(ext)) {
    return 'excel';
  }
  if (['.pptx', '.ppt'].includes(ext)) {
    return 'powerpoint';
  }
  return 'image';
}

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [activeCategory, setActiveCategory] = useState<CompressorType | 'all'>('all');
  const [fileQueue, setFileQueue] = useState<FileItem[]>([]);
  const [sitemapOpen, setSitemapOpen] = useState<boolean>(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleToggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const handleFilesSelected = (files: File[]) => {
    const newItems: FileItem[] = files.map((file) => {
      const type = getCategoryFromMimeOrExt(file.name, file.type);
      return {
        id: `file_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        file,
        name: file.name,
        size: file.size,
        type,
        mimeType: file.type,
        status: 'idle',
        progress: 0,
        originalSize: file.size,
        settings: {
          preset: 'balanced',
          quality: 75,
          preserveMetadata: false,
        },
      };
    });

    setFileQueue((prev) => [...prev, ...newItems]);

    // Scroll to compressor tool queue
    setTimeout(() => {
      const el = document.getElementById('compressor-tool-workspace');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleUpdateFile = (updated: FileItem) => {
    setFileQueue((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
  };

  const handleRemoveFile = (id: string) => {
    setFileQueue((prev) => prev.filter((f) => f.id !== id));
  };

  const handleClearFiles = () => {
    setFileQueue([]);
  };

  const handleScrollToDropzone = () => {
    const el = document.getElementById('dropzone-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      className={`min-h-screen font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-300 relative ${
        isDarkMode
          ? 'bg-zinc-950 text-zinc-100 mesh-gradient-dark dark'
          : 'bg-slate-50 text-slate-900 mesh-gradient-light'
      }`}
    >
      {/* Ambient background glows for Frosted Glass theme */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/15 dark:bg-indigo-600/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-purple-500/15 dark:bg-purple-600/20 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-pink-500/10 dark:bg-pink-600/15 rounded-full blur-3xl animate-pulse-slow delay-2000"></div>
      </div>

      <SEOMeta />

      {/* Header Navigation */}
      <Header
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        onScrollToDropzone={handleScrollToDropzone}
      />

      <main className="relative z-10">
        {/* Hero Section */}
        <Hero
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          onScrollToDropzone={handleScrollToDropzone}
        />

        {/* Drag & Drop Upload Section */}
        <Dropzone
          activeCategory={activeCategory}
          onFilesSelected={handleFilesSelected}
        />

        {/* Active Compressor Queue Workspace */}
        {fileQueue.length > 0 && (
          <div id="compressor-tool-workspace">
            <CompressorTool
              files={fileQueue}
              onUpdateFile={handleUpdateFile}
              onRemoveFile={handleRemoveFile}
              onClearFiles={handleClearFiles}
              onAddMoreFiles={handleScrollToDropzone}
            />
          </div>
        )}

        {/* Supported Formats Grid */}
        <SupportedFormats
          onSelectCategory={setActiveCategory}
          onScrollToDropzone={handleScrollToDropzone}
        />

        {/* Why Choose Us Pillars */}
        <WhyChooseUs />

        {/* SaaS Core Capabilities Grid */}
        <FeaturesGrid />

        {/* Live Compression Stats */}
        <StatsCounter />

        {/* How It Works Guide */}
        <HowItWorks />

        {/* FAQ Accordion */}
        <FAQ />

        {/* Optimization Insights Blog */}
        <BlogPreview />
      </main>

      {/* Footer */}
      <Footer
        onSelectCategory={setActiveCategory}
        onOpenSitemap={() => setSitemapOpen(true)}
        onScrollToDropzone={handleScrollToDropzone}
      />

      {/* SEO Sitemap & Robots Modal */}
      <SitemapModal
        isOpen={sitemapOpen}
        onClose={() => setSitemapOpen(false)}
      />
    </div>
  );
}
