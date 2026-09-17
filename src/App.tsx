import { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, 
  PlusCircle, 
  SlidersHorizontal, 
  Sparkles, 
  Check, 
  AlertCircle,
  PackageSearch,
  ArrowUpDown,
  Trash2,
  X,
  Heart,
  Gift,
  Smartphone
} from 'lucide-react';
import { DisplayItem, SortOption } from './types';
import { 
  loadDisplaysFromStorage, 
  saveDisplaysToStorage, 
  getPrivacyModeFromStorage, 
  savePrivacyModeToStorage,
  normalizeSearchQuery 
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { StatsCards } from './components/StatsCards';
import { DisplayCard } from './components/DisplayCard';
import { SpecialSearchModal } from './components/SpecialSearchModal';
import { AddEditModal } from './components/AddEditModal';
import { BackupModal } from './components/BackupModal';
import { BottomNav } from './components/BottomNav';
import { AboutModal } from './components/AboutModal';
import { ApkDownloadModal } from './components/ApkDownloadModal';

export default function App() {
  // 1. Core State with Mobile Storage Synchronization
  const [displays, setDisplays] = useState<DisplayItem[]>(() => loadDisplaysFromStorage());
  const [isPrivacyMode, setIsPrivacyMode] = useState<boolean>(() => getPrivacyModeFromStorage());
  
  // 2. Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'inStock' | 'outOfStock'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('latest');
  const [activeBottomNav, setActiveBottomNav] = useState<'home' | 'search' | 'add' | 'about' | 'apk'>('home');

  // 3. Modals State
  const [isSpecialSearchOpen, setIsSpecialSearchOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isApkModalOpen, setIsApkModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<DisplayItem | null>(null);
  const [initialModelForAdd, setInitialModelForAdd] = useState('');
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; modelName: string } | null>(null);

  // 4. Toast Notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);
  const toastTimeoutRef = useRef<number | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToast({ message, type });
    toastTimeoutRef.current = window.setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // Save displays to localStorage whenever they change
  useEffect(() => {
    saveDisplaysToStorage(displays);
  }, [displays]);

  // Save privacy mode preference
  const togglePrivacyMode = () => {
    const next = !isPrivacyMode;
    setIsPrivacyMode(next);
    savePrivacyModeToStorage(next);
    showToast(next ? 'কেনা দাম গোপন করা হয়েছে (কাস্টমার মোড)' : 'কেনা দাম দৃশ্যমান করা হয়েছে', 'info');
  };

  // Keyboard shortcut Ctrl+K or / to open Special Search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.key === 'k') || (e.key === '/' && document.activeElement?.tagName !== 'INPUT')) {
        e.preventDefault();
        setIsSpecialSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handlers for Stock update
  const handleUpdateStock = (id: string, delta: number) => {
    setDisplays((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(0, item.stockQuantity + delta);
          return {
            ...item,
            stockQuantity: newQty,
            updatedAt: new Date().toISOString(),
          };
        }
        return item;
      })
    );
    if (delta > 0) {
      showToast('স্টক ১ পিস বাড়ানো হয়েছে', 'success');
    } else {
      showToast('১টি বিক্রি হিসেবে স্টক কমানো হয়েছে', 'info');
    }
  };

  // Save new or edited display item
  const handleSaveDisplay = (
    itemData: Omit<DisplayItem, 'id' | 'createdAt' | 'updatedAt'>,
    editId?: string
  ) => {
    if (editId) {
      // Update
      setDisplays((prev) =>
        prev.map((d) =>
          d.id === editId
            ? {
                ...d,
                ...itemData,
                updatedAt: new Date().toISOString(),
              }
            : d
        )
      );
      showToast(`"${itemData.model}" এর তথ্য আপডেট হয়েছে!`, 'success');
    } else {
      // Create new
      const newItem: DisplayItem = {
        ...itemData,
        id: `disp-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setDisplays((prev) => [newItem, ...prev]);
      showToast(`নতুন ডিসপ্লে "${itemData.model}" সেভ হয়েছে!`, 'success');
    }
    setEditItem(null);
    setInitialModelForAdd('');
  };

  // Open Edit Modal
  const handleEdit = (item: DisplayItem) => {
    setEditItem(item);
    setIsAddModalOpen(true);
  };

  // Delete Display Item
  const confirmDelete = () => {
    if (!deleteConfirm) return;
    setDisplays((prev) => prev.filter((d) => d.id !== deleteConfirm.id));
    showToast(`"${deleteConfirm.modelName}" লিস্ট থেকে মুছে ফেলা হয়েছে`, 'info');
    setDeleteConfirm(null);
  };

  // Restore list from backup file
  const handleRestoreDisplays = (restoredList: DisplayItem[]) => {
    setDisplays(restoredList);
    showToast(`${restoredList.length} টি ডিসপ্লের রেকর্ড রিস্টোর করা হয়েছে`, 'success');
  };

  // Reset to Home View (scroll top, clear filters)
  const handleHomeClick = () => {
    setActiveBottomNav('home');
    setSearchQuery('');
    setSelectedBrand('all');
    setStockFilter('all');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('হোম পেজে ফিরে এসেছেন', 'info');
  };

  // Scroll to and highlight card when selected from Special Search
  const handleSelectDisplay = (item: DisplayItem) => {
    setHighlightedId(item.id);
    setSelectedBrand('all');
    setStockFilter('all');
    setSearchQuery('');
    
    setTimeout(() => {
      const element = document.getElementById(`display-card-${item.id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);

    setTimeout(() => {
      setHighlightedId(null);
    }, 3000);
  };

  // Computed summary metrics
  const totalModels = displays.length;
  const totalUnitsInStock = useMemo(
    () => displays.reduce((sum, d) => sum + d.stockQuantity, 0),
    [displays]
  );
  const totalCostCapital = useMemo(
    () => displays.reduce((sum, d) => sum + (d.costPrice * d.stockQuantity), 0),
    [displays]
  );
  const outOfStockCount = useMemo(
    () => displays.filter((d) => d.stockQuantity === 0).length,
    [displays]
  );

  // Available brands in the current inventory
  const availableBrands = useMemo(() => {
    return Array.from(new Set(displays.map((d) => d.brand)));
  }, [displays]);

  // Filtered & sorted displays for the main view
  const filteredDisplays = useMemo(() => {
    const normSearch = normalizeSearchQuery(searchQuery);

    const filtered = displays.filter((item) => {
      // Brand filter
      if (selectedBrand !== 'all' && item.brand !== selectedBrand) {
        return false;
      }

      // Stock status filter
      if (stockFilter === 'inStock' && item.stockQuantity <= 0) return false;
      if (stockFilter === 'outOfStock' && item.stockQuantity > 0) return false;

      // Text search filter
      if (normSearch) {
        const normModel = normalizeSearchQuery(item.model);
        const normBrand = normalizeSearchQuery(item.brand);
        const normQuality = normalizeSearchQuery(item.quality);
        const normBox = normalizeSearchQuery(item.boxLocation);
        const normNotes = normalizeSearchQuery(item.notes || '');

        const matches =
          normModel.includes(normSearch) ||
          normBrand.includes(normSearch) ||
          normQuality.includes(normSearch) ||
          normBox.includes(normSearch) ||
          normNotes.includes(normSearch);

        if (!matches) return false;
      }

      return true;
    });

    // Sorting
    return filtered.sort((a, b) => {
      if (sortBy === 'latest') {
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      }
      if (sortBy === 'nameAsc') {
        return a.model.localeCompare(b.model);
      }
      if (sortBy === 'priceLow') {
        return a.costPrice - b.costPrice;
      }
      if (sortBy === 'priceHigh') {
        return b.costPrice - a.costPrice;
      }
      if (sortBy === 'stockHigh') {
        return b.stockQuantity - a.stockQuantity;
      }
      if (sortBy === 'stockLow') {
        return a.stockQuantity - b.stockQuantity;
      }
      return 0;
    });
  }, [displays, searchQuery, selectedBrand, stockFilter, sortBy]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-24">
      
      {/* 1. Header Navbar */}
      <Navbar
        onOpenSpecialSearch={() => setIsSpecialSearchOpen(true)}
        onOpenAddModal={() => {
          setEditItem(null);
          setInitialModelForAdd('');
          setIsAddModalOpen(true);
        }}
        onOpenBackupModal={() => setIsBackupModalOpen(true)}
        onOpenApkModal={() => setIsApkModalOpen(true)}
        isPrivacyMode={isPrivacyMode}
        onTogglePrivacyMode={togglePrivacyMode}
        totalDisplays={totalUnitsInStock}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 w-full flex-1">
        
        {/* Top Hero Banner: Focus purely on instant model search and buying price */}
        <div className="mt-3.5 p-4 rounded-3xl bg-gradient-to-r from-amber-500/15 via-slate-900 to-amber-600/10 border-2 border-amber-500/35 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-500/10">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-extrabold tracking-wide uppercase border border-amber-500/30">
                  সহজ ও দ্রুত
                </span>
                <h2 className="text-sm sm:text-base font-bold text-white">
                  খাতা খোঁজা বন্ধ! চোখের পলকে আসল কেনা দাম দেখুন
                </h2>
              </div>
              <p className="text-xs text-slate-300/90 mt-0.5">
                শুধু মোবাইলের মডেলের নাম লিখলেই ডিসপ্লেটি দোকানে আছে কিনা এবং আপনার আসল কেনা দাম কত তা দেখতে পাবেন।
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              id="hero-quick-search-btn"
              onClick={() => setIsSpecialSearchOpen(true)}
              className="flex-1 sm:flex-initial px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/25 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
              <span>দাম খুঁজুন</span>
            </button>
            <button
              id="hero-apk-btn"
              onClick={() => setIsApkModalOpen(true)}
              className="px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl bg-slate-950/80 hover:bg-slate-800 border border-amber-500/40 text-amber-300 font-bold text-xs sm:text-sm active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              title="অ্যান্ড্রয়েড ফোনে অ্যাপ (APK) ইনস্টল করুন"
            >
              <Smartphone className="w-4 h-4 text-amber-400" />
              <span>APK / অ্যাপ</span>
            </button>
          </div>
        </div>

        {/* 2. Key Inventory Stats (Focused purely on inventory count and total cost capital) */}
        <StatsCards
          totalModels={totalModels}
          totalUnitsInStock={totalUnitsInStock}
          totalCostCapital={totalCostCapital}
          outOfStockCount={outOfStockCount}
          isPrivacyMode={isPrivacyMode}
          onFilterOutOfStock={() => {
            setStockFilter(stockFilter === 'outOfStock' ? 'all' : 'outOfStock');
          }}
          selectedFilter={stockFilter}
        />

        {/* 3. Search Bar, Brand Filter & Sorting Controls */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-3 sm:p-4 my-4 shadow-xl space-y-3">
          <div className="flex flex-col md:flex-row gap-2.5 items-stretch md:items-center justify-between">
            
            {/* Live Search Input */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-amber-400" />
              </div>
              <input
                id="main-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="মডেল বা বক্স নম্বর দিয়ে খুঁজুন (যেমন: A50, Redmi 10, Y20, বক্স-০১)..."
                className="w-full pl-10 pr-9 py-2.5 bg-slate-950 border border-slate-700/80 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20 font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Controls: Stock Filter & Sort */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Stock Filter Pills */}
              <div className="flex items-center p-1 bg-slate-950 rounded-2xl border border-slate-800 text-xs">
                <button
                  onClick={() => setStockFilter('all')}
                  className={`px-3 py-1.5 rounded-xl font-medium cursor-pointer transition-colors ${
                    stockFilter === 'all'
                      ? 'bg-slate-800 text-white font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  সব ({displays.length})
                </button>
                <button
                  onClick={() => setStockFilter('inStock')}
                  className={`px-3 py-1.5 rounded-xl font-medium cursor-pointer transition-colors ${
                    stockFilter === 'inStock'
                      ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  দোকানে আছে ({displays.filter(d => d.stockQuantity > 0).length})
                </button>
                <button
                  onClick={() => setStockFilter('outOfStock')}
                  className={`px-3 py-1.5 rounded-xl font-medium cursor-pointer transition-colors ${
                    stockFilter === 'outOfStock'
                      ? 'bg-rose-500/20 text-rose-300 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  স্টক শেষ ({outOfStockCount})
                </button>
              </div>

              {/* Sort By Dropdown */}
              <div className="relative flex items-center">
                <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-slate-300">
                  <ArrowUpDown className="w-3.5 h-3.5 text-amber-400" />
                  <select
                    id="sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    aria-label="ডিসপ্লে সাজানোর নিয়ম"
                    className="bg-transparent text-white text-xs focus:outline-none cursor-pointer pr-1 font-medium"
                  >
                    <option value="latest" className="bg-slate-900 text-white">নতুন এন্ট্রি আগে</option>
                    <option value="nameAsc" className="bg-slate-900 text-white">মডেল নাম (A-Z)</option>
                    <option value="priceLow" className="bg-slate-900 text-white">কেনা দাম (কম থেকে বেশি)</option>
                    <option value="priceHigh" className="bg-slate-900 text-white">কেনা দাম (বেশি থেকে কম)</option>
                    <option value="stockHigh" className="bg-slate-900 text-white">স্টক বেশি আগে</option>
                    <option value="stockLow" className="bg-slate-900 text-white">স্টক কম আগে</option>
                  </select>
                </div>
              </div>
            </div>

          </div>

          {/* Brand Filter Horizontal Scroll Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5 scrollbar-none text-xs">
            <span className="text-[11px] font-semibold text-slate-400 mr-1 flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3" />
              ব্র্যান্ড:
            </span>
            <button
              onClick={() => setSelectedBrand('all')}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap cursor-pointer transition-all ${
                selectedBrand === 'all'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              সব ব্র্যান্ড
            </button>
            {availableBrands.map((b) => (
              <button
                key={b}
                onClick={() => setSelectedBrand(b)}
                className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap cursor-pointer transition-all ${
                  selectedBrand === b
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Display Cards Grid */}
        <div className="my-4">
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-xs sm:text-sm font-bold text-slate-300">
              ডিসপ্লে তালিকা ({filteredDisplays.length} টি পাওয়া গেছে)
            </h3>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-amber-400 hover:underline cursor-pointer"
              >
                সব ফিল্টার মুছুন
              </button>
            )}
          </div>

          {filteredDisplays.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {filteredDisplays.map((item) => (
                <DisplayCard
                  key={item.id}
                  item={item}
                  isPrivacyMode={isPrivacyMode}
                  onUpdateStock={handleUpdateStock}
                  onEdit={handleEdit}
                  onDelete={(id, modelName) => setDeleteConfirm({ id, modelName })}
                  isHighlighted={highlightedId === item.id}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 text-center my-6">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mb-3">
                <PackageSearch className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-white mb-1">
                কোনো ডিসপ্লে পাওয়া যায়নি
              </h4>
              <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto mb-4">
                {searchQuery
                  ? `"${searchQuery}" এর সাথে কোনো ডিসপ্লে মেলেনি। এখনই নতুন ডিসপ্লে হিসেবে কেনা দাম সহ যোগ করে নিতে পারেন।`
                  : 'বর্তমান ফিল্টারে কোনো ডিসপ্লে নেই।'}
              </p>
              <button
                onClick={() => {
                  setInitialModelForAdd(searchQuery);
                  setIsAddModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 cursor-pointer active:scale-95 transition-all"
              >
                <PlusCircle className="w-4 h-4 stroke-[2.5]" />
                <span>নতুন ডিসপ্লে যোগ করুন</span>
              </button>
            </div>
          )}
        </div>

        {/* Gift & Dedication Banner at bottom */}
        <div 
          onClick={() => setIsAboutModalOpen(true)}
          className="my-8 p-4 rounded-3xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-rose-500/10 border border-amber-500/30 text-center cursor-pointer hover:border-amber-400 transition-all shadow-lg group"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold mb-1.5 group-hover:scale-105 transition-transform">
            <Gift className="w-3.5 h-3.5 text-amber-400" />
            <span>জয়ের পক্ষ থেকে উজ্জ্বল ভাইয়ের গিফট</span>
            <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" />
          </div>
          <p className="text-xs text-slate-400">
            উজ্জ্বল ভাইয়ের দোকানের দ্রুত ও নিখুঁত ডিসপ্লে অনুসন্ধানের জন্য নিবেদিত
          </p>
        </div>

      </main>

      {/* Persistent Bottom Navigation (হোম, দাম খুঁজুন, নতুন মাল, এবাউট) */}
      <BottomNav
        activeTab={activeBottomNav}
        onHomeClick={handleHomeClick}
        onSearchClick={() => {
          setActiveBottomNav('search');
          setIsSpecialSearchOpen(true);
        }}
        onAddClick={() => {
          setActiveBottomNav('add');
          setEditItem(null);
          setInitialModelForAdd('');
          setIsAddModalOpen(true);
        }}
        onApkClick={() => {
          setActiveBottomNav('apk');
          setIsApkModalOpen(true);
        }}
        onAboutClick={() => {
          setActiveBottomNav('about');
          setIsAboutModalOpen(true);
        }}
      />

      {/* Special Quick Search Modal */}
      <SpecialSearchModal
        isOpen={isSpecialSearchOpen}
        onClose={() => {
          setIsSpecialSearchOpen(false);
          setActiveBottomNav('home');
        }}
        displays={displays}
        isPrivacyMode={isPrivacyMode}
        onTogglePrivacyMode={togglePrivacyMode}
        onUpdateStock={handleUpdateStock}
        onOpenAddModalWithModel={(modelName) => {
          setEditItem(null);
          setInitialModelForAdd(modelName);
          setIsAddModalOpen(true);
        }}
        onSelectDisplay={handleSelectDisplay}
      />

      {/* Add / Edit Display Modal */}
      <AddEditModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditItem(null);
          setInitialModelForAdd('');
          setActiveBottomNav('home');
        }}
        onSave={handleSaveDisplay}
        editItem={editItem}
        initialModelName={initialModelForAdd}
      />

      {/* About Modal (জয়ের পক্ষ থেকে উজ্জ্বল ভাইয়ের গিফট) */}
      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => {
          setIsAboutModalOpen(false);
          setActiveBottomNav('home');
        }}
        totalDisplays={displays.length}
      />

      {/* Phone Storage Backup & Restore Modal */}
      <BackupModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        displays={displays}
        onRestoreDisplays={handleRestoreDisplays}
      />

      {/* Android APK & Mobile Installation Modal */}
      <ApkDownloadModal
        isOpen={isApkModalOpen}
        onClose={() => {
          setIsApkModalOpen(false);
          setActiveBottomNav('home');
        }}
      />

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-700/80 rounded-3xl p-5 shadow-2xl">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/15 text-rose-400 flex items-center justify-center mb-3">
              <Trash2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">
              ডিসপ্লেটি মুছে ফেলতে চান?
            </h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              আপনি কি নিশ্চিত যে <strong className="text-white">&quot;{deleteConfirm.modelName}&quot;</strong> ডিসপ্লে রেকর্ডটি লিস্ট থেকে মুছে ফেলবেন?
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-900/30 cursor-pointer"
              >
                হ্যাঁ, মুছুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-3 duration-200">
          <div className={`px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 text-xs sm:text-sm font-semibold border ${
            toast.type === 'success'
              ? 'bg-slate-900 border-emerald-500/50 text-emerald-300 shadow-emerald-950/40'
              : toast.type === 'error'
                ? 'bg-slate-900 border-rose-500/50 text-rose-300 shadow-rose-950/40'
                : 'bg-slate-900 border-amber-500/50 text-amber-300 shadow-amber-950/40'
          }`}>
            {toast.type === 'success' ? (
              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

    </div>
  );
}
