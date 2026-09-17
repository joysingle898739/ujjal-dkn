import React from 'react';
import { Home, Search, PlusCircle, Gift, Download } from 'lucide-react';

interface BottomNavProps {
  onHomeClick: () => void;
  onSearchClick: () => void;
  onAddClick: () => void;
  onAboutClick: () => void;
  onApkClick: () => void;
  activeTab: 'home' | 'search' | 'add' | 'about' | 'apk';
}

export const BottomNav: React.FC<BottomNavProps> = ({
  onHomeClick,
  onSearchClick,
  onAddClick,
  onAboutClick,
  onApkClick,
  activeTab,
}) => {
  return (
    <nav 
      id="mobile-bottom-navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 shadow-[0_-8px_30px_rgba(0,0,0,0.5)] px-1 py-1.5"
    >
      <div className="max-w-lg mx-auto flex items-center justify-around">
        {/* 1. Home Button */}
        <button
          id="bottom-nav-home"
          onClick={onHomeClick}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all cursor-pointer ${
            activeTab === 'home'
              ? 'text-amber-400 bg-amber-500/15 scale-105'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-0.5 tracking-tight">হোম</span>
        </button>

        {/* 2. Instant Search Button */}
        <button
          id="bottom-nav-search"
          onClick={onSearchClick}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all cursor-pointer ${
            activeTab === 'search'
              ? 'text-cyan-400 bg-cyan-500/15 scale-105'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-0.5 tracking-tight">দাম খুঁজুন</span>
        </button>

        {/* 3. Add Display (Prominent Center/Action Button) */}
        <button
          id="bottom-nav-add"
          onClick={onAddClick}
          className="flex flex-col items-center justify-center py-0.5 px-2.5 rounded-2xl transition-all cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/30 group-active:scale-90 transition-transform">
            <PlusCircle className="w-4.5 h-4.5 font-bold" />
          </div>
          <span className="text-[10px] font-extrabold text-amber-300 mt-0.5">নতুন মাল</span>
        </button>

        {/* 4. APK / Mobile App Button */}
        <button
          id="bottom-nav-apk"
          onClick={onApkClick}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all cursor-pointer ${
            activeTab === 'apk'
              ? 'text-emerald-400 bg-emerald-500/15 scale-105'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Download className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-0.5 tracking-tight">APK / অ্যাপ</span>
        </button>

        {/* 5. About Button */}
        <button
          id="bottom-nav-about"
          onClick={onAboutClick}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all cursor-pointer ${
            activeTab === 'about'
              ? 'text-rose-400 bg-rose-500/15 scale-105'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Gift className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-0.5 tracking-tight">এবাউট</span>
        </button>
      </div>
    </nav>
  );
};
