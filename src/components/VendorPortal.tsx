import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Store, 
  Clock, 
  Star, 
  MapPin, 
  TrendingUp, 
  MessageSquare, 
  AlertTriangle, 
  ShieldCheck, 
  CheckCircle2, 
  QrCode, 
  Save, 
  BarChart2, 
  Sparkles,
  Phone,
  Flame
} from 'lucide-react';

export const VendorPortal: React.FC = () => {
  const { 
    vendors, 
    reviews, 
    complaints, 
    userSession, 
    updateVendorProfile,
    t 
  } = useApp();

  // Pick current vendor or default to first
  const currentVendor = vendors.find((v) => v.id === userSession.vendorId) || vendors[0];

  const [shopName, setShopName] = useState(currentVendor.shopName);
  const [category, setCategory] = useState(currentVendor.category);
  const [operatingHours, setOperatingHours] = useState(currentVendor.operatingHours);
  const [peakTime, setPeakTime] = useState(currentVendor.peakTime);
  const [address, setAddress] = useState(currentVendor.address);
  const [status, setStatus] = useState(currentVendor.status);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const vendorReviews = reviews.filter((r) => r.vendorId === currentVendor.id);
  const vendorComplaints = complaints.filter((c) => c.vendorId === currentVendor.id);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateVendorProfile(currentVendor.id, {
      shopName,
      category,
      operatingHours,
      peakTime,
      address,
      status
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Official Vendor Portal Banner */}
      <div className="bg-[#0f2942] text-white rounded-xl p-5 border-b-2 border-emerald-500 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold">
              <Store className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold tracking-tight">
                {t('Merchant & Street Hawker Self-Service Portal', 'अधिकृत व्यापारी व पथविक्रेता पोर्टल')}
              </h2>
              <p className="text-xs text-slate-300">
                Merchant UID: <strong className="font-mono text-amber-300">{currentVendor.merchantId}</strong> • Zone: {currentVendor.zoneName}
              </p>
            </div>
          </div>
        </div>

        {/* Verified Badge */}
        <div className="flex items-center space-x-2 bg-emerald-950/70 border border-emerald-500/40 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Smart City Verified Commercial Stall</span>
        </div>
      </div>

      {/* 4 Performance Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Activity Index</span>
          <div className="text-2xl font-black text-[#0f2942] mt-0.5 font-mono">
            {currentVendor.activityScore}/100 <span className="text-xs text-slate-500 font-sans">({currentVendor.activityIndex}x)</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-semibold mt-1 flex items-center">
            <TrendingUp className="w-3 h-3 mr-0.5" /> High Commercial Velocity
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Today's UPI Pulses</span>
          <div className="text-2xl font-black text-emerald-700 mt-0.5 font-mono">
            {currentVendor.todayTransactions} <span className="text-xs font-sans text-slate-500">tx today</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">
            ~{currentVendor.dailyFootfallEst} estimated customer footfall
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Citizen Rating</span>
          <div className="text-2xl font-black text-amber-500 mt-0.5 flex items-center">
            <Star className="w-5 h-5 fill-amber-400 mr-1" />
            {currentVendor.rating} <span className="text-xs text-slate-500 ml-1">({currentVendor.reviewCount})</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">100% Mobile OTP Verified</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Active Complaints</span>
          <div className="text-2xl font-black text-slate-900 mt-0.5 font-mono">
            {vendorComplaints.length}
          </div>
          <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">
            {vendorComplaints.length === 0 ? '✓ Zero Civic Violations' : 'Requires Attention'}
          </span>
        </div>
      </div>

      {/* Edit Profile & Hours Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white rounded-xl shadow-md border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <Store className="w-5 h-5 text-amber-600" />
              <h3 className="text-base font-bold text-[#0f2942]">
                {t('Manage Stall Profile & Operating Status', 'दुकान माहिती व वेळ व्यवस्थापन')}
              </h3>
            </div>
            {saveSuccess && (
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded flex items-center space-x-1 animate-in fade-in">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Profile Updated!</span>
              </span>
            )}
          </div>

          <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Shop / Commercial Name</label>
              <input
                type="text"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded font-semibold text-slate-900"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Business Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded font-semibold text-slate-900"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Operating Hours</label>
              <input
                type="text"
                value={operatingHours}
                onChange={(e) => setOperatingHours(e.target.value)}
                placeholder="e.g. 7:00 AM - 10:30 PM"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 font-semibold"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Self-Declared Peak Footfall Time</label>
              <input
                type="text"
                value={peakTime}
                onChange={(e) => setPeakTime(e.target.value)}
                placeholder="e.g. 6:30 PM - 9:00 PM"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 font-semibold"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-bold mb-1">Address / Landmark</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Real-time Crowd Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded font-bold text-slate-900"
              >
                <option value="Open">🟢 Open (Normal Flow)</option>
                <option value="Crowded">🔴 Crowded (High Rush)</option>
                <option value="Closed">⚪ Closed</option>
              </select>
            </div>

            <div className="sm:col-span-2 pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#0f2942] hover:bg-amber-600 text-white font-bold rounded-lg transition flex items-center space-x-2 shadow"
              >
                <Save className="w-4 h-4" />
                <span>{t('Save Profile Changes', 'माहिती जतन करा')}</span>
              </button>
            </div>
          </form>
        </div>

        {/* QR Certificate & Compliance Badge */}
        <div className="lg:col-span-4 bg-white rounded-xl shadow-md border border-slate-200 p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
              <QrCode className="w-4 h-4 text-emerald-600" />
              <h4 className="text-sm font-bold text-[#0f2942]">
                {t('Smart City Merchant QR Certificate', 'स्मार्ट सिटी व्यापारी क्यूआर प्रमाणपत्र')}
              </h4>
            </div>

            <div className="mt-3 p-4 bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl text-center space-y-2">
              <div className="w-24 h-24 bg-white mx-auto p-2 rounded-lg border border-slate-200 shadow-inner flex items-center justify-center">
                <QrCode className="w-20 h-20 text-[#0f2942]" />
              </div>
              <div className="text-xs font-black text-[#0f2942]">{currentVendor.shopName}</div>
              <div className="text-[10px] font-mono text-slate-500">ID: {currentVendor.merchantId}</div>
              <div className="text-[10px] text-emerald-700 font-semibold bg-emerald-100 px-2 py-0.5 rounded-full inline-block">
                Govt Authorized Stall
              </div>
            </div>
          </div>

          <button
            onClick={() => alert('Merchant Certificate printable PDF triggered.')}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition flex items-center justify-center space-x-1.5 border border-slate-300"
          >
            <span>Print QR Display Standee</span>
          </button>
        </div>
      </div>

      {/* Vendor Reviews & Citizen Feedback List */}
      <div className="bg-white rounded-xl shadow-md border border-slate-200 p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-amber-600" />
            <h3 className="text-base font-bold text-[#0f2942]">
              {t('Verified Customer Feedback & Ratings', 'ग्राहकांचे अभिप्राय')}
            </h3>
          </div>
          <span className="text-xs text-slate-500">{vendorReviews.length} total verified reviews</span>
        </div>

        {vendorReviews.length > 0 ? (
          <div className="space-y-3 text-xs">
            {vendorReviews.map((rev) => (
              <div key={rev.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-slate-800">{rev.reviewerMobileMasked}</span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded flex items-center">
                      <CheckCircle2 className="w-2.5 h-2.5 mr-0.5" /> OTP Verified
                    </span>
                  </div>
                  <span className="text-slate-400 text-[11px]">{rev.timestamp}</span>
                </div>

                <div className="flex items-center space-x-3 text-[11px]">
                  <span className="flex items-center text-amber-500 font-bold">
                    <Star className="w-3 h-3 fill-amber-400 mr-0.5" /> {rev.rating}/5
                  </span>
                  <span className="text-slate-500">Cleanliness: {rev.cleanliness}/5</span>
                  <span className="text-slate-500">Service: {rev.serviceQuality}/5</span>
                </div>

                <p className="text-slate-700 leading-relaxed">{rev.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500 text-xs">
            No customer reviews logged yet.
          </div>
        )}
      </div>
    </div>
  );
};
