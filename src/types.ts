export type BrandType = 
  | 'Samsung' 
  | 'Xiaomi / Redmi' 
  | 'Vivo' 
  | 'Oppo' 
  | 'Realme' 
  | 'iPhone' 
  | 'Infinix' 
  | 'Tecno' 
  | 'OnePlus' 
  | 'Motorola' 
  | 'অন্যান্য';

export type QualityType =
  | 'Original 100%'
  | 'Original OLED'
  | 'AMOLED'
  | 'Incell / Crown'
  | 'OLED Crown'
  | 'Diamond'
  | 'IC Change'
  | 'TFT Normal'
  | 'সাধারণ';

export interface DisplayItem {
  id: string;
  brand: string;
  model: string;
  quality: string;
  costPrice: number;        // আসল কেনা দাম
  stockQuantity: number;    // স্টকে কয় পিস আছে
  boxLocation: string;      // দোকানে কোন বক্সে বা তাকে রাখা আছে (e.g. Box-02, ড্রয়ার-১)
  notes?: string;           // বিশেষ নোট (e.g. ফিঙ্গার কাজ করে, ফ্রেমসহ)
  createdAt: string;
  updatedAt: string;
}

export type SortOption = 'latest' | 'nameAsc' | 'priceLow' | 'priceHigh' | 'stockLow' | 'stockHigh';
