import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  ShieldCheck, 
  Store, 
  KeyRound, 
  UserCheck, 
  ArrowRight, 
  Sparkles,
  Lock
} from 'lucide-react';

export const LoginModal: React.FC = () => {
  const { 
    isLoginModalOpen, 
    setIsLoginModalOpen, 
    loginModalTargetRole, 
    login, 
    vendors,
    t 
  } = useApp();

  const [role, setRole] = useState<'government' | 'vendor'>(loginModalTargetRole);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  if (!isLoginModalOpen) return null;

  const handleGovtLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    login({
      role: 'government',
      name: 'Dr. Sanjay Deshmukh',
      departmentOrShop: 'Urban Development & Smart City Mission (Nagpur ULB)',
      phone: '9823011223'
    });
  };

  const handleVendorLogin = (vendor = vendors[0]) => {
    login({
      role: 'vendor',
      name: vendor.ownerName,
      departmentOrShop: vendor.shopName,
      vendorId: vendor.id,
      phone: '9823099887'
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-5 sm:p-7 border border-slate-200 relative my-auto animate-in fade-in zoom-in duration-200">
        <button
          onClick={() => setIsLoginModalOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center pb-4 border-b border-slate-100 space-y-1">
          <div className="w-12 h-12 bg-[#0f2942] text-amber-400 rounded-xl flex items-center justify-center mx-auto shadow-md border border-amber-500/40">
            {role === 'government' ? <ShieldCheck className="w-6 h-6" /> : <Store className="w-6 h-6" />}
          </div>
          <h3 className="text-lg font-bold text-[#0f2942] pt-2">
            {role === 'government'
              ? t('Government Officer Authentication', 'शासकीय अधिकारी लॉगिन')
              : t('Merchant & Vendor Portal Login', 'व्यापारी पोर्टल लॉगिन')}
          </h3>
          <p className="text-xs text-slate-500">
            {t('Authorized portal for Maharashtra Smart City stakeholders.', 'अधिकृत लॉगिन सुविधा.')}
          </p>
        </div>

        {/* Role Switcher Tabs */}
        <div className="flex rounded-lg border border-slate-300 p-1 bg-slate-100 my-4 text-xs font-bold">
          <button
            onClick={() => setRole('government')}
            className={`flex-1 py-2 rounded-md transition flex items-center justify-center space-x-1 ${
              role === 'government'
                ? 'bg-[#0f2942] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Government</span>
          </button>
          <button
            onClick={() => setRole('vendor')}
            className={`flex-1 py-2 rounded-md transition flex items-center justify-center space-x-1 ${
              role === 'vendor'
                ? 'bg-[#0f2942] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Store className="w-3.5 h-3.5 text-emerald-400" />
            <span>Vendor / Shop</span>
          </button>
        </div>

        {/* Instant 1-Click Fast Login Card (For testing) */}
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 mb-4 text-xs text-amber-950 space-y-2">
          <div className="flex items-center justify-between font-bold">
            <span className="flex items-center text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-amber-700 mr-1" />
              1-Click Demo Credentials
            </span>
            <span className="text-[10px] bg-amber-200 px-1.5 py-0.2 rounded font-mono">Simulated Auth</span>
          </div>

          {role === 'government' ? (
            <button
              onClick={() => handleGovtLogin()}
              className="w-full py-2 bg-[#0f2942] hover:bg-[#1a3e61] text-white font-bold rounded-lg transition flex items-center justify-center space-x-1.5 shadow-sm"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Login as Ward Officer (Dr. Deshmukh)</span>
            </button>
          ) : (
            <div className="space-y-1.5">
              <button
                onClick={() => handleVendorLogin(vendors[0])}
                className="w-full py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded transition flex items-center justify-center space-x-1.5"
              >
                <Store className="w-3.5 h-3.5" />
                <span>Login as {vendors[0].shopName}</span>
              </button>
              <button
                onClick={() => handleVendorLogin(vendors[1])}
                className="w-full py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded transition flex items-center justify-center space-x-1.5"
              >
                <Store className="w-3.5 h-3.5" />
                <span>Login as {vendors[1].shopName}</span>
              </button>
            </div>
          )}
        </div>

        {/* Standard Manual Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (role === 'government') handleGovtLogin();
            else handleVendorLogin(vendors[0]);
          }}
          className="space-y-3 text-xs"
        >
          <div>
            <label className="block text-slate-700 font-bold mb-1">
              {role === 'government' ? 'Officer Gov Email / Seva ID' : 'Registered Merchant Mobile / UID'}
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={role === 'government' ? 'officer.deshmukh@maharashtra.gov.in' : '9823012345'}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Security PIN / Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 bg-[#0f2942] hover:bg-amber-600 text-white font-bold rounded-lg transition flex items-center justify-center space-x-2"
            >
              <span>{t('Sign In', 'साइन इन करा')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
