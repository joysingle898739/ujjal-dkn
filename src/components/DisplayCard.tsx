import React from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  MapPin, 
  Edit3, 
  Trash2, 
  Plus, 
  Minus, 
  Tag,
  Coins
} from 'lucide-react';
import { DisplayItem } from '../types';
import { formatTaka } from '../utils/storage';

interface DisplayCardProps {
  item: DisplayItem;
  isPrivacyMode: boolean;
  onUpdateStock: (id: string, delta: number) => void;
  onEdit: (item: DisplayItem) => void;
  onDelete: (id: string, modelName: string) => void;
  isHighlighted?: boolean;
}

export const DisplayCard: React.FC<DisplayCardProps> = ({
  item,
  isPrivacyMode,
  onUpdateStock,
  onEdit,
  onDelete,
  isHighlighted = false,
}) => {
  const inStock = item.stockQuantity > 0;

  // Dynamic brand color accents
  const getBrandBadgeColor = (brand: string) => {
    switch (brand.toLowerCase()) {
      case 'samsung':
        return 'bg-blue-500/15 text-blue-300 border-blue-500/30';
      case 'xiaomi / redmi':
      case 'xiaomi':
      case 'redmi':
        return 'bg-orange-500/15 text-orange-300 border-orange-500/30';
      case 'vivo':
        return 'bg-sky-500/15 text-sky-300 border-sky-500/30';
      case 'oppo':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      case 'realme':
        return 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30';
      case 'iphone':
        return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
      default:
        return 'bg-slate-700/50 text-slate-200 border-slate-600/40';
    }
  };

  return (
    <div
      id={`display-card-${item.id}`}
      className={`rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden relative shadow-lg ${
        isHighlighted
          ? 'ring-2 ring-amber-400 border-amber-400 shadow-xl shadow-amber-500/15 bg-slate-900'
          : inStock
            ? 'bg-slate-900/90 hover:bg-slate-850 border-slate-800/90 hover:border-slate-700'
            : 'bg-slate-900/60 border-rose-900/30 hover:border-rose-800/40 opacity-90'
      }`}
    >
      {/* Card Header & Details */}
      <div className="p-4 sm:p-4.5">
        {/* Brand, Quality & Stock Status */}
        <div className="flex items-center justify-between gap-1.5 mb-2.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className={`text-[11px] sm:text-xs font-bold px-2.5 py-0.5 rounded-lg border ${getBrandBadgeColor(item.brand)}`}>
              {item.brand}
            </span>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-lg bg-slate-800/90 text-slate-300 border border-slate-700/80">
              <Tag className="w-2.5 h-2.5 inline mr-1 text-cyan-400" />
              {item.quality}
            </span>
          </div>

          {/* Stock Availability Badge */}
          {inStock ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-0.5 rounded-full flex-shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5" />
              দোকানে আছে
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/25 px-2.5 py-0.5 rounded-full flex-shrink-0">
              <XCircle className="w-3.5 h-3.5" />
              স্টক শেষ
            </span>
          )}
        </div>

        {/* Model Name - Big & Crisp */}
        <h3 className="text-base sm:text-lg font-bold text-white tracking-tight line-clamp-2 leading-snug">
          {item.model}
        </h3>

        {/* Location & Notes */}
        <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-cyan-300/95 font-medium bg-cyan-950/40 border border-cyan-800/40 px-2.5 py-1 rounded-lg">
            <MapPin className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
            <span>বক্স: <strong className="text-white font-semibold">{item.boxLocation || 'উল্লেখ নেই'}</strong></span>
          </div>
          
          <div className="flex items-center gap-1 text-slate-300 bg-slate-800/60 border border-slate-700/60 px-2.5 py-1 rounded-lg font-medium">
            <span>স্টক: <strong className={inStock ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>{item.stockQuantity} পিস</strong></span>
          </div>
        </div>

        {item.notes && (
          <p className="text-slate-400 text-xs italic pl-2 border-l-2 border-amber-500/50 line-clamp-2 mt-2 bg-slate-950/40 py-1 pr-1.5 rounded-r">
            {item.notes}
          </p>
        )}

        {/* HERO: Original Buy Price (আসল কেনা দাম) */}
        <div className="mt-3.5 p-3 rounded-2xl bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-yellow-500/15 border border-amber-500/35 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-[10px] font-bold text-amber-300/90 tracking-wide uppercase">
                আসল কেনা দাম
              </span>
              <span className="text-[11px] text-slate-400">
                (দোকানের খরচ)
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xl sm:text-2xl font-black font-mono-num text-amber-400 tracking-tight drop-shadow-sm">
              {isPrivacyMode ? '••••••' : formatTaka(item.costPrice)}
            </span>
          </div>
        </div>
      </div>

      {/* Card Action Footer: 1-Tap Stock Stepper + Edit/Delete */}
      <div className="px-3.5 py-2.5 bg-slate-950/80 border-t border-slate-800/80 flex items-center justify-between gap-2">
        {/* Quick Stock Controls */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onUpdateStock(item.id, -1)}
            disabled={item.stockQuantity <= 0}
            title="১টি বিক্রি হলো / স্টক কমান"
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-rose-950/80 text-slate-200 hover:text-rose-300 border border-slate-700 hover:border-rose-700/50 flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer active:scale-90"
          >
            <Minus className="w-4 h-4 stroke-[2.5]" />
          </button>
          
          <div className="px-2.5 py-1 bg-slate-900 rounded-lg border border-slate-800 text-center min-w-[54px]">
            <span className={`text-xs sm:text-sm font-bold font-mono-num ${
              inStock ? 'text-white' : 'text-rose-400'
            }`}>
              {item.stockQuantity}
            </span>
            <span className="text-[10px] text-slate-400 ml-1">টি</span>
          </div>

          <button
            type="button"
            onClick={() => onUpdateStock(item.id, 1)}
            title="স্টক ১টি বাড়ান"
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-emerald-950/80 text-slate-200 hover:text-emerald-300 border border-slate-700 hover:border-emerald-700/50 flex items-center justify-center transition-all cursor-pointer active:scale-90"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Edit and Delete Actions */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onEdit(item)}
            title="ডিসপ্লে এডিট করুন"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer active:scale-95 border border-slate-700/60"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(item.id, item.model)}
            title="লিস্ট থেকে মুছুন"
            className="p-2 rounded-xl bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-300 transition-all cursor-pointer active:scale-95 border border-slate-700/60"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
