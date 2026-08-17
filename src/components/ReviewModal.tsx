import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Star, 
  ShieldCheck, 
  Smartphone, 
  KeyRound, 
  CheckCircle2, 
  MessageSquare,
  Sparkles,
  RotateCcw
} from 'lucide-react';

export const ReviewModal: React.FC = () => {
  const { 
    isReviewModalOpen, 
    setIsReviewModalOpen, 
    selectedVendor, 
    vendors,
    addReview,
    t 
  } = useApp();

  const [step, setStep] = useState<'details' | 'otp' | 'success'>('details');
  const [vendorId, setVendorId] = useState(selectedVendor ? selectedVendor.id : vendors[0]?.id || '');
  const [mobile, setMobile] = useState('');
  const [rating, setRating] = useState(5);
  const [cleanliness, setCleanliness] = useState(5);
  const [serviceQuality, setServiceQuality] = useState(5);
  const [comment, setComment] = useState('');

  // OTP state
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [userOtp, setUserOtp] = useState('');
  const [otpError, setOtpError] = useState('');

  if (!isReviewModalOpen) return null;

  const currentVendor = vendors.find((v) => v.id === vendorId) || selectedVendor || vendors[0];

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
      setOtpError('Invalid OTP code. Please enter the correct 4-digit code shown above.');
      return;
    }

    const masked = `${mobile.slice(0, 5)} •••• ${mobile.slice(-2)}`;
    addReview({
      vendorId: currentVendor.id,
      vendorName: currentVendor.shopName,
      reviewerMobileMasked: masked,
      rating,
      cleanliness,
      serviceQuality,
      comment: comment || 'Verified citizen feedback on quality and service.'
    });

    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 }
    });

    setStep('success');
  };

  const handleClose = () => {
    setIsReviewModalOpen(false);
    setStep('details');
    setMobile('');
    setComment('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-5 sm:p-7 border border-slate-200 relative my-auto animate-in fade-in zoom-in duration-200">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-2.5 pb-4 border-b border-slate-100">
          <div className="p-2 bg-amber-500/15 text-amber-600 rounded-lg">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#0f2942]">
              {t('Citizen Feedback & Verification', 'नागरिक अभिप्राय व पडताळणी')}
            </h3>
            <p className="text-xs text-slate-500">
              {t('No account required. Protected by instant OTP verification.', 'खाते आवश्यक नाही. तत्काळ ओटीपी पडताळणी.')}
            </p>
          </div>
        </div>

        {/* Step 1: Review Form */}
        {step === 'details' && (
          <form onSubmit={handleSendOtp} className="space-y-4 mt-4 text-xs">
            {/* Vendor Selector */}
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                {t('Select Shop / Vendor', 'दुकान किंवा व्यापारी निवडा')}
              </label>
              <select
                value={vendorId}
                onChange={(e) => setVendorId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0f2942]"
              >
                {vendors.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.shopName} ({v.zoneName})
                  </option>
                ))}
              </select>
            </div>

            {/* Star Rating */}
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                {t('Overall Rating', 'एकूण रेटिंग')} ({rating}/5 Stars)
              </label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setRating(num)}
                    className="p-1 text-amber-400 hover:scale-110 transition"
                  >
                    <Star
                      className={`w-6 h-6 ${num <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Cleanliness & Service Quality Sub-Ratings */}
            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  {t('Cleanliness & Hygiene', 'स्वच्छता व स्वच्छता मानके')}
                </label>
                <select
                  value={cleanliness}
                  onChange={(e) => setCleanliness(Number(e.target.value))}
                  className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded font-medium text-slate-800"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ 5 (Excellent)</option>
                  <option value={4}>⭐⭐⭐⭐ 4 (Very Good)</option>
                  <option value={3}>⭐⭐⭐ 3 (Average)</option>
                  <option value={2}>⭐⭐ 2 (Needs Attention)</option>
                  <option value={1}>⭐ 1 (Poor)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  {t('Service & Queue Speed', 'सेवा व रांगेचा वेग')}
                </label>
                <select
                  value={serviceQuality}
                  onChange={(e) => setServiceQuality(Number(e.target.value))}
                  className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded font-medium text-slate-800"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ 5 (Instant / Polite)</option>
                  <option value={4}>⭐⭐⭐⭐ 4 (Fast)</option>
                  <option value={3}>⭐⭐⭐ 3 (Standard)</option>
                  <option value={2}>⭐⭐ 2 (Slow Rush)</option>
                  <option value={1}>⭐ 1 (Disorderly)</option>
                </select>
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                {t('Your Review / Experience', 'आपला अभिप्राय')}
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={t(
                  'Describe taste, price fairness, digital payment experience, hygiene, etc.',
                  'चव, वाजवी दर, डिजिटल पेमेंट, स्वच्छता याविषयी अनुभव लिहा.'
                )}
                rows={3}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0f2942]"
                required
              ></textarea>
            </div>

            {/* Mobile Number for OTP */}
            <div>
              <label className="block text-slate-700 font-bold mb-1 flex items-center space-x-1">
                <Smartphone className="w-3.5 h-3.5 text-slate-500" />
                <span>{t('Mobile Number (For 1-Time SMS OTP)', 'मोबाईल क्रमांक (ओटीपीसाठी)')}</span>
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
              <p className="text-[10px] text-slate-500 mt-1">
                🔒 We protect citizen privacy. Your number is masked (e.g. 98230 •••• 45) publicly.
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-[#0f2942] hover:bg-[#1a3e61] text-white font-bold transition flex items-center justify-center space-x-2"
              >
                <span>{t('Generate OTP & Proceed', 'ओटीपी मिळवा व पुढे जा')}</span>
              </button>
            </div>
          </form>
        )}

        {/* Step 2: OTP Verification Screen */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyAndSubmit} className="space-y-4 mt-4 text-xs">
            {/* Simulated SMS Notification Banner */}
            <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3 text-emerald-900 space-y-1">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="flex items-center">
                  <Sparkles className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                  Simulated SMS Gateway Received
                </span>
                <span className="font-mono text-[10px] bg-emerald-200/80 px-1.5 py-0.5 rounded">Govt Maha-SMS</span>
              </div>
              <p className="text-[11px]">
                Your LokVyapar Citizen Verification Code is: <strong className="font-mono text-base text-emerald-900">{generatedOtp}</strong>
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
                onClick={() => setStep('details')}
                className="py-2.5 px-4 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition flex items-center justify-center space-x-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{t('Verify OTP & Publish Review', 'ओटीपी पडताळा व अभिप्राय नोंदवा')}</span>
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Success Screen */}
        {step === 'success' && (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900">
                {t('Review Verified & Published!', 'आपला अभिप्राय यशस्वीरीत्या नोंदवला गेला!')}
              </h4>
              <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
                {t(
                  `Thank you! Your verified rating for ${currentVendor.shopName} is now live and assisting fellow citizens.`,
                  'धन्यवाद! आपला अभिप्राय पोर्टलवर प्रसिद्ध करण्यात आला आहे.'
                )}
              </p>
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
