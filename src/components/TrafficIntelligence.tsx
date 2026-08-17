import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Activity, 
  MapPin, 
  ShieldAlert, 
  TrendingUp, 
  AlertTriangle, 
  Car, 
  Users, 
  Store, 
  CheckCircle2,
  Layers,
  ArrowRight,
  Radio
} from 'lucide-react';

export const TrafficIntelligence: React.FC = () => {
  const { zones, trafficAlerts, setSelectedZone, setActiveTab, t } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Page Header */}
      <div className="bg-[#0f2942] text-white rounded-xl p-5 border-b-2 border-amber-500 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-red-600 text-white font-bold">
              <Car className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold tracking-tight">
              {t('Traffic & Urban Movement Intelligence', 'वाहतूक व नागरी हालचाल गुप्तवार्ता')}
            </h2>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            {t(
              'Correlating commercial transaction density with vehicular corridor choke points and municipal enforcement.',
              'व्यापारी व्यवहार घनता व रस्त्यांवरील वाहतूक कोंडी यांचा थेट ताळमेळ.'
            )}
          </p>
        </div>

        <button
          onClick={() => setActiveTab('map')}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition flex items-center space-x-1.5 shadow"
        >
          <MapPin className="w-4 h-4" />
          <span>{t('View on GIS Heatmap', 'जीआयएस नकाशावर पहा')}</span>
        </button>
      </div>

      {/* Real-time Traffic Pressure Corridors List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {trafficAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-4 rounded-xl border shadow-sm space-y-2.5 ${
              alert.severity === 'critical'
                ? 'bg-rose-50/80 border-rose-300 text-rose-950'
                : alert.severity === 'warning'
                ? 'bg-amber-50/80 border-amber-300 text-amber-950'
                : 'bg-blue-50/80 border-blue-300 text-blue-950'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-white/70">
                {alert.zoneName}
              </span>
              <span className="text-[10px] font-semibold text-slate-500">{alert.time}</span>
            </div>

            <h4 className="text-sm font-bold leading-snug">{alert.title}</h4>
            <p className="text-xs text-slate-700 leading-relaxed">{alert.message}</p>

            <div className="pt-2 border-t border-slate-200/60 text-xs">
              <strong className="text-[10px] uppercase block text-slate-500">Government Recommendation:</strong>
              <p className="font-semibold text-slate-900 mt-0.5">{alert.civicRecommendation}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Commercial vs Vehicular Density Matrix */}
      <div className="bg-white rounded-xl shadow-md border border-slate-200 p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-amber-600" />
            <h3 className="text-base font-bold text-[#0f2942]">
              {t('Commercial Density vs Traffic Pressure Ranking', 'व्यापारी घनता व वाहतूक भार निर्देशांक')}
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">10 Monitored Wards</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Commercial Ward</th>
                <th className="py-3 px-4">City</th>
                <th className="py-3 px-4">Commercial Density</th>
                <th className="py-3 px-4">Active Hawkers/Vendors</th>
                <th className="py-3 px-4">Traffic Pressure</th>
                <th className="py-3 px-4">Critical Peak Window</th>
                <th className="py-3 px-4">Municipal Action Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {zones.map((zone) => (
                <tr key={zone.id} className="hover:bg-amber-50/40 transition">
                  <td className="py-3 px-4 font-bold text-[#0f2942]">{zone.name}</td>
                  <td className="py-3 px-4 font-medium">{zone.city}</td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">
                    {zone.commercialDensity} <span className="text-[10px] text-slate-500 font-normal">stalls/km²</span>
                  </td>
                  <td className="py-3 px-4">{zone.totalVendors} total ({zone.activeVendorsNow} active)</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        zone.trafficPressure === 'Critical'
                          ? 'bg-rose-100 text-rose-800 border border-rose-300'
                          : zone.trafficPressure === 'Heavy'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {zone.trafficPressure} ({zone.trafficScore}/100)
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-amber-900">{zone.peakHour}</td>
                  <td className="py-3 px-4 text-slate-600 text-[11px] max-w-xs">
                    {zone.aiAdvisoryNote?.slice(0, 85)}...
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
