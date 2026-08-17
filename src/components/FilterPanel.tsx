import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  Filter, 
  MapPin, 
  Store, 
  Clock, 
  Flame, 
  Star, 
  RotateCcw, 
  SlidersHorizontal,
  Calendar,
  Layers
} from 'lucide-react';
import { BusinessCategory, ZoneId } from '../types';

const CATEGORIES: BusinessCategory[] = [
  'Street Food & Snacks',
  'Kirana & Groceries',
  'Textiles & Garments',
  'Electronics & Mobile',
  'Fruits & Vegetables',
  'Tea & Beverages',
  'Sweets & Bakeries',
  'Jewelry & Ornaments',
  'Medical & Health',
  'Services & Repairs'
];

export const FilterPanel: React.FC = () => {
  const { filters, setFilters, zones, filteredVendors, t } = useApp();

  const handleReset = () => {
    setFilters({
      searchQuery: '',
      zoneId: 'all',
      category: 'all',
      timeRange: 'today',
      peakHour: 'all',
      activityLevel: 'all',
      onlyTrending: false,
      onlyTopRated: false,
      sortBy: 'activityScore'
    });
  };

  const hasActiveFilters = 
    filters.searchQuery !== '' ||
    filters.zoneId !== 'all' ||
    filters.category !== 'all' ||
    filters.timeRange !== 'today' ||
    filters.peakHour !== 'all' ||
    filters.activityLevel !== 'all' ||
    filters.onlyTrending ||
    filters.onlyTopRated;

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 p-4 sm:p-5 my-6">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-[#0f2942] text-amber-400 rounded-md">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#0f2942] flex items-center gap-2">
              <span>{t('Unified Smart Filter & Intelligence Panel', 'एकात्मिक शोध व फिल्टर फलक')}</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-300">
                {filteredVendors.length} {t('Vendors Matching', 'व्यापारी जुळत आहेत')}
              </span>
            </h3>
          </div>
        </div>

        {/* Reset Button */}
        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="flex items-center space-x-1 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2.5 py-1 rounded transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t('Reset Filters', 'फिल्टर पूर्ववत करा')}</span>
          </button>
        )}
      </div>

      {/* Filter Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4 text-xs">
        {/* Search Input */}
        <div>
          <label className="block text-slate-700 font-semibold mb-1 flex items-center space-x-1">
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <span>{t('Search Vendor / Shop / Owner', 'व्यापारी किंवा दुकानाचे नाव')}</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
              placeholder={t('e.g. Tarri Poha, Chitale, Dadar Mandi...', 'उदा. तर्री पोहे, चितळे, दादर मार्केट...')}
              className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0f2942] focus:border-transparent transition"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>
        </div>

        {/* Zone Selector */}
        <div>
          <label className="block text-slate-700 font-semibold mb-1 flex items-center space-x-1">
            <MapPin className="w-3.5 h-3.5 text-slate-500" />
            <span>{t('Commercial Zone / Ward', 'व्यापारी विभाग / प्रभाग')}</span>
          </label>
          <select
            value={filters.zoneId}
            onChange={(e) => setFilters((prev) => ({ ...prev, zoneId: e.target.value }))}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0f2942] transition font-medium"
          >
            <option value="all">{t('All Commercial Zones (10 Wards)', 'सर्व १० व्यापारी विभाग')}</option>
            {zones.map((z) => (
              <option key={z.id} value={z.id}>
                {z.name} ({z.city})
              </option>
            ))}
          </select>
        </div>

        {/* Category Selector */}
        <div>
          <label className="block text-slate-700 font-semibold mb-1 flex items-center space-x-1">
            <Store className="w-3.5 h-3.5 text-slate-500" />
            <span>{t('Business Category', 'व्यवसाय प्रकार')}</span>
          </label>
          <select
            value={filters.category}
            onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0f2942] transition font-medium"
          >
            <option value="all">{t('All Categories (10 Sectors)', 'सर्व व्यवसाय प्रकार')}</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Activity Level Filter */}
        <div>
          <label className="block text-slate-700 font-semibold mb-1 flex items-center space-x-1">
            <Flame className="w-3.5 h-3.5 text-slate-500" />
            <span>{t('Footfall Activity Level', 'गर्दी व व्यवहार पातळी')}</span>
          </label>
          <select
            value={filters.activityLevel}
            onChange={(e) => setFilters((prev) => ({ ...prev, activityLevel: e.target.value }))}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0f2942] transition font-medium"
          >
            <option value="all">{t('All Activity Levels', 'सर्व पातळी')}</option>
            <option value="Very High">{t('Very High (Score > 90)', 'अति उच्च (स्कोर > ९०)')}</option>
            <option value="High">{t('High (Score 75 - 90)', 'उच्च (स्कोर ७५ - ९०)')}</option>
            <option value="Medium">{t('Medium (Score 50 - 75)', 'मध्यम (स्कोर ५० - ७५)')}</option>
            <option value="Low">{t('Low (Score < 50)', 'कमी (स्कोर < ५०)')}</option>
          </select>
        </div>
      </div>

      {/* Secondary Quick Toggles & Time Horizon Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 mt-3 border-t border-slate-100 text-xs">
        {/* Date Range Radios */}
        <div className="flex items-center space-x-2">
          <span className="text-slate-600 font-semibold flex items-center">
            <Calendar className="w-3.5 h-3.5 mr-1 text-slate-500" />
            {t('Time Window:', 'कालावधी:')}
          </span>
          <div className="inline-flex rounded-md border border-slate-300 bg-slate-50 p-0.5">
            {(['today', 'week', 'month'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setFilters((prev) => ({ ...prev, timeRange: range }))}
                className={`px-3 py-1 rounded text-xs font-semibold capitalize transition ${
                  filters.timeRange === range
                    ? 'bg-[#0f2942] text-white shadow-sm'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                {range === 'today' ? t('Today', 'आज') : range === 'week' ? t('This Week', 'चालू आठवडा') : t('This Month', 'चालू महिना')}
              </button>
            ))}
          </div>
        </div>

        {/* Checkbox Toggles & Sort */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Trending Toggle */}
          <label className="flex items-center space-x-1.5 cursor-pointer select-none bg-slate-50 hover:bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
            <input
              type="checkbox"
              checked={filters.onlyTrending}
              onChange={(e) => setFilters((prev) => ({ ...prev, onlyTrending: e.target.checked }))}
              className="rounded text-amber-600 focus:ring-amber-500 h-3.5 w-3.5"
            />
            <span className="font-semibold text-slate-800 flex items-center">
              <Flame className="w-3 h-3 text-amber-600 mr-1" />
              {t('Trending Hotspots', 'सध्या ट्रेंडिंग')}
            </span>
          </label>

          {/* Top Rated Toggle */}
          <label className="flex items-center space-x-1.5 cursor-pointer select-none bg-slate-50 hover:bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
            <input
              type="checkbox"
              checked={filters.onlyTopRated}
              onChange={(e) => setFilters((prev) => ({ ...prev, onlyTopRated: e.target.checked }))}
              className="rounded text-amber-600 focus:ring-amber-500 h-3.5 w-3.5"
            />
            <span className="font-semibold text-slate-800 flex items-center">
              <Star className="w-3 h-3 text-amber-500 fill-amber-400 mr-1" />
              {t('Top Rated (4.7+)', 'उत्कृष्ट रेटिंग')}
            </span>
          </label>

          {/* Sort By Dropdown */}
          <div className="flex items-center space-x-1.5">
            <span className="text-slate-500 font-medium">{t('Sort By:', 'क्रमवारी:')}</span>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value as any }))}
              className="px-2.5 py-1 text-xs bg-slate-50 border border-slate-300 rounded font-semibold text-slate-800 focus:outline-none"
            >
              <option value="activityScore">{t('Activity Index (High to Low)', 'व्यवहार निर्देशांक (जास्त ते कमी)')}</option>
              <option value="rating">{t('Customer Rating', 'ग्राहक रेटिंग')}</option>
              <option value="transactions">{t("Today's UPI Volume", 'आजचे डिजिटल व्यवहार')}</option>
              <option value="complaints">{t('Complaints Count', 'तक्रारी संख्या')}</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
