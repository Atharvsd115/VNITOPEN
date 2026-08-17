import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Store, 
  ShieldCheck, 
  MapPin, 
  Smartphone, 
  CheckCircle2, 
  Sparkles,
  FileText,
  Clock
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

export const VendorApplicationModal: React.FC = () => {
  const { 
    isVendorAppModalOpen, 
    setIsVendorAppModalOpen, 
    zones, 
    submitVendorApplication,
    t 
  } = useApp();

  const [shopName, setShopName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [category, setCategory] = useState<BusinessCategory>('Street Food & Snacks');
  const [zoneId, setZoneId] = useState<ZoneId>('sitabuldi');
  const [address, setAddress] = useState('');
  const [mobile, setMobile] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [operatingHours, setOperatingHours] = useState('8:00 AM - 10:00 PM');
  const [submittedId, setSubmittedId] = useState('');
  const [step, setStep] = useState<'form' | 'success'>('form');

  if (!isVendorAppModalOpen) return null;

  const currentZone = zones.find((z) => z.id === zoneId) || zones[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobile || mobile.length < 10) {
      alert('Please enter a valid 10-digit mobile number');
      return;
    }

    const maskedAadhaar = aadhaar ? `•••• •••• ${aadhaar.slice(-4)}` : '•••• •••• 8842';
    const id = submitVendorApplication({
      shopName,
      ownerName,
      category,
      zoneId: currentZone.id,
      zoneName: currentZone.name,
      address,
      mobile,
      aadhaarMasked: maskedAadhaar,
      operatingHours,
      lat: currentZone.lat + (Math.random() - 0.5) * 0.005,
      lng: currentZone.lng + (Math.random() - 0.5) * 0.005
    });

    setSubmittedId(id);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 }
    });
    setStep('success');
  };

  const handleClose = () => {
    setIsVendorAppModalOpen(false);
    setStep('form');
    setShopName('');
    setOwnerName('');
    setAddress('');
    setMobile('');
    setAadhaar('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-5 sm:p-7 border border-slate-200 relative my-auto animate-in fade-in zoom-in duration-200 max-h-[92vh] overflow-y-auto">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-2.5 pb-4 border-b border-slate-100">
          <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#0f2942]">
              {t('Maharashtra Smart City Merchant Registration', 'महाराष्ट्र स्मार्ट सिटी व्यापारी नोंदणी अर्ज')}
            </h3>
            <p className="text-xs text-slate-500">
              {t('Official on-boarding for PM SVANidhi street vendors and retail establishments.', 'अधिकृत स्टॉल नोंदणी व जीआयएस टॅगिंग.')}
            </p>
          </div>
        </div>

        {step === 'form' ? (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  {t('Shop / Stall Name', 'दुकान किंवा स्टॉलचे नाव')}
                </label>
                <input
                  type="text"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  placeholder="e.g. Mahalakshmi Farsan"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0f2942]"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  {t('Owner / Hawker Name', 'मालकाचे नाव')}
                </label>
                <input
                  type="text"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="e.g. Rameshwar Patil"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0f2942]"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  {t('Business Category', 'व्यवसाय प्रकार')}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded font-semibold text-slate-900 focus:outline-none"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  {t('Target Commercial Zone', 'व्यापारी विभाग')}
                </label>
                <select
                  value={zoneId}
                  onChange={(e) => setZoneId(e.target.value as ZoneId)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded font-semibold text-slate-900 focus:outline-none"
                >
                  {zones.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.name} ({z.city})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                {t('Address / Pitch Location', 'पत्ता / स्टॉलचे अचूक ठिकाण')}
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Stall #14, Opposite Metro Pillar 42, Sitabuldi Main Rd"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  {t('Mobile Number', 'मोबाईल क्रमांक')}
                </label>
                <input
                  type="tel"
                  maxLength={10}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                  placeholder="9823012345"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded font-mono text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  {t('Aadhaar / PM SVANidhi ID (Last 4 digits)', 'आधार शेवटचे ४ अंक')}
                </label>
                <input
                  type="text"
                  maxLength={4}
                  value={aadhaar}
                  onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, ''))}
                  placeholder="8842"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded font-mono text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                {t('Standard Operating Hours', 'कामाच्या वेळा')}
              </label>
              <input
                type="text"
                value={operatingHours}
                onChange={(e) => setOperatingHours(e.target.value)}
                placeholder="8:00 AM - 10:00 PM"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold transition flex items-center justify-center space-x-2 shadow-md"
              >
                <Store className="w-4 h-4" />
                <span>{t('Submit Application to Ward Officer', 'अर्ज सादर करा')}</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900">
                {t('Registration Application Submitted!', 'अर्ज यशस्वीरीत्या सादर केला!')}
              </h4>
              <p className="text-xs text-slate-600 mt-1">
                Your application has been routed to the Municipal Ward Inspector. Verification status will appear in the Government portal.
              </p>
            </div>

            <div className="bg-slate-100 border border-slate-300 rounded-xl p-3 max-w-sm mx-auto text-xs">
              <div className="text-slate-500 uppercase font-bold text-[10px]">Application Reference UID</div>
              <div className="font-mono text-base font-black text-emerald-800 tracking-wider mt-0.5">
                {submittedId}
              </div>
            </div>

            <div className="pt-3">
              <button
                onClick={handleClose}
                className="px-6 py-2.5 bg-[#0f2942] hover:bg-amber-600 text-white font-bold rounded-lg text-xs transition"
              >
                {t('Done', 'पूर्ण झाले')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
