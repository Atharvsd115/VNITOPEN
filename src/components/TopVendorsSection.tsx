import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Store, 
  Star, 
  MapPin, 
  Flame, 
  TrendingUp, 
  ShieldCheck, 
  Clock, 
  ExternalLink, 
  Grid, 
  List, 
  CheckCircle2,
  AlertTriangle,
  Radio,
  ChevronRight
} from 'lucide-react';
import { Vendor } from '../types';

export const TopVendorsSection: React.FC = () => {
  const { 
    filteredVendors, 
    setSelectedVendor, 
    setIsReviewModalOpen,
    t 
  } = useApp();

  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-8">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-5 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1 rounded bg-[#0f2942] text-amber-400">
              <Store className="w-4 h-4" />
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-[#0f2942]">
              {t('Commercial Directory & Top Vendors by Activity', 'व्यापारी सूची व सर्वाधिक सक्रिय दुकाने')}
            </h2>
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            {t(
              'Publicly registered merchants ranked by verified digital UPI transaction index and customer satisfaction.',
              'नोंदणीकृत व्यापारी, डिजिटल व्यवहार निर्देशांक व ग्राहक पडताळणीनुसार क्रमवारी.'
            )}
          </p>
        </div>

        {/* View Mode Toggle & Total Counter */}
        <div className="flex items-center space-x-3 text-xs">
          <span className="text-slate-500 font-medium hidden sm:inline">
            Showing <strong className="text-slate-900">{filteredVendors.length}</strong> vendors
          </span>

          <div className="inline-flex rounded-md border border-slate-300 bg-white p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition ${
                viewMode === 'grid' ? 'bg-[#0f2942] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded transition ${
                viewMode === 'table' ? 'bg-[#0f2942] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredVendors.map((vendor, index) => (
            <div
              key={vendor.id}
              onClick={() => setSelectedVendor(vendor)}
              className="bg-white rounded-xl shadow-sm hover:shadow-md border border-slate-200 hover:border-amber-500 transition duration-200 cursor-pointer flex flex-col justify-between overflow-hidden group relative"
            >
              {/* Top Banner Image with Badges */}
              <div className="relative h-36 w-full bg-slate-100 overflow-hidden">
                <img
                  src={vendor.photoUrl}
                  alt={vendor.shopName}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                {/* Rank Badge */}
                <div className="absolute top-2.5 left-2.5 bg-[#0f2942] text-amber-300 font-mono text-[11px] font-bold px-2 py-0.5 rounded shadow border border-amber-500/40">
                  #{index + 1}
                </div>

                {/* Trending Badge */}
                {vendor.isTrending && (
                  <div className="absolute top-2.5 right-2.5 bg-gradient-to-r from-amber-500 to-rose-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full shadow flex items-center space-x-1">
                    <Flame className="w-3 h-3 fill-white" />
                    <span>Trending</span>
                  </div>
                )}

                {/* Bottom Overlay Category & Zone */}
                <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-white text-xs">
                  <span className="bg-black/50 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-semibold border border-white/20">
                    {vendor.category}
                  </span>
                  <span className="flex items-center text-[11px] font-bold text-amber-300">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-0.5" />
                    {vendor.rating} <span className="text-slate-300 text-[10px] font-normal">({vendor.reviewCount})</span>
                  </span>
                </div>
              </div>

              {/* Vendor Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-start justify-between gap-1">
                    <h3 className="text-sm font-bold text-[#0f2942] group-hover:text-amber-700 transition leading-snug">
                      {vendor.shopName}
                    </h3>
                    {vendor.verifiedGovt && (
                      <span title="Govt Verified Stall" className="text-blue-600 flex-shrink-0">
                        <CheckCircle2 className="w-4 h-4 fill-blue-100 text-blue-600" />
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 flex items-center mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 mr-1 flex-shrink-0" />
                    <span className="truncate">{vendor.zoneName}</span>
                  </p>
                </div>

                {/* Crucial Cards Metrics */}
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Activity Index</span>
                    <span className="font-mono font-black text-sm text-[#0f2942]">
                      {vendor.activityIndex}x <span className="text-[10px] text-slate-500 font-sans">({vendor.activityScore}/100)</span>
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Today's Pulse</span>
                    <span className="font-mono font-bold text-xs text-emerald-700">
                      {vendor.todayTransactions} tx
                    </span>
                  </div>
                </div>

                {/* Status & Open Hours Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      vendor.status === 'Crowded'
                        ? 'bg-rose-100 text-rose-800'
                        : vendor.status === 'Open'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {vendor.status}
                  </span>

                  <span className="text-slate-500 text-[11px] flex items-center font-medium group-hover:text-amber-700 transition">
                    View Profile <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4"># Rank</th>
                  <th className="py-3 px-4">Shop & Owner</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Commercial Zone</th>
                  <th className="py-3 px-4">Activity Score</th>
                  <th className="py-3 px-4">Today's UPI Volume</th>
                  <th className="py-3 px-4">Rating</th>
                  <th className="py-3 px-4">Live Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredVendors.map((vendor, idx) => (
                  <tr
                    key={vendor.id}
                    onClick={() => setSelectedVendor(vendor)}
                    className="hover:bg-amber-50/50 cursor-pointer transition"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-slate-500">#{idx + 1}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <img
                          src={vendor.photoUrl}
                          alt={vendor.shopName}
                          className="w-8 h-8 rounded-md object-cover flex-shrink-0"
                        />
                        <div>
                          <div className="font-bold text-[#0f2942] flex items-center space-x-1">
                            <span>{vendor.shopName}</span>
                            {vendor.verifiedGovt && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                          </div>
                          <div className="text-[11px] text-slate-500">{vendor.ownerName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium">{vendor.category}</td>
                    <td className="py-3 px-4">{vendor.zoneName}</td>
                    <td className="py-3 px-4">
                      <span className="font-mono font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {vendor.activityScore}/100 ({vendor.activityIndex}x)
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-700">
                      {vendor.todayTransactions} tx
                    </td>
                    <td className="py-3 px-4">
                      <span className="flex items-center font-bold text-amber-700">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-1" />
                        {vendor.rating} ({vendor.reviewCount})
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          vendor.status === 'Crowded'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {vendor.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button className="px-2.5 py-1 rounded bg-[#0f2942] hover:bg-amber-600 text-white font-semibold text-[11px] transition">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
};
