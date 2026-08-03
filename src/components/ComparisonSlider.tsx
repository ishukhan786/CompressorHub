import React, { useState, useRef } from 'react';
import { Sparkles, Sliders } from 'lucide-react';

interface ComparisonSliderProps {
  originalUrl: string;
  compressedUrl: string;
  originalSize: number;
  compressedSize: number;
  savedPercentage: number;
}

export function ComparisonSlider({
  originalUrl,
  compressedUrl,
  originalSize,
  compressedSize,
  savedPercentage,
}: ComparisonSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    setSliderPosition(percentage);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  return (
    <div className="w-full bg-slate-50 dark:bg-zinc-950 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-xl overflow-hidden">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-zinc-800 text-xs sm:text-sm font-semibold text-slate-700 dark:text-zinc-300">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>Interactive Visual Quality Comparison</span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>-{savedPercentage}% Reduced</span>
        </div>
      </div>

      <div
        ref={containerRef}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMouseMove}
        onTouchStart={() => setIsDragging(true)}
        onTouchEnd={() => setIsDragging(false)}
        onTouchMove={handleTouchMove}
        className="relative w-full h-[280px] sm:h-[380px] select-none cursor-ew-resize rounded-xl overflow-hidden bg-slate-200 dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800"
      >
        {/* Compressed Image (Background) */}
        <img
          src={compressedUrl}
          alt="Compressed"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
        />

        {/* Original Image (Clipped Overlay) */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={originalUrl}
            alt="Original"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none max-w-none"
            style={{ width: containerRef.current?.clientWidth || '100%' }}
          />
        </div>

        {/* Slider Divider Bar */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] cursor-ew-resize"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-zinc-900 shadow-xl flex items-center justify-center font-bold text-xs border-2 border-indigo-500">
            ↔
          </div>
        </div>

        {/* Left Label: Original */}
        <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-md text-white text-xs font-semibold border border-white/20">
          Original: {formatSize(originalSize)}
        </div>

        {/* Right Label: Compressed */}
        <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-indigo-600/90 backdrop-blur-md text-white text-xs font-semibold border border-indigo-400/30">
          Compressed: {formatSize(compressedSize)}
        </div>
      </div>
    </div>
  );
}
