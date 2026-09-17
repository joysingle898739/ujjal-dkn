import React, { useRef, useState } from 'react';
import { 
  X, 
  HardDrive, 
  Download, 
  Upload, 
  FileSpreadsheet, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle,
  Smartphone
} from 'lucide-react';
import { DisplayItem } from '../types';
import { exportBackupJSON, exportBackupCSV } from '../utils/storage';
import { INITIAL_DISPLAYS } from '../data/initialData';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  displays: DisplayItem[];
  onRestoreDisplays: (restoredList: DisplayItem[]) => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  onClose,
  displays,
  onRestoreDisplays,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (!isOpen) return null;

  const handleExportJSON = () => {
    try {
      exportBackupJSON(displays);
      setNotification({
        type: 'success',
        message: 'ব্যাকআপ ফাইলটি আপনার ফোনের ডাউনলোড ফোল্ডারে সেভ হয়েছে!'
      });
      setTimeout(() => setNotification(null), 4000);
    } catch {
      setNotification({
        type: 'error',
        message: 'ফাইল ডাউনলোড করতে সমস্যা হয়েছে।'
      });
    }
  };

  const handleExportCSV = () => {
    try {
      exportBackupCSV(displays);
      setNotification({
        type: 'success',
        message: 'এক্সেল ফাইল (CSV) ডাউনলোড হয়েছে!'
      });
      setTimeout(() => setNotification(null), 4000);
    } catch {
      setNotification({
        type: 'error',
        message: 'ফাইল তৈরি করতে সমস্যা হয়েছে।'
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed) && parsed.length > 0) {
          onRestoreDisplays(parsed);
          setNotification({
            type: 'success',
            message: `সফলভাবে ${parsed.length} টি ডিসপ্লের রেকর্ড রিস্টোর করা হয়েছে!`
          });
          setTimeout(() => {
            setNotification(null);
            onClose();
          }, 1500);
        } else {
          setNotification({
            type: 'error',
            message: 'ভুল ফাইল ফরম্যাট! ব্যাকআপ JSON ফাইল নির্বাচন করুন।'
          });
        }
      } catch {
        setNotification({
          type: 'error',
          message: 'ফাইলটি পড়তে পারেনি। সঠিক ব্যাকআপ ফাইল দিন।'
        });
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleResetToDemo = () => {
    if (window.confirm('আপনি কি টেস্ট ডাটা দিয়ে আবার রিসেট করতে চান? বর্তমান ডাটা মুছে যাবে!')) {
      onRestoreDisplays(INITIAL_DISPLAYS);
      setNotification({
        type: 'success',
        message: 'নমুনা ডাটা পুনরায় লোড করা হয়েছে।'
      });
      setTimeout(() => {
        setNotification(null);
        onClose();
      }, 1200);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-in fade-in"
      onClick={onClose}
    >
      <div 
        id="backup-storage-modal"
        className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-6 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                মোবাইল স্টোরেজ ও ব্যাকআপ
              </h2>
              <p className="text-xs text-slate-400">
                ডাটা সংরক্ষণ, ডাউনলোড ও অন্য ফোনে স্থানান্তর
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs sm:text-sm">
          {notification && (
            <div className={`p-3 rounded-xl border flex items-center gap-2 font-medium ${
              notification.type === 'success'
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
            }`}>
              {notification.type === 'success' ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
              <span>{notification.message}</span>
            </div>
          )}

          {/* Info Card */}
          <div className="p-4 rounded-xl bg-slate-850/80 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-white font-semibold text-xs sm:text-sm">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>মোবাইলে ডাটা সেভ হওয়ার নিয়ম:</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              আপনার দোকানের প্রতিটি ডিসপ্লে ও আসল কেনা দাম সরাসরি আপনার ফোনের ব্রাউজার মেমোরিতে (LocalStorage) নিরাপদভাবে সেভ হচ্ছে। ইন্টারনেট না থাকলেও সম্পূর্ণ অফলাইনে এটি কাজ করবে।
            </p>
            <p className="text-slate-400 text-xs">
              ফোন রিস্টার্ট বা ব্রাউজারের হিস্ট্রি মুছলে যাতে ডাটা না হারায়, তার জন্য নিচে থেকে <strong className="text-amber-400">ব্যাকআপ ফাইল ডাউনলোড</strong> করে রাখুন।
            </p>
          </div>

          {/* Backup Download Actions */}
          <div className="space-y-2.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              ব্যাকআপ ডাউনলোড অপশন ({displays.length} টি ডিসপ্লে)
            </label>
            
            <button
              type="button"
              onClick={handleExportJSON}
              className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-white font-medium transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Download className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs sm:text-sm font-semibold">সম্পূর্ণ ব্যাকআপ ফাইল (JSON)</div>
                  <div className="text-[11px] text-slate-400">ভবিষ্যতে যে কোনো সময় হুবহু ফিরিয়ে আনার জন্য</div>
                </div>
              </div>
              <span className="text-xs text-amber-400 font-semibold px-2.5 py-1 rounded bg-amber-500/10">
                ডাউনলোড
              </span>
            </button>

            <button
              type="button"
              onClick={handleExportCSV}
              className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-white font-medium transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs sm:text-sm font-semibold">এক্সেল শিট ফাইল (CSV)</div>
                  <div className="text-[11px] text-slate-400">কম্পিউটারে দেখার বা প্রিন্ট করার জন্য</div>
                </div>
              </div>
              <span className="text-xs text-emerald-400 font-semibold px-2.5 py-1 rounded bg-emerald-500/10">
                এক্সেল
              </span>
            </button>
          </div>

          {/* Restore / Import */}
          <div className="pt-2 border-t border-slate-800 space-y-2.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              ব্যাকআপ ফাইল থেকে ফিরিয়ে আনুন (Restore)
            </label>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-white font-medium transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/15 text-cyan-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Upload className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs sm:text-sm font-semibold">ফাইল নির্বাচন করে আপলোড করুন</div>
                  <div className="text-[11px] text-slate-400">পূর্বে ডাউনলোড করা JSON ফাইল সিলেক্ট করুন</div>
                </div>
              </div>
              <span className="text-xs text-cyan-400 font-semibold px-2.5 py-1 rounded bg-cyan-500/10">
                ইম্পোর্ট
              </span>
            </button>
          </div>

          {/* Reset / Sample Data */}
          <div className="pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={handleResetToDemo}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-850 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-900/50 text-xs font-medium transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>নমুনা ডাটা পুনরায় লোড করুন (রিসেট)</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-850 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
