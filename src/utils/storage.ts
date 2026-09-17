import { DisplayItem } from '../types';
import { INITIAL_DISPLAYS } from '../data/initialData';

const STORAGE_KEY = 'uzzal_bhai_display_inventory_v1';
const PRIVACY_KEY = 'uzzal_bhai_privacy_mode';

export function loadDisplaysFromStorage(): DisplayItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // First time initialization: populate with initial displays
      saveDisplaysToStorage(INITIAL_DISPLAYS);
      return INITIAL_DISPLAYS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return INITIAL_DISPLAYS;
  } catch (err) {
    console.error('Error reading from mobile storage:', err);
    return INITIAL_DISPLAYS;
  }
}

export function saveDisplaysToStorage(displays: DisplayItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(displays));
  } catch (err) {
    console.error('Error saving to mobile storage:', err);
  }
}

export function getPrivacyModeFromStorage(): boolean {
  try {
    const val = localStorage.getItem(PRIVACY_KEY);
    return val === 'true';
  } catch {
    return false;
  }
}

export function savePrivacyModeToStorage(isPrivate: boolean): void {
  try {
    localStorage.setItem(PRIVACY_KEY, String(isPrivate));
  } catch {
    // ignore
  }
}

// Format numbers in Bengali / English with Taka symbol (৳)
export function formatTaka(amount: number | undefined): string {
  if (amount === undefined || isNaN(amount)) return '৳ ০';
  return `৳ ${amount.toLocaleString('en-IN')}`;
}

// Convert Bengali digits (০-৯) to English (0-9) to allow searching with both Bengali and English numbers
export function normalizeSearchQuery(text: string): string {
  const bengaliNumerals: Record<string, string> = {
    '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
    '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
  };
  let normalized = text.toLowerCase();
  for (const [bn, en] of Object.entries(bengaliNumerals)) {
    normalized = normalized.split(bn).join(en);
  }
  return normalized.trim();
}

// Export data as JSON file for phone storage download
export function exportBackupJSON(displays: DisplayItem[]): void {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(displays, null, 2));
  const downloadAnchor = document.createElement('a');
  const dateStr = new Date().toISOString().slice(0, 10);
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `Uzzal_Bhai_Display_Backup_${dateStr}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

// Export data as CSV/Excel format
export function exportBackupCSV(displays: DisplayItem[]): void {
  const headers = ['Model', 'Brand', 'Quality', 'Original Buy Price (TK)', 'Stock Qty', 'Box Location', 'Notes'];
  const rows = displays.map(d => [
    `"${d.model.replace(/"/g, '""')}"`,
    `"${d.brand.replace(/"/g, '""')}"`,
    `"${d.quality.replace(/"/g, '""')}"`,
    d.costPrice,
    d.stockQuantity,
    `"${d.boxLocation.replace(/"/g, '""')}"`,
    `"${(d.notes || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  const dateStr = new Date().toISOString().slice(0, 10);
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `Uzzal_Bhai_Displays_${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
}
