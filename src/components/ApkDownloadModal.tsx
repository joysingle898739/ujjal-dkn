import React, { useState } from 'react';
import { 
  X, 
  Smartphone, 
  Download, 
  Check, 
  Copy, 
  ExternalLink, 
  FolderCheck, 
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface ApkDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApkDownloadModal: React.FC<ApkDownloadModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'direct' | 'project' | 'pwabuilder'>('direct');

  if (!isOpen) return null;

  const currentAppUrl = window.location.href.split('?')[0];

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(currentAppUrl);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleInstallClick = async () => {
    const success = await install();
    if (success) {
      setInstallSuccess(true);
      setTimeout(() => {
        setInstallSuccess(false);
        onClose();
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-amber-500/15 via-slate-900 to-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                অ্যান্ড্রয়েড অ্যাপ (APK) ও ইনস্টলেশন
              </h2>
              <p className="text-xs text-slate-400">
                উজ্জ্বল ভাইয়ের ফোনে অ্যাপটি ব্যবহার করার সব সহজ উপায়
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 p-1.5 gap-1 text-xs">
          <button
            onClick={() => setActiveTab('direct')}
            className={`flex-1 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'direct'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>১. সরাসরি ফোনে ইনস্টল</span>
          </button>
          <button
            onClick={() => setActiveTab('project')}
            className={`flex-1 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'project'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FolderCheck className="w-3.5 h-3.5" />
            <span>২. প্রজেক্টের APK ফাইল</span>
          </button>
          <button
            onClick={() => setActiveTab('pwabuilder')}
            className={`flex-1 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'pwabuilder'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>৩. অনলাইন APK জেনারেটর</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs sm:text-sm">
          
          {/* TAB 1: DIRECT 1-CLICK WEBAPK INSTALL (BEST & EASIEST) */}
          {activeTab === 'direct' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-slate-900 to-amber-500/10 border border-emerald-500/30">
                <div className="flex items-center gap-2 text-emerald-400 font-bold mb-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>সবচেয়ে নিরাপদ ও সহজ পদ্ধতি (কোনো সতর্কবার্তা নেই)</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  অ্যান্ড্রয়েডে আলাদাভাবে থার্ড-পার্টি APK ডাউনলোড করলে &quot;Harmful file&quot; ওয়ার্নিং দেয়। কিন্তু গুগল ক্রোমের মাধ্যমে ইনস্টল করলে গুগল স্বয়ংক্রিয়ভাবে সরাসরি আপনার ফোনে অফিশিয়াল <strong className="text-white">WebAPK</strong> তৈরি করে ইনস্টল করে দেয়।
                </p>
              </div>

              {/* Install Button if browser supports beforeinstallprompt */}
              {isInstallable && !isInstalled && (
                <div className="text-center p-4 bg-slate-950 border border-amber-500/40 rounded-2xl">
                  <button
                    onClick={handleInstallClick}
                    className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm sm:text-base shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
                  >
                    <Download className="w-5 h-5 stroke-[2.5]" />
                    <span>এক ক্লিকে এখনই ফোনে অ্যাপ ইনস্টল করুন</span>
                  </button>
                  <p className="text-[11px] text-amber-400/90 mt-2">
                    ক্লিক করলে স্ক্রিনে &quot;Install app&quot; অপশন আসবে, ইনস্টল চাপুন।
                  </p>
                </div>
              )}

              {isInstalled && (
                <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm text-white">অ্যাপটি আপনার ডিভাইসে সফলভাবে ইনস্টল করা আছে!</h4>
                    <p className="text-xs text-emerald-300/90">হোম স্ক্রিন বা অ্যাপ ড্রয়ার থেকে সরাসরি ফুলস্ক্রিন চালাতে পারবেন।</p>
                  </div>
                </div>
              )}

              {/* Step-by-step for Android Phone */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <h3 className="font-bold text-white text-xs sm:text-sm flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-amber-400" />
                  <span>যেকোনো অ্যান্ড্রয়েড ফোনে ৩ ধাপে ইনস্টল করার নিয়ম:</span>
                </h3>
                <ol className="space-y-2.5 text-xs text-slate-300 list-decimal list-inside leading-relaxed">
                  <li className="pl-1">
                    মোবাইলের <strong className="text-amber-300">Google Chrome</strong> ব্রাউজারে এই অ্যাপের লিংকটি ওপেন করুন।
                  </li>
                  <li className="pl-1">
                    ক্রোমের ওপরের ডানদিকের <strong className="text-white">৩টি ডট (⋮)</strong> মেনুতে চাপ দিন।
                  </li>
                  <li className="pl-1">
                    <strong className="text-amber-400">&quot;Install app&quot;</strong> অথবা <strong className="text-amber-400">&quot;Add to Home screen&quot;</strong> লেখায় ক্লিক করে <strong>Install</strong> নিশ্চিত করুন।
                  </li>
                </ol>
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-400">অ্যাপের শেয়ার করার লিংক:</span>
                  <button
                    onClick={handleCopyUrl}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer transition-colors"
                  >
                    {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedUrl ? 'লিংক কপি হয়েছে!' : 'লিংক কপি করুন'}</span>
                  </button>
                </div>
              </div>

              {isIOS && (
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-slate-300">
                  <strong className="text-white">iPhone / iPad ব্যবহারকারীদের জন্য:</strong> Safari ব্রাউজারের নিচে Share বাটনে চাপ দিয়ে <strong>&quot;Add to Home Screen&quot;</strong> সিলেক্ট করুন।
                </div>
              )}
            </div>
          )}

          {/* TAB 2: COMPLETE ANDROID PROJECT FILES GENERATED IN ROOT */}
          {activeTab === 'project' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold">
                  <FolderCheck className="w-4 h-4" />
                  <span>সম্পূর্ণ অ্যান্ড্রয়েড নেটিভ সোর্স ফাইল রেডি করা হয়েছে!</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  প্রজেক্টের মূল ফাইলে আমরা সম্পূর্ণ <strong className="text-white">Android Studio Project (/android)</strong> যুক্ত করে দিয়েছি। এতে রয়েছে Gradle বিল্ড ফাইল, AndroidManifest.xml, এবং প্রয়োজনীয় কনফিগারেশন।
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <h3 className="font-bold text-white text-xs sm:text-sm flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-400" />
                  <span>প্রজেক্ট থেকে APK এক্সপোর্ট করার ধাপ:</span>
                </h3>
                <ol className="space-y-2 text-xs text-slate-300 list-decimal list-inside leading-relaxed">
                  <li className="pl-1">
                    স্ক্রিনের উপরের ডানদিকের <strong className="text-white">Export</strong> মেনুতে ক্লিক করে <strong className="text-amber-400">Download ZIP</strong> সিলেক্ট করুন (বা <strong>Export to GitHub</strong>)।
                  </li>
                  <li className="pl-1">
                    জিপ ফাইলটি আনজিপ করে আপনার কম্পিউটারের <strong className="text-white">Android Studio</strong> দিয়ে <code className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-300">android/</code> ফোল্ডারটি ওপেন করুন।
                  </li>
                  <li className="pl-1">
                    অ্যান্ড্রয়েড স্টুডিওর মেনুবার থেকে <strong className="text-white">Build &gt; Build Bundle(s) / APK(s) &gt; Build APK(s)</strong> চাপুন।
                  </li>
                  <li className="pl-1">
                    কয়েক সেকেন্ডে <code className="px-1.5 py-0.5 rounded bg-slate-800 text-emerald-300">app-debug.apk</code> ফাইলটি তৈরি হয়ে যাবে, যা যেকোনো অ্যান্ড্রয়েড ফোনে সরাসরি ইনস্টল করা যায়!
                  </li>
                </ol>
              </div>

              <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-2xl flex items-center justify-between gap-2">
                <div className="text-xs text-slate-400">
                  অটোমেটিক গিটহাব অ্যাকশন বিল্ড স্ক্রিপ্টও তৈরি করা আছে:
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">.github/workflows/build-apk.yml</div>
                </div>
                <span className="px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-[11px] font-bold border border-emerald-500/20">
                  রেডি
                </span>
              </div>
            </div>
          )}

          {/* TAB 3: PWABUILDER (INSTANT ONLINE APK CONVERTER) */}
          {activeTab === 'pwabuilder' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold">
                  <Sparkles className="w-4 h-4" />
                  <span>PWABuilder দিয়ে ১ মিনিটে অনলাইন থেকে APK ডাউনলোড:</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  কোনো কোডিং বা অ্যান্ড্রয়েড স্টুডিও ছাড়া সরাসরি ওয়েবসাইট থেকেই অ্যান্ড্রয়েড APK তৈরি করতে মাইক্রোসফটের ফ্রি টুল <strong className="text-white">PWABuilder</strong> ব্যবহার করতে পারেন।
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] text-slate-400">আপনার অ্যাপের লাইভ লিংক:</div>
                    <div className="text-xs text-amber-300 font-mono truncate">{currentAppUrl}</div>
                  </div>
                  <button
                    onClick={handleCopyUrl}
                    className="flex-shrink-0 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5"
                  >
                    {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedUrl ? 'কপি হয়েছে' : 'কপি'}</span>
                  </button>
                </div>

                <ol className="space-y-2 text-xs text-slate-300 list-decimal list-inside leading-relaxed bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <li className="pl-1">উপরের বাটন থেকে অ্যাপের লিংকটি কপি করুন।</li>
                  <li className="pl-1"><strong className="text-white">pwabuilder.com</strong> ওয়েবসাইটে প্রবেশ করুন।</li>
                  <li className="pl-1">ইনপুট বক্সে আপনার লিংক পেস্ট করে <strong>&quot;Start&quot;</strong> চাপুন।</li>
                  <li className="pl-1"><strong>&quot;Package for Stores&quot;</strong> এ গিয়ে <strong>&quot;Android&quot;</strong> সিলেক্ট করে <strong>Download Package / APK</strong> বাটনে ক্লিক করুন।</li>
                </ol>

                <a
                  href="https://www.pwabuilder.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors border border-slate-700"
                >
                  <span>PWABuilder ওয়েবসাইটে যান</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            উজ্জ্বল ভাইয়ের দোকানের জন্য সার্বক্ষণিক প্রস্তুত
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer transition-colors"
          >
            বন্ধ করুন
          </button>
        </div>

      </div>
    </div>
  );
};
