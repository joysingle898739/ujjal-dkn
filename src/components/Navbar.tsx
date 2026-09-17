import React from 'react';
import { 
  Smartphone, 
  Search, 
  PlusCircle, 
  Eye, 
  EyeOff, 
  HardDriveDownload,
  PackageCheck,
  Download
} from 'lucide-react';

interface NavbarProps {
  onOpenSpecialSearch: () => void;
  onOpenAddModal: () => void;
  onOpenBackupModal: () => void;
  onOpenApkModal: () => void;
  isPrivacyMode: boolean;
  onTogglePrivacyMode: () => void;
  totalDisplays: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSpecialSearch,
  onOpenAddModal,
  onOpenBackupModal,
  onOpenApkModal,
  isPrivacyMode,
  onTogglePrivacyMode,
  totalDisplays,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3.5">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Shop Branding */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-amber-500 via-orange-600 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/20 text-white flex-shrink-0">
              <Smartphone className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div className="truncate">
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-xl font-bold tracking-tight text-white truncate">
                  উজ্জ্বল ভাইয়ের দোকান
                </h1>
                <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  <PackageCheck className="w-3 h-3" />
                  স্টক লাইভ ({totalDisplays})
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 truncate">
                মোবাইল ডিসপ্লে স্টক ও আসল কেনা দামের ডিজিটাল খাতা
              </p>
            </div>
          </div>

          {/* Quick Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
            
            {/* The Special Search Button - Highlighted as requested */}
            <button
              id="special-search-btn"
              onClick={onOpenSpecialSearch}
              className="group relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/25 active:scale-95 transition-all cursor-pointer"
              title="মডেল সার্চ করুন"
            >
              <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-slate-950 stroke-[2.5] group-hover:scale-110 transition-transform" />
              <span className="font-semibold">স্পেশাল সার্চ</span>
              <span className="hidden lg:inline-block bg-amber-400/80 text-amber-950 text-[10px] font-mono px-1.5 py-0.5 rounded ml-0.5 font-bold">
                Ctrl+K
              </span>
            </button>

            {/* Privacy Mode Toggle (কেনা দাম লুকানো / দেখানো) */}
            <button
              id="privacy-toggle-btn"
              onClick={onTogglePrivacyMode}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl border text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                isPrivacyMode 
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/20' 
                  : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700/80 hover:text-white'
              }`}
              title={isPrivacyMode ? "কেনা দাম গোপন আছে (কাস্টমার মোড)" : "কেনা দাম দেখা যাচ্ছে"}
            >
              {isPrivacyMode ? (
                <>
                  <EyeOff className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline">দাম লুকানো</span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 text-slate-400" />
                  <span className="hidden sm:inline">দাম দৃশ্যমান</span>
                </>
              )}
            </button>

            {/* Mobile Storage Backup Modal Button */}
            <button
              id="backup-storage-btn"
              onClick={onOpenBackupModal}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 hover:bg-slate-800 transition-all cursor-pointer flex items-center gap-1.5 text-xs sm:text-sm"
              title="ফোনের স্টোরেজ ব্যাকআপ ও রিস্টোর"
            >
              <HardDriveDownload className="w-4 h-4 text-cyan-400" />
              <span className="hidden md:inline">ব্যাকআপ</span>
            </button>

            {/* Mobile App / APK Modal Button */}
            <button
              id="apk-download-btn"
              onClick={onOpenApkModal}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 hover:bg-amber-500/25 transition-all cursor-pointer flex items-center gap-1.5 text-xs sm:text-sm font-semibold"
              title="মোবাইল অ্যাপ (APK) ও ইনস্টলেশন গাইড"
            >
              <Download className="w-4 h-4 text-amber-400 stroke-[2.2]" />
              <span className="hidden sm:inline">APK / অ্যাপ</span>
            </button>

            {/* Add New Display Button */}
            <button
              id="add-display-btn"
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs sm:text-sm shadow-md shadow-emerald-900/30 active:scale-95 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.2]" />
              <span className="hidden sm:inline">নতুন ডিসপ্লে</span>
              <span className="sm:hidden">যোগ</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
