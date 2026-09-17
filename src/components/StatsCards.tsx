import React from 'react';
import { Layers, ShoppingBag, Banknote, AlertTriangle } from 'lucide-react';
import { formatTaka } from '../utils/storage';

interface StatsCardsProps {
  totalModels: number;
  totalUnitsInStock: number;
  totalCostCapital: number;
  outOfStockCount: number;
  isPrivacyMode: boolean;
  onFilterOutOfStock: () => void;
  selectedFilter: string;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  totalModels,
  totalUnitsInStock,
  totalCostCapital,
  outOfStockCount,
  isPrivacyMode,
  onFilterOutOfStock,
  selectedFilter,
}) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 my-3 sm:my-4">
      {/* 1. Total Models */}
      <div 
        id="stat-total-models" 
        className="bg-slate-850/80 border border-slate-800 rounded-2xl p-3 sm:p-4 backdrop-blur-sm relative overflow-hidden group hover:border-slate-700 transition-all"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-sm font-medium text-slate-400">মোট ডিসপ্লে মডেল</span>
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-xl sm:text-2xl font-bold font-mono-num text-white">{totalModels}</span>
          <span className="text-xs text-slate-400">টি মডেল</span>
        </div>
      </div>

      {/* 2. Total In-Stock Units */}
      <div 
        id="stat-total-units" 
        className="bg-slate-850/80 border border-slate-800 rounded-2xl p-3 sm:p-4 backdrop-blur-sm relative overflow-hidden group hover:border-slate-700 transition-all"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-sm font-medium text-slate-400">দোকানে মজুদ সংখ্যা</span>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <ShoppingBag className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-xl sm:text-2xl font-bold font-mono-num text-emerald-400">{totalUnitsInStock}</span>
          <span className="text-xs text-slate-400">পিস ডিসপ্লে</span>
        </div>
      </div>

      {/* 3. Total Cost Capital */}
      <div 
        id="stat-total-capital" 
        className="bg-slate-850/80 border border-slate-800 rounded-2xl p-3 sm:p-4 backdrop-blur-sm relative overflow-hidden group hover:border-slate-700 transition-all"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-sm font-medium text-slate-400">মোট কেনা মূলধন</span>
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <Banknote className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-lg sm:text-2xl font-bold font-mono-num text-amber-400">
            {isPrivacyMode ? '••••••' : formatTaka(totalCostCapital)}
          </span>
        </div>
      </div>

      {/* 4. Out of Stock alert (clickable filter) */}
      <button 
        id="stat-out-of-stock"
        onClick={onFilterOutOfStock}
        className={`text-left rounded-2xl p-3 sm:p-4 backdrop-blur-sm relative overflow-hidden transition-all cursor-pointer border ${
          selectedFilter === 'outOfStock'
            ? 'bg-rose-500/15 border-rose-500/60 shadow-lg shadow-rose-950/20'
            : outOfStockCount > 0
              ? 'bg-slate-850/80 border-rose-900/40 hover:border-rose-700/60'
              : 'bg-slate-850/80 border-slate-800 hover:border-slate-700'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-sm font-medium text-slate-400">স্টক শেষ (০ পিস)</span>
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            outOfStockCount > 0 ? 'bg-rose-500/15 text-rose-400' : 'bg-slate-800 text-slate-500'
          }`}>
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className={`text-xl sm:text-2xl font-bold font-mono-num ${
            outOfStockCount > 0 ? 'text-rose-400' : 'text-slate-400'
          }`}>
            {outOfStockCount}
          </span>
          <span className="text-xs text-slate-400">টি আনতে হবে</span>
        </div>
      </button>
    </div>
  );
};
