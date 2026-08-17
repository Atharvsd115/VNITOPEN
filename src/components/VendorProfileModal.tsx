import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { useApp } from '../context/AppContext';
import { 
  X, 
  MapPin, 
  Clock, 
  Star, 
  ShieldCheck, 
  TrendingUp, 
  Flame, 
  MessageSquare, 
  AlertTriangle, 
  Phone, 
  Share2, 
  Calendar, 
  BarChart2,
  CheckCircle2,
  ThumbsUp,
  Sparkles,
  QrCode
} from 'lucide-react';

export const VendorProfileModal: React.FC = () => {
  const { 
    selectedVendor, 
    setSelectedVendor, 
    reviews, 
    setIsReviewModalOpen, 
    setIsComplaintModalOpen,
    t 
  } = useApp();

  const miniMapRef = useRef<HTMLDivElement>(null);
  const miniMapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!selectedVendor || !miniMapRef.current) return;

    if (!miniMapInstance.current) {
      const map = L.map(miniMapRef.current, {
        center: [selectedVendor.lat, selectedVendor.lng],
        zoom: 16,
        zoomControl: false,
        attributionControl: false,
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
      }).addTo(map);

      const marker = L.marker([selectedVendor.lat, selectedVendor.lng]).addTo(map);
      marker.bindPopup(`<strong>${selectedVendor.shopName}</strong><br/>${selectedVendor.address}`).openPopup();

      miniMapInstance.current = map;
    } else {
      miniMapInstance.current.setView([selectedVendor.lat, selectedVendor.lng], 16);
    }

    return () => {
      if (miniMapInstance.current) {
        miniMapInstance.current.remove();
        miniMapInstance.current = null;
      }
    };
  }, [selectedVendor]);

  if (!selectedVendor) return null;

  const vendorReviews = reviews.filter((r) => r.vendorId === selectedVendor.id);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto border border-slate-200 relative my-auto animate-in fade-in zoom-in duration-200">
        {/* Modal Close Button */}
        <button
          onClick={() => setSelectedVendor(null)}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 hover:bg-black text-white transition shadow"
          title="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Hero Banner & Vendor Photo */}
        <div className="relative h-56 sm:h-64 w-full bg-slate-900 overflow-hidden">
          <img
            src={selectedVendor.photoUrl}
            alt={selectedVendor.shopName}
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>

          {/* Overlaid Badges */}
          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-end justify-between gap-3 text-white">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="bg-amber-500 text-slate-950 px-2.5 py-0.5 rounded text-xs font-black uppercase tracking-wider">
                  {selectedVendor.category}
                </span>
                {selectedVendor.verifiedGovt && (
                  <span className="bg-emerald-600/90 text-white px-2 py-0.5 rounded text-xs font-semibold flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Official Smart City Verified</span>
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                {selectedVendor.shopName}
              </h2>
              {selectedVendor.marathiName && (
                <p className="text-xs text-slate-300">{selectedVendor.marathiName}</p>
              )}
            </div>

            {/* Rating & Activity Score Ribbon */}
            <div className="flex items-center space-x-2 bg-black/60 backdrop-blur-md p-2 rounded-xl border border-white/20">
              <div className="text-center px-2">
                <div className="flex items-center justify-center text-amber-400 font-bold text-base">
                  <Star className="w-4 h-4 fill-amber-400 mr-1" />
                  {selectedVendor.rating}
                </div>
                <div className="text-[10px] text-slate-300 font-medium">{selectedVendor.reviewCount} Reviews</div>
              </div>
              <div className="h-7 w-px bg-slate-600"></div>
              <div className="text-center px-2">
                <div className="text-base font-black text-emerald-400 font-mono">
                  {selectedVendor.activityScore}/100
                </div>
                <div className="text-[10px] text-slate-300 font-medium">Activity Index ({selectedVendor.activityIndex}x)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Main Content */}
        <div className="p-5 sm:p-7 space-y-6">
          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="text-slate-500 font-bold uppercase text-[10px] flex items-center">
                <MapPin className="w-3.5 h-3.5 mr-1 text-slate-600" />
                <span>Zone & Address</span>
              </div>
              <p className="font-bold text-[#0f2942] mt-1">{selectedVendor.zoneName}</p>
              <p className="text-slate-600 text-[11px] mt-0.5">{selectedVendor.address}</p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="text-slate-500 font-bold uppercase text-[10px] flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1 text-slate-600" />
                <span>Operating Hours & Peak</span>
              </div>
              <p className="font-bold text-[#0f2942] mt-1">{selectedVendor.operatingHours}</p>
              <p className="text-amber-800 font-semibold text-[11px] mt-0.5">
                🔥 Peak Footfall: {selectedVendor.peakTime}
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="text-slate-500 font-bold uppercase text-[10px] flex items-center">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-slate-600" />
                <span>Govt IDs & Compliance</span>
              </div>
              <p className="font-mono text-slate-900 mt-1 font-bold">UID: {selectedVendor.merchantId}</p>
              <p className="text-slate-500 text-[11px]">Owner: {selectedVendor.ownerName}</p>
            </div>
          </div>

          {/* Today's Transactions & Footfall Curve */}
          <div className="bg-gradient-to-r from-blue-50/70 to-indigo-50/70 p-4 rounded-xl border border-blue-200">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center space-x-2">
                <BarChart2 className="w-4 h-4 text-[#0f2942]" />
                <h4 className="text-xs sm:text-sm font-bold text-[#0f2942]">
                  {t('24-Hour Digital Footfall & Transaction Curve', '२४ तास डिजिटल व्यवहार व गर्दी आलेख')}
                </h4>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                Today: {selectedVendor.todayTransactions} UPI Pulses (~{selectedVendor.dailyFootfallEst} Footfall)
              </span>
            </div>

            {/* Simple CSS Bar Graph for 24 Hours */}
            <div className="h-28 w-full flex items-end justify-between gap-1 pt-4 pb-2 border-b border-slate-300">
              {selectedVendor.hourlyActivity.map((val, h) => {
                const isPeak = val >= 70;
                return (
                  <div key={h} className="flex-1 flex flex-col items-center group relative">
                    <div
                      style={{ height: `${Math.max(8, val)}%` }}
                      className={`w-full rounded-t transition duration-200 ${
                        isPeak
                          ? 'bg-rose-500 hover:bg-rose-600'
                          : val > 40
                          ? 'bg-amber-500 hover:bg-amber-600'
                          : 'bg-blue-400 hover:bg-blue-500'
                      }`}
                    ></div>
                    {/* Hover Tooltip */}
                    <div className="absolute -top-7 hidden group-hover:block bg-slate-900 text-white text-[9px] font-mono px-1.5 py-0.5 rounded shadow z-10 whitespace-nowrap">
                      {h}:00 - {val}% activity
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1 px-1">
              <span>6 AM</span>
              <span>10 AM</span>
              <span>2 PM</span>
              <span>6 PM (Peak)</span>
              <span>10 PM</span>
            </div>
          </div>

          {/* Weekly Footfall Trend & Location Map */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Weekly Trend Table */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h4 className="text-xs font-bold text-[#0f2942] uppercase mb-2 flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1 text-slate-500" />
                {t('Weekly Performance Trend', 'साप्ताहिक व्यवहार अहवाल')}
              </h4>
              <div className="space-y-1.5 text-xs">
                {selectedVendor.weeklyTrend.map((d) => (
                  <div key={d.day} className="flex items-center justify-between py-1 border-b border-slate-100">
                    <span className="font-semibold text-slate-700 w-10">{d.day}</span>
                    <div className="flex-1 mx-3 bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#0f2942] h-full rounded-full"
                        style={{ width: `${Math.min(100, (d.transactions / 2500) * 100)}%` }}
                      ></div>
                    </div>
                    <span className="font-mono text-slate-900 font-bold w-16 text-right">
                      {d.transactions} tx
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mini Map Location */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
              <h4 className="text-xs font-bold text-[#0f2942] uppercase mb-2 flex items-center">
                <MapPin className="w-3.5 h-3.5 mr-1 text-slate-500" />
                {t('Geographic Location (GIS)', 'भौगोलिक स्थान')}
              </h4>
              <div ref={miniMapRef} className="h-36 w-full rounded-lg border border-slate-300 overflow-hidden"></div>
              <div className="text-[11px] text-slate-600 mt-2 flex items-center justify-between">
                <span>GPS: {selectedVendor.lat.toFixed(4)}, {selectedVendor.lng.toFixed(4)}</span>
                <span className="text-emerald-700 font-semibold flex items-center">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Verified Stall Boundary
                </span>
              </div>
            </div>
          </div>

          {/* Citizen Feedback & Reviews Section */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h4 className="text-sm font-bold text-[#0f2942] flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4 text-amber-600" />
                  <span>{t('Verified Citizen Reviews & Hygiene Ratings', 'नागरिक अभिप्राय व स्वच्छता रेटिंग')}</span>
                </h4>
                <p className="text-xs text-slate-500">
                  {t('Verified via Aadhaar/Mobile OTP. No anonymous spam allowed.', 'ओटीपी पडताळणीसह नोंदवलेले अस्सल अभिप्राय.')}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 text-xs">
                <button
                  onClick={() => setIsReviewModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition shadow-sm"
                >
                  {t('+ Write Review (OTP)', '+ अभिप्राय नोंदवा')}
                </button>
                <button
                  onClick={() => setIsComplaintModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 font-semibold transition"
                >
                  {t('Lodge Grievance', 'तक्रार नोंदवा')}
                </button>
              </div>
            </div>

            {/* Reviews List */}
            {vendorReviews.length > 0 ? (
              <div className="space-y-3">
                {vendorReviews.slice(0, 4).map((rev) => (
                  <div key={rev.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1.5">
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
                        <Star className="w-3 h-3 fill-amber-400 mr-0.5" /> {rev.rating}/5 Rating
                      </span>
                      <span className="text-slate-500">
                        Cleanliness: <strong>{rev.cleanliness}/5</strong>
                      </span>
                      <span className="text-slate-500">
                        Service: <strong>{rev.serviceQuality}/5</strong>
                      </span>
                    </div>

                    <p className="text-slate-700 text-xs leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-slate-500 text-xs">
                No reviews yet. Be the first citizen to leave a verified review!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
