import React from 'react';
import { Gamepad2, Sparkles } from 'lucide-react';

interface NavbarProps {
  onGoHome: () => void;
  onCreateClick: () => void;
  onDemoClick: () => void;
  activeView: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onGoHome,
  onCreateClick,
  onDemoClick,
  activeView,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark */}
        <button
          onClick={onGoHome}
          className="group flex items-center gap-2.5 text-slate-900 font-extrabold text-lg tracking-tight whitespace-nowrap shrink-0 cursor-pointer transition-opacity"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-sm shadow-emerald-600/30 group-hover:scale-105 transition-transform">
            <Gamepad2 className="w-5 h-5" />
          </div>
          <span className="group-hover:text-emerald-700 transition-colors">Lesson2Game</span>
          <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            v0.1
          </span>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <button
            onClick={onGoHome}
            className={`whitespace-nowrap shrink-0 hover:text-slate-950 transition-colors cursor-pointer ${
              activeView === 'landing' ? 'text-emerald-700 font-bold' : ''
            }`}
          >
            Trang Chủ
          </button>
          <button
            onClick={onCreateClick}
            className={`whitespace-nowrap shrink-0 hover:text-slate-950 transition-colors cursor-pointer ${
              activeView === 'upload' ? 'text-emerald-700 font-bold' : ''
            }`}
          >
            Tạo Game Mới
          </button>
          <button
            onClick={onDemoClick}
            className="whitespace-nowrap shrink-0 hover:text-slate-950 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Bản Mẫu Sinh Học</span>
          </button>
          <a
            href="#workflow"
            onClick={(e) => {
              if (activeView !== 'landing') {
                e.preventDefault();
                onGoHome();
                setTimeout(() => {
                  document.getElementById('workflow')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="whitespace-nowrap shrink-0 hover:text-slate-950 transition-colors"
          >
            Quy Trình AI
          </a>
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onCreateClick}
            className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm shadow-emerald-600/20 button-step-press whitespace-nowrap shrink-0 cursor-pointer"
          >
            Tạo Game Ngay
          </button>
        </div>
      </div>
    </header>
  );
};
