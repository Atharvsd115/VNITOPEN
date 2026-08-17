import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { 
  X, 
  AlertCircle, 
  ShieldAlert, 
  Smartphone, 
  KeyRound, 
  CheckCircle2, 
  Upload, 
  FileText, 
  MapPin, 
  Store,
  Sparkles,
  Camera
} from 'lucide-react';
import { ZoneId } from '../types';

const COMPLAINT_TYPES = [
  'Unauthorized Encroachment',
  'Hygiene & Garbage Disposal',
  'Severe Footfall Overcrowding',
  'Traffic / Pedestrian Blockage',
  'Overcharging / Price Irregularity',
  'Noise Pollution / Late Night Operation',
  'Fire & Electrical Safety'
] as const;

export const ComplaintModal: React.FC = () => {
  const { 
    isComplaintModalOpen, 
    setIsComplaintModalOpen, 
    zones, 
    vendors, 
    selectedZone,
    selectedVendor,
    addComplaint,
    t 
  } = useApp();

  const [step, setStep] = useState<'form' | 'otp' | 'success'>('form');
  const [zoneId, setZoneId] = useState<ZoneId>(selectedZone?.id || 'sitabuldi');
  const [vendorId, setVendorId] = useState<string>(selectedVendor?.id || '');
  const [complaintType, setComplaintType] = useState<typeof COMPLAINT_TYPES[number]>('Unauthorized Encroachment');
  const [description, setDescription] = useState('');
  const [mobile, setMobile] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // OTP
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [userOtp, setUserOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [issuedToken, setIssuedToken] = useState('');

  if (!isComplaintModalOpen) return null;

  const currentZone = zones.find((z) => z.id === zoneId) || zones[0];
  const currentVendor = vendors.find((v) => v.id === vendorId);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobile || mobile.length < 10) {
      alert('Please enter a valid 10-digit mobile number');
      return;
    }
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(code);
    setUserOtp('');
    setOtpError('');
    setStep('otp');
  };

  const handleVerifyAndSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userOtp !== generatedOtp && userOtp !== '1234') {
      setOtpError('Invalid OTP. Please enter the 4-digit code provided.');
      return;
    }

    const masked = `${mobile.slice(0, 5)} •••• ${mobile.slice(-2)}`;
    const token = addComplaint({
      zoneId: currentZone.id,
      zoneName: currentZone.name,
      vendorId: currentVendor?.id,
      vendorName: currentVendor?.shopName,
      citizenMobileMasked: masked,
      complaintType,
      description,
      photoUrl: photoPreview || undefined,
      priority: complaintType.includes('Safety') || complaintType.includes('Blockage') ? 'Urgent' : 'Medium'
    });

    setIssuedToken(token);
    confetti({
      particleCount: 70,
      spread: 50,
      origin: { y: 0.6 }
    });
    setStep('success');
  };

  const handleClose = () => {
    setIsComplaintModalOpen(false);
    setStep('form');
    setDescription('');
    setMobile('');
    setPhotoPreview(null);
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
          <div className="p-2 bg-rose-100 text-rose-700 rounded-lg">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#0f2942]">
              {t('Aaple Sarkar Citizen Grievance Portal', 'आपले सरकार नागरिक तक्रार निवारण कक्ष')}
            </h3>
            <p className="text-xs text-slate-500">
              {t('Direct escalation to Municipal Ward Officer & Traffic Police squad.', 'थेट महानगरपालिका प्रभाग अधिकारी व वाहतूक पोलिसांकडे वर्ग.')}
            </p>
          </div>
        </div>

        {/* Step 1: Grievance Form */}
        {step === 'form' && (
          <form onSubmit={handleSendOtp} className="space-y-4 mt-4 text-xs">
            {/* Zone Selection */}
            <div>
              <label className="block text-slate-700 font-bold mb-1 flex items-center">
                <MapPin className="w-3.5 h-3.5 mr-1 text-slate-500" />
                <span>{t('Commercial Ward / Location of Grievance', 'तक्रार घडलेले ठिकाण / प्रभाग')}</span>
              </label>
              <select
                value={zoneId}
                onChange={(e) => setZoneId(e.target.value as ZoneId)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0f2942]"
              >
                {zones.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.name} ({z.city})
                  </option>
                ))}
              </select>
            </div>

            {/* Optional Specific Vendor */}
            <div>
              <label className="block text-slate-700 font-bold mb-1 flex items-center">
                <Store className="w-3.5 h-3.5 mr-1 text-slate-500" />
                <span>{t('Specific Vendor / Stall (Optional)', 'संबंधित दुकान किंवा स्टॉल (ऐच्छिक)')}</span>
              </label>
              <select
                value={vendorId}
                onChange={(e) => setVendorId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-slate-800 focus:outline-none"
              >
                <option value="">{t('-- General Area Obstruction / No specific vendor --', '-- सामान्य रस्ता अडथळा / विशिष्ट दुकान नाही --')}</option>
                {vendors
                  .filter((v) => v.zoneId === zoneId)
                  .map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.shopName} ({v.address})
                    </option>
                  ))}
              </select>
            </div>

            {/* Grievance Category */}
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                {t('Complaint Category', 'तक्रार प्रकार')}
              </label>
              <select
                value={complaintType}
                onChange={(e) => setComplaintType(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0f2942]"
              >
                {COMPLAINT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                {t('Detailed Description of Issue', 'तक्रारीचा सविस्तर तपशील')}
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t(
                  'Mention exact location details, time of blockage, nature of encroachment or civic hazard...',
                  'अडथळ्याचे अचूक ठिकाण, वेळ, अतिक्रमणाचे स्वरूप सविस्तर नमूद करा...'
                )}
                rows={3}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0f2942]"
                required
              ></textarea>
            </div>

            {/* Optional Photo Upload */}
            <div>
              <label className="block text-slate-700 font-bold mb-1 flex items-center">
                <Camera className="w-3.5 h-3.5 mr-1 text-slate-500" />
                <span>{t('Upload Photo Evidence (Optional)', 'छायाचित्र पुरावा जोडा (ऐच्छिक)')}</span>
              </label>
              <div className="flex items-center space-x-3">
                <label className="cursor-pointer px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-dashed border-slate-300 rounded-md text-slate-700 font-semibold flex items-center space-x-1.5 transition">
                  <Upload className="w-4 h-4 text-slate-500" />
                  <span>Choose Photo</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
                {photoPreview && (
                  <div className="relative w-12 h-12 rounded border border-slate-300 overflow-hidden">
                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setPhotoPreview(null)}
                      className="absolute top-0 right-0 bg-red-600 text-white rounded-bl p-0.5"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Citizen Mobile */}
            <div>
              <label className="block text-slate-700 font-bold mb-1 flex items-center space-x-1">
                <Smartphone className="w-3.5 h-3.5 text-slate-500" />
                <span>{t('Citizen Mobile Number (For SMS Tracking Token & OTP)', 'नागरिक मोबाईल क्रमांक (एसएमएस ट्रॅकिंगसाठी)')}</span>
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-slate-300 bg-slate-100 text-slate-600 font-mono font-bold">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                  placeholder="9823012345"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-r-md font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0f2942]"
                  required
                />
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-rose-700 hover:bg-rose-800 text-white font-bold transition flex items-center justify-center space-x-2 shadow-md"
              >
                <span>{t('Send OTP & Register Grievance', 'ओटीपी पाठवा व तक्रार नोंदवा')}</span>
              </button>
            </div>
          </form>
        )}

        {/* Step 2: OTP Verification */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyAndSubmit} className="space-y-4 mt-4 text-xs">
            <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 text-amber-950 space-y-1">
              <div className="flex items-center justify-between font-bold">
                <span className="flex items-center">
                  <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-700" />
                  Government SMS Gateway Triggered
                </span>
                <span className="font-mono text-[10px] bg-amber-200 px-1.5 py-0.5 rounded">Maha-AapleSarkar</span>
              </div>
              <p className="text-[11px]">
                Your Grievance Registration Code is: <strong className="font-mono text-base text-amber-900">{generatedOtp}</strong>
              </p>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1 flex items-center space-x-1">
                <KeyRound className="w-3.5 h-3.5 text-slate-500" />
                <span>{t('Enter 4-Digit Verification Code', '४ अंकी पडताळणी कोड प्रविष्ट करा')}</span>
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  maxLength={4}
                  value={userOtp}
                  onChange={(e) => setUserOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder={generatedOtp}
                  className="w-40 px-3 py-2 text-center text-lg font-mono font-bold tracking-widest bg-slate-50 border border-slate-300 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0f2942]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setUserOtp(generatedOtp)}
                  className="px-2.5 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded text-slate-700 font-semibold text-[11px]"
                >
                  Auto-Fill ({generatedOtp})
                </button>
              </div>
              {otpError && <p className="text-rose-600 text-xs mt-1 font-semibold">{otpError}</p>}
            </div>

            <div className="pt-2 flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setStep('form')}
                className="py-2.5 px-4 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-lg bg-rose-700 hover:bg-rose-800 text-white font-bold transition flex items-center justify-center space-x-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{t('Verify OTP & File Official Complaint', 'ओटीपी पडताळा व तक्रार दाखल करा')}</span>
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Success with Tracking Token */}
        {step === 'success' && (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-rose-100 text-rose-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900">
                {t('Grievance Registered Successfully!', 'तक्रार यशस्वीरीत्या दाखल झाली!')}
              </h4>
              <p className="text-xs text-slate-600 mt-1">
                Your complaint has been forwarded directly to the Ward Enforcement Officer & Traffic Division.
              </p>
            </div>

            <div className="bg-slate-100 border border-slate-300 rounded-xl p-3 max-w-sm mx-auto text-xs">
              <div className="text-slate-500 uppercase font-bold text-[10px]">Official Grievance Tracking Token</div>
              <div className="font-mono text-base font-black text-rose-800 tracking-wider mt-0.5">
                {issuedToken}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                Keep this token ID for SMS tracking and resolution verification.
              </div>
            </div>

            <div className="pt-3">
              <button
                onClick={handleClose}
                className="px-6 py-2.5 bg-[#0f2942] hover:bg-amber-600 text-white font-bold rounded-lg text-xs transition"
              >
                {t('Close', 'बंद करा')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
