import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  MapPin, 
  Store, 
  Clock, 
  Activity, 
  ShieldCheck, 
  UserCheck, 
  AlertCircle, 
  FileText, 
  LogOut, 
  Radio, 
  Sparkles,
  Layers,
  ChevronRight
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    userSession,
    logout,
    setIsLoginModalOpen,
    setLoginModalTargetRole,
    setIsComplaintModalOpen,
    setIsVendorAppModalOpen,
    language,
    setLanguage,
    fontSize,
    setFontSize,
    highContrast,
    setHighContrast,
    totalTodayTransactions,
    t
  } = useApp();

  return (
    <header className="sticky top-0 z-40 w-full bg-white shadow-md border-b border-slate-200">
      {/* Topmost Official Maharashtra Govt Strip */}
      <div className="bg-[#0f2942] text-white text-xs py-1.5 px-4 sm:px-8 flex flex-wrap items-center justify-between border-b border-amber-600/40">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 font-semibold tracking-wide">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
            <span className="text-amber-400 font-bold uppercase">महाराष्ट्र शासन</span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-200 hidden sm:inline">Government of Maharashtra</span>
          </div>
          <span className="text-slate-400 hidden md:inline">•</span>
          <span className="text-slate-300 hidden md:inline text-[11px]">
            Smart City Mission & Urban Development Department
          </span>
        </div>

        {/* Accessibility & Language Controls */}
        <div className="flex items-center space-x-3 text-xs">
          {/* Live UPI Signal Counter */}
          <div className="hidden lg:flex items-center space-x-1.5 bg-[#1b3d5d] px-2.5 py-0.5 rounded text-emerald-300 font-mono text-[11px] border border-emerald-500/30">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>UPI Signal Pulse: <strong>{totalTodayTransactions.toLocaleString('en-IN')}</strong> tx/today</span>
          </div>

          {/* Font Resizing */}
          <div className="flex items-center space-x-1 bg-[#16334f] px-1.5 py-0.5 rounded border border-slate-600">
            <button
              onClick={() => setFontSize('normal')}
              className={`px-1.5 py-0.5 rounded font-bold transition ${fontSize === 'normal' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:text-white'}`}
              title="Standard Font"
            >
              A
            </button>
            <button
              onClick={() => setFontSize('large')}
              className={`px-1.5 py-0.5 rounded font-bold transition ${fontSize === 'large' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:text-white'}`}
              title="Large Font"
            >
              A+
            </button>
            <button
              onClick={() => setFontSize('xlarge')}
              className={`px-1.5 py-0.5 rounded font-bold transition ${fontSize === 'xlarge' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:text-white'}`}
              title="Extra Large Font"
            >
              A++
            </button>
          </div>

          {/* High Contrast Toggle */}
          <button
            onClick={() => setHighContrast(!highContrast)}
            className={`px-2 py-0.5 rounded text-[11px] font-medium border transition ${
              highContrast ? 'bg-amber-400 text-slate-950 border-amber-300' : 'bg-transparent text-slate-300 border-slate-600 hover:text-white'
            }`}
            title="Toggle High Contrast"
          >
            {highContrast ? 'Normal Contrast' : 'High Contrast'}
          </button>

          {/* Language Switcher */}
          <div className="flex items-center rounded overflow-hidden border border-amber-500/60 font-semibold">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-0.5 text-[11px] transition ${
                language === 'en' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-[#1b3d5d] text-slate-200 hover:text-white'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('mr')}
              className={`px-2 py-0.5 text-[11px] transition ${
                language === 'mr' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-[#1b3d5d] text-slate-200 hover:text-white'
              }`}
            >
              मराठी
            </button>
          </div>
        </div>
      </div>

      {/* Main Government Portal Header */}
      <div className="px-4 sm:px-8 py-3 bg-white flex flex-wrap items-center justify-between gap-4 border-b border-slate-100">
        {/* Brand & Seal */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          {/* Official Emblem Icon Styled Badge */}
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#0f2942] to-[#1c4974] flex items-center justify-center text-amber-400 shadow-md border-2 border-amber-500/40 p-1.5 flex-shrink-0">
            <Building2 className="w-7 h-7 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-black tracking-tight text-[#0f2942] font-sans">
                LOK<span className="text-amber-600">VYAPAR</span>
              </span>
              <span className="text-sm font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                लोकव्यापार
              </span>
              <span className="hidden md:inline-flex items-center text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                Official Smart City GIS
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium tracking-tight">
              {t(
                '"Understanding Commercial Activity Through Digital Signals"',
                'डिजिटल व्यवहारांच्या आधारे व्यापारी हालचाली व गर्दी विश्लेषण'
              )}
            </p>
          </div>
        </div>

        {/* Quick Action Portals & Citizen Redressal */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          {/* File Grievance (Citizen) */}
          <button
            onClick={() => setIsComplaintModalOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-md bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100 font-semibold transition shadow-sm"
          >
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>{t('Citizen Grievance (Aaple Sarkar)', 'नागरिक तक्रार निवारण')}</span>
          </button>

          {/* Register Vendor */}
          <button
            onClick={() => setIsVendorAppModalOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 font-semibold transition shadow-sm"
          >
            <Store className="w-4 h-4 text-emerald-600" />
            <span>{t('Register Shop / Stall', 'नवीन व्यापारी नोंदणी')}</span>
          </button>

          {/* User Status / Login Buttons */}
          {userSession.role !== 'public' ? (
            <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-md border border-slate-300">
              <div className="flex items-center space-x-2 px-2 py-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <div className="text-left">
                  <p className="font-bold text-slate-900 text-xs leading-none">{userSession.name}</p>
                  <p className="text-[10px] text-slate-500 capitalize">{userSession.role} • {userSession.departmentOrShop}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-white rounded transition"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-1.5">
              <button
                onClick={() => {
                  setLoginModalTargetRole('vendor');
                  setIsLoginModalOpen(true);
                }}
                className="flex items-center space-x-1 px-3 py-2 rounded-md bg-slate-100 text-slate-800 border border-slate-300 hover:bg-slate-200 font-semibold transition"
              >
                <UserCheck className="w-3.5 h-3.5 text-slate-600" />
                <span>{t('Vendor Login', 'व्यापारी लॉगिन')}</span>
              </button>

              <button
                onClick={() => {
                  setLoginModalTargetRole('government');
                  setIsLoginModalOpen(true);
                }}
                className="flex items-center space-x-1 px-3 py-2 rounded-md bg-[#0f2942] text-white border border-[#0f2942] hover:bg-[#1a3e61] font-semibold transition shadow-sm"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>{t('Govt Login', 'शासन लॉगिन')}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Primary Navigation Ribbon */}
      <nav className="bg-[#13385b] text-white px-4 sm:px-8 flex items-center justify-between overflow-x-auto scrollbar-none border-t border-amber-600/30">
        <div className="flex items-center space-x-1 py-1">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-3 py-2 rounded text-xs font-semibold whitespace-nowrap transition flex items-center space-x-1.5 ${
              activeTab === 'home'
                ? 'bg-amber-500 text-slate-950 shadow-inner'
                : 'text-slate-200 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>{t('Home Overview', 'मुख्य पृष्ठ')}</span>
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className={`px-3 py-2 rounded text-xs font-semibold whitespace-nowrap transition flex items-center space-x-1.5 ${
              activeTab === 'map'
                ? 'bg-amber-500 text-slate-950 shadow-inner'
                : 'text-slate-200 hover:bg-white/10 hover:text-white'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>{t('Activity Map GIS', 'व्यापारी नकाशा')}</span>
          </button>

          <button
            onClick={() => setActiveTab('vendors')}
            className={`px-3 py-2 rounded text-xs font-semibold whitespace-nowrap transition flex items-center space-x-1.5 ${
              activeTab === 'vendors'
                ? 'bg-amber-500 text-slate-950 shadow-inner'
                : 'text-slate-200 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>{t('Top Vendors Registry', 'शीर्ष व्यापारी यादी')}</span>
          </button>

          <button
            onClick={() => setActiveTab('peak')}
            className={`px-3 py-2 rounded text-xs font-semibold whitespace-nowrap transition flex items-center space-x-1.5 ${
              activeTab === 'peak'
                ? 'bg-amber-500 text-slate-950 shadow-inner'
                : 'text-slate-200 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{t('Peak Hours Prediction', 'गर्दीच्या वेळा अंदाज')}</span>
          </button>

          <button
            onClick={() => setActiveTab('traffic')}
            className={`px-3 py-2 rounded text-xs font-semibold whitespace-nowrap transition flex items-center space-x-1.5 ${
              activeTab === 'traffic'
                ? 'bg-amber-500 text-slate-950 shadow-inner'
                : 'text-slate-200 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>{t('Traffic Intelligence', 'वाहतूक व हालचाल विश्लेषण')}</span>
          </button>
        </div>

        {/* Dedicated Stakeholder Links */}
        <div className="flex items-center space-x-2 py-1 flex-shrink-0">
          <button
            onClick={() => setActiveTab('vendor-portal')}
            className={`px-3 py-1.5 rounded text-xs font-bold whitespace-nowrap transition flex items-center space-x-1 border ${
              activeTab === 'vendor-portal'
                ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                : 'bg-emerald-800/60 text-emerald-100 border-emerald-600 hover:bg-emerald-700'
            }`}
          >
            <Store className="w-3.5 h-3.5 text-amber-300" />
            <span>{t('Vendor Dashboard', 'व्यापारी डॅशबोर्ड')}</span>
          </button>

          <button
            onClick={() => setActiveTab('government')}
            className={`px-3 py-1.5 rounded text-xs font-bold whitespace-nowrap transition flex items-center space-x-1 border ${
              activeTab === 'government'
                ? 'bg-amber-500 text-slate-950 border-amber-400'
                : 'bg-amber-600/30 text-amber-200 border-amber-500 hover:bg-amber-600/50'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>{t('Government Admin Portal', 'प्रशासन डॅशबोर्ड')}</span>
          </button>
        </div>
      </nav>

      {/* Official Government Tri-Color Hairline Accent */}
      <div className="h-1 w-full flex">
        <div className="w-1/3 bg-[#FF9933]"></div>
        <div className="w-1/3 bg-white border-y border-slate-200"></div>
        <div className="w-1/3 bg-[#138808]"></div>
      </div>
    </header>
  );
};
