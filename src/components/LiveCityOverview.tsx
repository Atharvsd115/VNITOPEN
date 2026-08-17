import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Store, 
  MapPin, 
  Flame, 
  CreditCard, 
  Clock, 
  TrendingUp, 
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Activity
} from 'lucide-react';

export const LiveCityOverview: React.FC = () => {
  const { 
    zones, 
    vendors, 
    totalTodayTransactions, 
    highActivityZonesCount, 
    predictedPeakZonesCount,
    setActiveTab,
    setFilters,
    t 
  } = useApp();

  const totalRegisteredVendors = zones.reduce((acc, z) => acc + z.totalVendors, 0);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <span className="p-1 rounded bg-[#0f2942] text-white">
              <Activity className="w-4 h-4 text-amber-400" />
            </span>
            <h2 className="text-base sm:text-lg font-bold text-[#0f2942]">
              {t('Live City Overview & Pulse Telemetry', 'थेट शहर अवलोकन व हालचाल निर्देशक')}
            </h2>
          </div>
          <div className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{t('Data refreshed from NPCI / Municipal Gateway', 'माहिती अद्ययावत: महापालिका व डिजिटल सिग्नल')}</span>
          </div>
        </div>

        {/* 5 Main Highlight Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Card 1: Total Registered Vendors */}
          <div 
            onClick={() => setActiveTab('vendors')}
            className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg p-4 cursor-pointer transition group shadow-sm hover:border-slate-400"
          >
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                {t('Registered Vendors', 'नोंदणीकृत व्यापारी')}
              </span>
              <div className="p-1.5 rounded-md bg-blue-100 text-blue-700">
                <Store className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              {totalRegisteredVendors.toLocaleString('en-IN')}
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-200">
              <span className="text-emerald-700 font-semibold flex items-center">
                <ShieldCheck className="w-3 h-3 mr-1" /> 100% Geo-tagged
              </span>
              <span className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition flex items-center">
                View list <ArrowUpRight className="w-3 h-3 ml-0.5" />
              </span>
            </div>
          </div>

          {/* Card 2: Active Commercial Zones */}
          <div 
            onClick={() => setActiveTab('map')}
            className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg p-4 cursor-pointer transition group shadow-sm hover:border-slate-400"
          >
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                {t('Active Zones', 'सक्रिय विभाग')}
              </span>
              <div className="p-1.5 rounded-md bg-emerald-100 text-emerald-700">
                <MapPin className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              {zones.length} <span className="text-sm font-semibold text-slate-600">Wards</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-200">
              <span className="text-slate-600 font-medium">Nagpur • Pune • Mumbai</span>
              <span className="text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition flex items-center">
                GIS Map <ArrowUpRight className="w-3 h-3 ml-0.5" />
              </span>
            </div>
          </div>

          {/* Card 3: High Activity Areas */}
          <div 
            onClick={() => {
              setFilters((prev) => ({ ...prev, activityLevel: 'High' }));
              setActiveTab('map');
            }}
            className="bg-amber-50/70 hover:bg-amber-100/70 border border-amber-200 rounded-lg p-4 cursor-pointer transition group shadow-sm hover:border-amber-400"
          >
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                {t('High Activity Areas', 'उच्च गर्दी क्षेत्रे')}
              </span>
              <div className="p-1.5 rounded-md bg-amber-200 text-amber-900">
                <Flame className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-amber-900 tracking-tight">
              {highActivityZonesCount} <span className="text-sm font-semibold text-amber-800">Zones</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-amber-800 mt-2 pt-2 border-t border-amber-200/80">
              <span className="font-semibold text-amber-900">Sitabuldi, FC Rd, Dadar</span>
              <span className="group-hover:text-amber-900 group-hover:translate-x-0.5 transition flex items-center">
                Heatmap <ArrowUpRight className="w-3 h-3 ml-0.5" />
              </span>
            </div>
          </div>

          {/* Card 4: Today's Transactions */}
          <div 
            onClick={() => setActiveTab('intelligence')}
            className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg p-4 cursor-pointer transition group shadow-sm hover:border-slate-400"
          >
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                {t("Today's Transactions", "आजचे व्यवहार")}
              </span>
              <div className="p-1.5 rounded-md bg-indigo-100 text-indigo-700">
                <CreditCard className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-indigo-900 tracking-tight font-mono">
              {totalTodayTransactions.toLocaleString('en-IN')}
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-200">
              <span className="text-emerald-700 font-bold flex items-center">
                <TrendingUp className="w-3 h-3 mr-0.5" /> +18.4% growth
              </span>
              <span className="text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition flex items-center">
                Trends <ArrowUpRight className="w-3 h-3 ml-0.5" />
              </span>
            </div>
          </div>

          {/* Card 5: Predicted Peak Zones */}
          <div 
            onClick={() => setActiveTab('peak')}
            className="bg-rose-50/70 hover:bg-rose-100/70 border border-rose-200 rounded-lg p-4 cursor-pointer transition group shadow-sm hover:border-rose-400"
          >
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-800">
                {t('Predicted Peak Zones', 'अपेक्षित गर्दीची क्षेत्रे')}
              </span>
              <div className="p-1.5 rounded-md bg-rose-200 text-rose-900">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-rose-900 tracking-tight">
              {predictedPeakZonesCount} <span className="text-sm font-semibold text-rose-800">High Risk</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-rose-800 mt-2 pt-2 border-t border-rose-200/80">
              <span className="font-semibold text-rose-900">Next Peak: 6:30 - 8:30 PM</span>
              <span className="group-hover:text-rose-900 group-hover:translate-x-0.5 transition flex items-center">
                Forecast <ArrowUpRight className="w-3 h-3 ml-0.5" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
