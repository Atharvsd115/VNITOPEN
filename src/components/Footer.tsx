import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  ShieldCheck, 
  Phone, 
  Mail, 
  FileText, 
  MapPin, 
  ExternalLink,
  Lock
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveTab, setIsComplaintModalOpen, setIsVendorAppModalOpen, t } = useApp();

  return (
    <footer className="bg-[#0b1e31] text-slate-300 border-t-4 border-amber-500 text-xs">
      {/* Official Government Flag Ribbon */}
      <div className="h-1.5 w-full flex">
        <div className="w-1/3 bg-[#FF9933]"></div>
        <div className="w-1/3 bg-white"></div>
        <div className="w-1/3 bg-[#138808]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Government Initiative */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="font-black text-white text-base tracking-wide">LOKVYAPAR</div>
                <div className="text-[10px] text-amber-400 font-semibold">महाराष्ट्र शासन • Smart City GIS</div>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {t(
                'An official Government of Maharashtra smart governance platform tracking urban commercial velocity and footfall proxy through authorized UPI digital transaction signals.',
                'अधिकृत डिजिटल यूपीआय व्यवहारांच्या आधारे व्यावसायिक हालचाली व नागरी गर्दी विश्लेषण प्रणाली.'
              )}
            </p>
            <div className="flex items-center space-x-1.5 text-[11px] text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Privacy Compliant (No citizen PII logged)</span>
            </div>
          </div>

          {/* Col 2: Quick Portals */}
          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase tracking-wider text-xs border-b border-slate-700 pb-1">
              {t('Smart City Portals', 'स्मार्ट सिटी दालने')}
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <button
                  onClick={() => setActiveTab('map')}
                  className="hover:text-amber-400 transition flex items-center"
                >
                  <MapPin className="w-3.5 h-3.5 mr-1 text-slate-500" />
                  <span>Commercial GIS Activity Map</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('vendors')}
                  className="hover:text-amber-400 transition flex items-center"
                >
                  <Building2 className="w-3.5 h-3.5 mr-1 text-slate-500" />
                  <span>Top Vendors Registry</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('peak')}
                  className="hover:text-amber-400 transition flex items-center"
                >
                  <FileText className="w-3.5 h-3.5 mr-1 text-slate-500" />
                  <span>Peak Hours & Congestion Forecast</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsComplaintModalOpen(true)}
                  className="hover:text-rose-400 transition text-rose-300 font-semibold flex items-center"
                >
                  <FileText className="w-3.5 h-3.5 mr-1 text-rose-400" />
                  <span>Aaple Sarkar Citizen Grievance</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsVendorAppModalOpen(true)}
                  className="hover:text-emerald-400 transition text-emerald-300 font-semibold flex items-center"
                >
                  <Building2 className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                  <span>Register Street Stall / Shop</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Stakeholder Portals */}
          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase tracking-wider text-xs border-b border-slate-700 pb-1">
              {t('Stakeholders', 'हितधारक प्रवेश')}
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <button
                  onClick={() => setActiveTab('government')}
                  className="hover:text-amber-400 transition flex items-center text-amber-300"
                >
                  <span>Government ULB Admin Portal</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('vendor-portal')}
                  className="hover:text-emerald-400 transition flex items-center text-emerald-300"
                >
                  <span>Registered Vendor Dashboard</span>
                </button>
              </li>
              <li>
                <span className="text-slate-400">
                  Public Visitors (Open Access - No Account Required)
                </span>
              </li>
            </ul>

            <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 space-y-1">
              <div><strong>Nagpur ULB:</strong> Civil Lines, Nagpur 440001</div>
              <div><strong>Pune PMC:</strong> Shivajinagar, Pune 411005</div>
            </div>
          </div>

          {/* Col 4: Citizen Emergency & Contact */}
          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase tracking-wider text-xs border-b border-slate-700 pb-1">
              {t('Helpline & Grievance', 'हेल्पलाईन व संपर्क')}
            </h4>
            <div className="space-y-2 text-[11px]">
              <div className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>Smart City Toll-Free: <strong>1800-120-8040</strong></span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-rose-400" />
                <span>Emergency Police / Traffic: <strong>112</strong></span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                <span>support.lokvyapar@maharashtra.gov.in</span>
              </div>
            </div>

            <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700 text-[10px] text-slate-400">
              Content owned & maintained by Urban Development Department, Govt. of Maharashtra.
            </div>
          </div>
        </div>

        {/* Bottom Legal Copyright Bar */}
        <div className="pt-8 mt-8 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-[10px] text-slate-400">
          <div>
            © 2026 Government of Maharashtra. All Rights Reserved. LokVyapar Smart City Platform.
          </div>
          <div className="flex items-center space-x-4">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-white transition">Hyperlinking Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-white transition">Terms & Conditions</a>
            <span>•</span>
            <a href="#" className="hover:text-white transition">Right to Information (RTI)</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
