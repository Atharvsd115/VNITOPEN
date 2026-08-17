import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  MapPin, 
  Store, 
  TrendingUp, 
  Shield, 
  Radio, 
  ArrowRight, 
  AlertTriangle, 
  Sparkles,
  Zap,
  Info
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { 
    setActiveTab, 
    setIsComplaintModalOpen, 
    totalTodayTransactions, 
    zones, 
    vendors,
    t 
  } = useApp();

  return (
    <div className="relative bg-gradient-to-br from-[#0c243b] via-[#13385b] to-[#0f2942] text-white border-b border-amber-600/30 overflow-hidden">
      {/* Subtle Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Title & Subtitle */}
          <div className="lg:col-span-8 space-y-4">
            {/* Government Project Badge */}
            <div className="inline-flex items-center space-x-2 bg-amber-500/15 border border-amber-400/40 px-3 py-1 rounded-full text-xs text-amber-300 font-medium tracking-wide">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>{t('Government of Maharashtra Smart Governance Initiative', 'महाराष्ट्र शासन स्मार्ट गव्हर्नन्स पुढाकार')}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white">
              Smart Commercial Activity <br className="hidden sm:inline" />
              <span className="text-amber-400 underline decoration-amber-500/60 decoration-4">
                Monitoring Platform
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-200 font-normal max-w-3xl leading-relaxed">
              {t(
                'Analyze commercial footfall, predict urban peak hours, and assist local municipal authorities using privacy-safe authorized digital transaction signals.',
                'अधिकृत डिजिटल यूपीआय व्यवहारांच्या आधारे व्यावसायिक गर्दीचे विश्लेषण, गर्दीच्या वेळेचा अंदाज आणि नागरी व्यवस्थापन.'
              )}
            </p>

            {/* Core Innovation Highlight Box */}
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-3.5 border border-white/15 max-w-2xl">
              <div className="flex items-start space-x-2.5">
                <div className="p-1.5 rounded bg-amber-500 text-slate-950 flex-shrink-0 mt-0.5">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                    {t('Core Innovation: Digital Signal Footfall Proxy', 'मुख्य नावीन्यता: डिजिटल व्यवहारांद्वारे गर्दीचा मागोवा')}
                  </h4>
                  <p className="text-xs text-slate-200 mt-0.5">
                    {t(
                      'Replaces costly camera/sensor surveillance with aggregated UPI frequency pulses. 100% privacy-compliant with no personal banking or citizen data stored.',
                      'महागड्या कॅमेरे व सेन्सर ऐवजी थेट यूपीआय वारंवारितेचा वापर. नागरिकांच्या गोपनीयतेचा पूर्ण आदर.'
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Call to Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setActiveTab('map')}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition shadow-lg shadow-amber-500/20 active:scale-95"
              >
                <MapPin className="w-4 h-4" />
                <span>{t('Explore Activity Map GIS', 'व्यापारी नकाशा पहा')}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={() => setActiveTab('vendors')}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition active:scale-95"
              >
                <Store className="w-4 h-4 text-amber-400" />
                <span>{t('View Top Vendors', 'शीर्ष व्यापारी यादी')}</span>
              </button>

              <button
                onClick={() => setIsComplaintModalOpen(true)}
                className="flex items-center space-x-1.5 px-4 py-2.5 rounded-lg bg-rose-900/50 hover:bg-rose-800/60 text-rose-200 font-semibold text-xs border border-rose-500/40 transition"
              >
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>{t('Citizen Grievance Redressal', 'तक्रार नोंदवा')}</span>
              </button>
            </div>
          </div>

          {/* Real-time Pulse Metric Card */}
          <div className="lg:col-span-4">
            <div className="bg-[#0b1e31]/90 rounded-xl p-5 border-2 border-amber-500/40 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
                    LIVE CITY TELEMETRY
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">17-AUG-2026</span>
              </div>

              <div className="py-3 space-y-3 font-sans">
                <div>
                  <div className="text-[11px] text-slate-400 uppercase font-semibold">
                    {t("Today's Aggregated UPI Pulses", "आजचे एकूण डिजिटल व्यवहार")}
                  </div>
                  <div className="text-3xl font-black text-amber-400 font-mono">
                    {totalTodayTransactions.toLocaleString('en-IN')}
                    <span className="text-xs text-emerald-400 font-sans font-semibold ml-2">↑ +16.4% vs last wk</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-700/60 text-xs">
                  <div className="bg-slate-800/70 p-2.5 rounded border border-slate-700">
                    <div className="text-slate-400 text-[10px] uppercase font-medium">{t('Active Zones', 'सक्रिय विभाग')}</div>
                    <div className="text-base font-bold text-white mt-0.5">{zones.length} Municipal Wards</div>
                  </div>
                  <div className="bg-slate-800/70 p-2.5 rounded border border-slate-700">
                    <div className="text-slate-400 text-[10px] uppercase font-medium">{t('Registered Merchants', 'नोंदणीकृत व्यापारी')}</div>
                    <div className="text-base font-bold text-white mt-0.5">{vendors.length * 28}+ Hawkers & Shops</div>
                  </div>
                </div>

                {/* Real-time Peak Warning Flash */}
                <div className="bg-amber-950/40 border border-amber-600/50 rounded-lg p-2.5 flex items-start space-x-2 text-xs">
                  <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <p className="text-slate-300 text-[11px] leading-tight">
                    <strong className="text-amber-300">Peak Window Alert:</strong> Heavy commercial surge predicted at <span className="underline font-semibold">Sitabuldi & FC Road</span> between 6:30 PM - 9:00 PM.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
