import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  X, 
  CheckCircle2, 
  XCircle, 
  Package, 
  MapPin, 
  Tag, 
  Plus, 
  Minus, 
  PlusCircle,
  Eye,
  EyeOff,
  Coins,
  ArrowRight
} from 'lucide-react';
import { DisplayItem } from '../types';
import { formatTaka, normalizeSearchQuery } from '../utils/storage';

interface SpecialSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  displays: DisplayItem[];
  isPrivacyMode: boolean;
  onTogglePrivacyMode: () => void;
  onUpdateStock: (id: string, delta: number) => void;
  onOpenAddModalWithModel: (modelName: string) => void;
  onSelectDisplay: (item: DisplayItem) => void;
}

export const SpecialSearchModal: React.FC<SpecialSearchModalProps> = ({
  isOpen,
  onClose,
  displays,
  isPrivacyMode,
  onTogglePrivacyMode,
  onUpdateStock,
  onOpenAddModalWithModel,
  onSelectDisplay,
}) => {
  const [query, setQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input on modal open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
      setSelectedBrand('all');
    }
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const normalizedQuery = normalizeSearchQuery(query);

  // Filter displays based on query and brand
  const filtered = displays.filter((item) => {
    const matchBrand = selectedBrand === 'all' || item.brand === selectedBrand;
    if (!matchBrand) return false;

    if (!normalizedQuery) return true;

    const normModel = normalizeSearchQuery(item.model);
    const normBrand = normalizeSearchQuery(item.brand);
    const normQuality = normalizeSearchQuery(item.quality);
    const normBox = normalizeSearchQuery(item.boxLocation);
    const normNotes = normalizeSearchQuery(item.notes || '');

    return (
      normModel.includes(normalizedQuery) ||
      normBrand.includes(normalizedQuery) ||
      normQuality.includes(normalizedQuery) ||
      normBox.includes(normalizedQuery) ||
      normNotes.includes(normalizedQuery)
    );
  });

  const availableBrands = Array.from(new Set(displays.map(d => d.brand)));

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        id="special-search-container"
        className="w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-3 sm:my-6 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Search Input */}
        <div className="p-3.5 sm:p-5 bg-gradient-to-b from-slate-850 to-slate-900 border-b border-slate-800">
          <div className="flex items-center justify-between pb-2 mb-2 sm:mb-3">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-500/15 text-amber-400">
                <Coins className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  আসল কেনা দাম ও ডিসপ্লে ফাইন্ডার
                </h2>
                <p className="text-[11px] text-amber-400 font-medium">
                  মডেল লিখলেই চোখের পলকে আসল কেনা দাম দেখুন
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onTogglePrivacyMode}
                className="text-xs text-slate-300 hover:text-white flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800 border border-slate-700 cursor-pointer active:scale-95"
                title="কাস্টমার সামনে থাকলে আসল দাম গোপন করুন"
              >
                {isPrivacyMode ? <EyeOff className="w-4 h-4 text-amber-400" /> : <Eye className="w-4 h-4 text-slate-400" />}
                <span className="text-[11px] font-semibold">{isPrivacyMode ? 'লুকানো' : 'গোপন করুন'}</span>
              </button>
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Big High-Visibility Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 sm:pl-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
            </div>
            <input
              ref={inputRef}
              id="special-search-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="মোবাইলের মডেল লিখুন (যেমন: A50, Note 10, Y20, C25)..."
              className="w-full pl-11 sm:pl-13 pr-10 py-3.5 sm:py-4 bg-slate-950/95 border-2 border-amber-500/60 focus:border-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-500/20 text-white placeholder-slate-500 rounded-2xl text-base sm:text-lg font-semibold shadow-inner transition-all"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Quick Brand Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-3 pb-1 scrollbar-none text-xs">
            <button
              onClick={() => setSelectedBrand('all')}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap cursor-pointer transition-all ${
                selectedBrand === 'all'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700/60'
              }`}
            >
              সব ব্র্যান্ড ({displays.length})
            </button>
            {availableBrands.map((b) => (
              <button
                key={b}
                onClick={() => setSelectedBrand(b)}
                className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap cursor-pointer transition-all ${
                  selectedBrand === b
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700/60'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        {/* Results Body */}
        <div className="p-3 sm:p-5 max-h-[60vh] overflow-y-auto space-y-2.5">
          {filtered.length > 0 ? (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <span className="font-medium">
                  {query ? `"${query}" এর জন্য পাওয়া গেছে: ${filtered.length} টি ডিসপ্লে` : `মোট ডিসপ্লে: ${filtered.length} টি`}
                </span>
                <span className="text-[11px] text-slate-400 hidden sm:inline">
                  ক্লিক করলে সরাসরি কার্ডে স্ক্রল হবে
                </span>
              </div>

              {filtered.map((item) => {
                const inStock = item.stockQuantity > 0;
                return (
                  <div
                    key={item.id}
                    id={`search-result-${item.id}`}
                    onClick={() => {
                      onSelectDisplay(item);
                      onClose();
                    }}
                    className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md ${
                      inStock 
                        ? 'bg-slate-850/95 border-slate-700/80 hover:border-amber-500/70 hover:bg-slate-800' 
                        : 'bg-slate-900/80 border-rose-900/40 hover:border-rose-700/60'
                    }`}
                  >
                    {/* Left: Model Name, Brand, Quality & Location */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                        <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-200 border border-slate-700">
                          {item.brand}
                        </span>
                        
                        <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-slate-800/80 text-cyan-300 border border-slate-700">
                          <Tag className="w-2.5 h-2.5 inline mr-1 text-cyan-400" />
                          {item.quality}
                        </span>

                        {/* In Stock Badge */}
                        {inStock ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            দোকানে আছে ({item.stockQuantity} পিস)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30">
                            <XCircle className="w-3.5 h-3.5" />
                            স্টক শেষ (০ পিস)
                          </span>
                        )}
                      </div>

                      {/* Big Model Title */}
                      <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                        {item.model}
                      </h3>

                      {/* Box Location & Notes */}
                      <div className="flex flex-wrap items-center gap-2.5 mt-1.5 text-xs text-slate-300">
                        <span className="flex items-center gap-1 text-cyan-300 font-medium bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/30">
                          <MapPin className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                          বক্স: <strong className="text-white">{item.boxLocation || 'উল্লেখ নেই'}</strong>
                        </span>
                        {item.notes && (
                          <span className="text-slate-400 truncate max-w-xs">
                            • {item.notes}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right: Original Buy Price + Quick Stock Stepper */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-2.5 sm:pt-0 border-slate-800 flex-shrink-0 gap-2">
                      <div className="p-2 sm:p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/35 text-left sm:text-right min-w-[130px]">
                        <div className="text-[10px] text-amber-300 uppercase font-bold tracking-wider">
                          আসল কেনা দাম
                        </div>
                        <div className="text-lg sm:text-2xl font-black font-mono-num text-amber-400">
                          {isPrivacyMode ? '••••••' : formatTaka(item.costPrice)}
                        </div>
                      </div>

                      {/* Quick stock stepper buttons (prevent parent card click) */}
                      <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl p-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => onUpdateStock(item.id, -1)}
                          disabled={item.stockQuantity <= 0}
                          title="১টি বিক্রি হলো / স্টক কমান"
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-200 hover:text-rose-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors active:scale-90"
                        >
                          <Minus className="w-4 h-4 stroke-[2.5]" />
                        </button>
                        <span className="px-2 text-xs sm:text-sm font-bold font-mono-num text-white min-w-[28px] text-center">
                          {item.stockQuantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateStock(item.id, 1)}
                          title="স্টক ১টি বাড়ান"
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-emerald-950 text-slate-200 hover:text-emerald-300 cursor-pointer transition-colors active:scale-90"
                        >
                          <Plus className="w-4 h-4 stroke-[2.5]" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* No Results Found State */
            <div className="text-center py-8 sm:py-12 px-4">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3 border border-amber-500/20">
                <Package className="w-8 h-8" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-1">
                {query ? `"${query}" ডিসপ্লেটি এখনও লিস্টে নেই` : 'কোনো ডিসপ্লে নেই'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mb-5">
                খাতা খোঁজার দরকার নেই! এখনই এই মডেলটির নাম ও আসল কেনা দাম দিয়ে এক ক্লিকে লিস্টে সেভ করে ফেলুন।
              </p>
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    onOpenAddModalWithModel(query);
                    onClose();
                  }}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/25 cursor-pointer active:scale-95 transition-all"
                >
                  <PlusCircle className="w-5 h-5" />
                  <span>&quot;{query}&quot; এর কেনা দাম এখনই সেভ করুন</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer info tip */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>💡 টিপস: শুধু মডেলের নম্বর (যেমন &apos;50&apos;, &apos;10&apos;, &apos;20&apos;) লিখলেই তৎক্ষণাৎ আসল দাম পেয়ে যাবেন।</span>
          <span className="hidden sm:inline font-mono">ESC বা ক্রসে চাপুন বন্ধ করতে</span>
        </div>
      </div>
    </div>
  );
};
