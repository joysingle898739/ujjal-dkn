import React, { useState, useEffect } from 'react';
import { X, Check, Smartphone, Box, Coins, FileText } from 'lucide-react';
import { DisplayItem } from '../types';
import { POPULAR_BRANDS, QUALITY_OPTIONS } from '../data/initialData';

interface AddEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (itemData: Omit<DisplayItem, 'id' | 'createdAt' | 'updatedAt'>, editId?: string) => void;
  editItem?: DisplayItem | null;
  initialModelName?: string;
}

export const AddEditModal: React.FC<AddEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editItem,
  initialModelName = '',
}) => {
  const [brand, setBrand] = useState('Samsung');
  const [model, setModel] = useState('');
  const [quality, setQuality] = useState('Incell / Crown');
  const [costPrice, setCostPrice] = useState<string>('');
  const [stockQuantity, setStockQuantity] = useState<string>('1');
  const [boxLocation, setBoxLocation] = useState('বক্স-০১');
  const [notes, setNotes] = useState('');
  const [customBrand, setCustomBrand] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (editItem) {
      setBrand(editItem.brand);
      setModel(editItem.model);
      setQuality(editItem.quality);
      setCostPrice(String(editItem.costPrice));
      setStockQuantity(String(editItem.stockQuantity));
      setBoxLocation(editItem.boxLocation || '');
      setNotes(editItem.notes || '');
      setCustomBrand(POPULAR_BRANDS.includes(editItem.brand) ? '' : editItem.brand);
    } else {
      setBrand('Samsung');
      setModel(initialModelName || '');
      setQuality('Incell / Crown');
      setCostPrice('');
      setStockQuantity('1');
      setBoxLocation('বক্স-০১');
      setNotes('');
      setCustomBrand('');
    }
    setErrorMsg('');
  }, [editItem, initialModelName, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!model.trim()) {
      setErrorMsg('অনুগ্রহ করে মোবাইল মডেলের নাম লিখুন (যেমন: A50)');
      return;
    }

    const cost = parseFloat(costPrice);
    if (isNaN(cost) || cost < 0) {
      setErrorMsg('আসল কেনা দামের সঠিক সংখ্যা দিন (যেমন: ২৪৫০)');
      return;
    }

    const qty = parseInt(stockQuantity, 10);
    const validQty = isNaN(qty) ? 0 : Math.max(0, qty);
    const finalBrand = brand === 'অন্যান্য' && customBrand.trim() ? customBrand.trim() : brand;

    onSave(
      {
        brand: finalBrand,
        model: model.trim(),
        quality,
        costPrice: cost,
        stockQuantity: validQty,
        boxLocation: boxLocation.trim() || 'বক্স-০১',
        notes: notes.trim(),
      },
      editItem ? editItem.id : undefined
    );
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto animate-in fade-in"
      onClick={onClose}
    >
      <div 
        id="add-edit-display-modal"
        className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-6 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                {editItem ? 'ডিসপ্লের তথ্য সংশোধন করুন' : 'নতুন ডিসপ্লে এন্ট্রি করুন'}
              </h2>
              <p className="text-xs text-slate-400">
                মডেল, আসল কেনা দাম এবং বক্স নম্বর লিখে রাখুন
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          {/* 1. Brand Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              ১. মোবাইল ব্র্যান্ড সিলেক্ট করুন <span className="text-rose-400">*</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_BRANDS.map((b) => (
                <button
                  type="button"
                  key={b}
                  onClick={() => setBrand(b)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-all ${
                    brand === b
                      ? 'bg-amber-500 text-slate-950 font-bold shadow'
                      : 'bg-slate-800/90 text-slate-300 hover:bg-slate-750 border border-slate-700/60'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>

            {brand === 'অন্যান্য' && (
              <input
                type="text"
                value={customBrand}
                onChange={(e) => setCustomBrand(e.target.value)}
                placeholder="অন্য ব্র্যান্ডের নাম লিখুন..."
                className="mt-2 w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
              />
            )}
          </div>

          {/* 2. Model Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              ২. ডিসপ্লে / মোবাইলের মডেল <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="যেমন: Galaxy A50 / A50s অথবা Redmi Note 10..."
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20"
            />
          </div>

          {/* 3. Original Buy Price (Cost Price) - Made extra prominent */}
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40">
            <label className="block text-xs font-bold text-amber-300 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-amber-400" />
                ৩. আসল কেনা দাম (৳) <span className="text-rose-400">*</span>
              </span>
              <span className="text-[11px] text-amber-400 font-normal">
                দোকানের নিজের খরচ
              </span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base font-bold text-amber-400">
                ৳
              </span>
              <input
                type="number"
                required
                min="0"
                step="any"
                value={costPrice}
                onChange={(e) => setCostPrice(e.target.value)}
                placeholder="যেমন: ২৪৫০"
                className="w-full pl-8 pr-3.5 py-2.5 bg-slate-950 border border-amber-500/50 rounded-xl text-lg font-black font-mono-num text-amber-400 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>

          {/* 4. Quality Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              ৪. ডিসপ্লে কোয়ালিটি / ধরন
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {QUALITY_OPTIONS.map((q) => (
                <button
                  type="button"
                  key={q}
                  onClick={() => setQuality(q)}
                  className={`px-2 py-1.5 rounded-xl text-xs text-center cursor-pointer transition-all ${
                    quality === q
                      ? 'bg-cyan-500/20 border border-cyan-500/60 text-cyan-300 font-bold'
                      : 'bg-slate-800 border border-slate-700/60 text-slate-300 hover:bg-slate-750'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* 5. Stock Quantity & Box Location */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                ৫. স্টকে কয় পিস আছে?
              </label>
              <input
                type="number"
                min="0"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                placeholder="1"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm font-mono-num text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <Box className="w-3.5 h-3.5 text-amber-400" />
                ৬. বক্স / ড্রয়ার নম্বর
              </label>
              <input
                type="text"
                value={boxLocation}
                onChange={(e) => setBoxLocation(e.target.value)}
                placeholder="যেমন: বক্স-০১, ড্রয়ার-২"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* 6. Special Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              ৭. বিশেষ নোট (ফিঙ্গার কাজ করে / ফ্রেমসহ ইত্যাদি)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="যেমন: ফিঙ্গারপ্রিন্ট ওকে, কালো ফ্রেম সহ, ভালো লটের মাল..."
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>{editItem ? 'তথ্য আপডেট করুন' : 'ডিসপ্লে সেভ করুন'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
