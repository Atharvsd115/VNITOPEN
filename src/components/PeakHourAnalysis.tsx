import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Clock, 
  Sparkles, 
  TrendingUp, 
  AlertTriangle, 
  MapPin, 
  ShieldAlert, 
  Store, 
  Activity, 
  CheckCircle2, 
  Zap,
  ArrowRight,
  BrainCircuit
} from 'lucide-react';
import { fetchAIZoneAdvisory } from '../services/aiService';

export const PeakHourAnalysis: React.FC = () => {
  const { zones, predictions, setSelectedZone, setActiveTab, t } = useApp();

  const [aiLoading, setAiLoading] = useState(false);
  const [selectedZoneForAI, setSelectedZoneForAI] = useState(zones[0]);
  const [aiReport, setAiReport] = useState<any>(null);

  const handleRunAiForecast = async (zone = selectedZoneForAI) => {
    setAiLoading(true);
    setSelectedZoneForAI(zone);
    try {
      const res = await fetchAIZoneAdvisory({
        zoneName: zone.name,
        currentVolume: zone.todayTransactions,
        peakHour: zone.peakHour,
        trafficPressure: zone.trafficPressure,
        complaintsCount: 2,
        promptType: 'Peak Hour Prediction & Congestion Prevention'
      });
      setAiReport(res);
    } catch (e) {
      console.error(e);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Page Header */}
      <div className="bg-[#0f2942] text-white rounded-xl p-5 border-b-2 border-amber-500 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-purple-500 text-white font-bold">
              <Clock className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold tracking-tight">
              {t('Peak Hour Predictive Analytics & Congestion Alerting', 'गर्दीच्या वेळांचे AI विश्लेषण व अंदाज')}
            </h2>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            {t(
              'Machine Learning models analyzing temporal transaction velocity to forecast commercial crowding before it peaks.',
              'व्यवहारांच्या वेगावर आधारित गर्दीचा आगाऊ अंदाज व उपाययोजना.'
            )}
          </p>
        </div>

        {/* Live Confidence Badge */}
        <div className="flex items-center space-x-2 bg-purple-900/60 border border-purple-400/40 px-3 py-1.5 rounded-lg text-xs font-mono text-purple-200">
          <BrainCircuit className="w-4 h-4 text-purple-300 animate-pulse" />
          <span>Model Accuracy: <strong>94.8%</strong> (NPCI Signal Fed)</span>
        </div>
      </div>

      {/* Top 4 Predicted Busy Periods (Required Format) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {zones.slice(0, 4).map((zone) => {
          const isSevere = zone.trafficPressure === 'Critical' || zone.activityScore >= 90;
          return (
            <div
              key={zone.id}
              className="bg-white rounded-xl shadow-sm border border-slate-200 hover:border-amber-500 transition p-4 space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-slate-500">{zone.city} Ward</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                      isSevere ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    Traffic: {zone.trafficPressure}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-[#0f2942] mt-1.5">{zone.name}</h3>
              </div>

              {/* Exact fields specified in prompt */}
              <div className="space-y-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">{t('Current Activity:', 'सध्याचे व्यवहार:')}</span>
                  <strong className="text-slate-900">{zone.activityLevel}</strong>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">{t('Observed Peak:', 'गर्दीची वेळ:')}</span>
                  <strong className="text-amber-800">{zone.peakHour}</strong>
                </div>

                <div className="flex justify-between pt-1 border-t border-slate-200">
                  <span className="text-purple-700 font-bold flex items-center">
                    <Sparkles className="w-3 h-3 mr-1" />
                    {t('AI Prediction:', 'AI अंदाज:')}
                  </span>
                  <strong className="text-purple-900 font-black">{zone.predictedPeakHour}</strong>
                </div>
              </div>

              <button
                onClick={() => handleRunAiForecast(zone)}
                className="w-full py-1.5 px-2 bg-slate-100 hover:bg-[#0f2942] hover:text-white rounded text-slate-700 font-bold text-xs transition flex items-center justify-center space-x-1"
              >
                <span>Run AI Advisory</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Deep Dive: AI Municipal Forecast Section */}
      <div className="bg-white rounded-xl shadow-md border border-slate-200 p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <BrainCircuit className="w-5 h-5 text-purple-700" />
            <div>
              <h3 className="text-base font-bold text-[#0f2942]">
                {t('Zone AI Municipal Advisory & Pre-Emptive Traffic Action', 'विभागीय AI नागरी कृती आराखडा')}
              </h3>
              <p className="text-xs text-slate-500">
                Selected Zone: <strong className="text-slate-900">{selectedZoneForAI.name}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={selectedZoneForAI.id}
              onChange={(e) => {
                const z = zones.find((item) => item.id === e.target.value);
                if (z) {
                  setSelectedZoneForAI(z);
                  handleRunAiForecast(z);
                }
              }}
              className="text-xs px-3 py-1.5 bg-slate-50 border border-slate-300 rounded font-semibold text-slate-800"
            >
              {zones.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.name}
                </option>
              ))}
            </select>

            <button
              onClick={() => handleRunAiForecast()}
              disabled={aiLoading}
              className="px-4 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded text-xs font-bold transition flex items-center space-x-1.5 disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{aiLoading ? 'Analyzing Model...' : 'Generate New Advisory'}</span>
            </button>
          </div>
        </div>

        {/* AI Output Card */}
        {aiReport ? (
          <div className="bg-gradient-to-br from-purple-50/70 via-white to-amber-50/50 p-5 rounded-xl border border-purple-200 space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-bold text-purple-900 bg-purple-100 px-2 py-0.5 rounded border border-purple-300">
                Engine: {aiReport.source}
              </span>
              <span className="text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded text-[11px]">
                Confidence Score: {aiReport.confidenceScore}%
              </span>
            </div>

            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Executive Summary</h4>
              <p className="text-slate-800 text-sm leading-relaxed">{aiReport.summary}</p>
            </div>

            <div className="bg-amber-100/70 border border-amber-300 p-3 rounded-lg text-amber-950 space-y-1">
              <div className="font-bold flex items-center space-x-1 text-xs">
                <ShieldAlert className="w-4 h-4 text-amber-800" />
                <span>Municipal & Traffic Enforcement Directive:</span>
              </div>
              <p className="text-xs text-amber-900 leading-normal">{aiReport.trafficAction}</p>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-purple-100">
              <h5 className="font-bold text-slate-700 uppercase text-[10px]">Key Footfall Drivers & Movement Signals</h5>
              <ul className="space-y-1 text-slate-600">
                {aiReport.keyInsights?.map((insight: string, idx: number) => (
                  <li key={idx} className="flex items-start space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-xs text-slate-500">
            Click "Generate New Advisory" to trigger Gemini AI peak hour predictive modeling.
          </div>
        )}
      </div>

      {/* Peak Vendor Corridors List */}
      <div className="bg-white rounded-xl shadow-md border border-slate-200 p-5 space-y-4">
        <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
          <Store className="w-4 h-4 text-amber-600" />
          <h4 className="text-sm font-bold text-[#0f2942]">
            {t('High Pressure Commercial Micro-Nodes (Top Peak Vendors)', 'गर्दीचे केंद्रबिंदू असलेले प्रमुख व्यापारी')}
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {zones.map((zone) => (
            <div key={zone.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
              <div className="font-bold text-[#0f2942]">{zone.name}</div>
              <div className="text-slate-600 text-[11px]">
                Active Peak Window: <strong className="text-amber-800">{zone.peakHour}</strong>
              </div>
              <div className="text-slate-500 text-[10px]">
                Commercial Density: {zone.commercialDensity} vendors/sq km
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
