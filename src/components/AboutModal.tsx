import React from 'react';
import { Heart, Gift, Smartphone, CheckCircle, ShieldCheck, Zap } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalDisplays: number;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose, totalDisplays }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in"
      onClick={onClose}
    >
      <div 
        id="about-modal-container"
        className="w-full max-w-md bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden my-6 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Decorative Banner */}
        <div className="relative p-6 text-center bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-red-500/20 border-b border-amber-500/30">
          <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 p-0.5 shadow-xl shadow-orange-500/30 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Gift className="w-8 h-8 text-amber-400 animate-bounce" />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold mb-2">
            <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" />
            <span>বিশেষ উপহার</span>
          </div>

          {/* Requested Exact Title */}
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide">
            ‘জয়ের পক্ষ থেকে উজ্জ্বল ভাইয়ের গিফট’
          </h2>
          <p className="text-xs sm:text-sm text-amber-300/90 font-medium mt-1">
            উজ্জ্বল ভাইয়ের মোবাইল শপ স্পেশাল ডিজিটাল খাতা
          </p>
        </div>

        {/* Content Details */}
        <div className="p-5 sm:p-6 space-y-4 text-slate-300 text-xs sm:text-sm">
          <div className="p-4 rounded-2xl bg-slate-850/80 border border-slate-800 text-center space-y-2">
            <p className="leading-relaxed text-slate-200">
              উজ্জ্বল ভাইয়ের দোকানে শত শত ডিসপ্লের ভিড়ে খাতার পাতা উল্টে আসল কেনা দাম খুঁজতে যেন এক সেকেন্ডও সময় নষ্ট না হয় — সেই উদ্দেশ্যেই এই সহজ ও দ্রুত অ্যাপটি তৈরি।
            </p>
            <div className="pt-2 flex items-center justify-center gap-2 text-xs font-semibold text-emerald-400">
              <CheckCircle className="w-4 h-4" />
              <span>বর্তমানে দোকানে মোট {totalDisplays} টি ডিসপ্লে সেভ আছে</span>
            </div>
          </div>

          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              অ্যাপটির বিশেষ সুবিধাসমূহ:
            </h4>
            
            <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-800/40 border border-slate-800">
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-white block text-xs sm:text-sm">পলকের মধ্যে দাম দেখা</strong>
                <span className="text-[11px] sm:text-xs text-slate-400">
                  মডেলের প্রথম ১-২টি অক্ষর বা সংখ্যা লিখলেই সাথে সাথে ডিসপ্লেটি দোকানে আছে কিনা এবং আসল কেনা দাম কত তা বড় অক্ষরে দেখা যাবে।
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-800/40 border border-slate-800">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-white block text-xs sm:text-sm">১০০% অফলাইন ও নিরাপদ</strong>
                <span className="text-[11px] sm:text-xs text-slate-400">
                  ইন্টারনেট ছাড়াই আপনার মোবাইলের মেমোরিতে সব তথ্য আজীবনের জন্য সুরক্ষিত থাকবে।
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-800/40 border border-slate-800">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-white block text-xs sm:text-sm">বক্স নম্বর ও স্টক ট্র্যাকিং</strong>
                <span className="text-[11px] sm:text-xs text-slate-400">
                  ডিসপ্লেটি কোন বক্সে আছে এবং কয় পিস আছে তা সহজেই দেখে ও ১ ক্লিকে স্টক বাড়াতে/কমাতে পারবেন।
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 text-center text-[11px] text-slate-400">
            উজ্জ্বল ভাইয়ের ব্যবসার সার্বিক সাফল্য ও বরকত কামনায় ❤️
          </div>
        </div>

        {/* Footer Button */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex justify-center">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 active:scale-95 transition-all cursor-pointer text-center"
          >
            দোকানের খাতা শুরু করুন
          </button>
        </div>
      </div>
    </div>
  );
};
