import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Clock, 
  Store, 
  TrendingUp, 
  Download, 
  Sparkles, 
  MapPin, 
  Activity, 
  Send,
  Printer,
  ChevronRight,
  Filter,
  UserCheck
} from 'lucide-react';
import { fetchAIZoneAdvisory } from '../services/aiService';

export const GovernmentDashboard: React.FC = () => {
  const {
    zones,
    vendors,
    complaints,
    vendorApplications,
    updateComplaintStatus,
    handleVendorApplicationStatus,
    broadcastAlert,
    userSession,
    totalTodayTransactions,
    t
  } = useApp();

  const [activeSection, setActiveSection] = useState<
    'applications' | 'complaints' | 'zone-analytics' | 'peak-reports' | 'trending-shops' | 'monthly-report' | 'ai-briefing'
  >('applications');

  const [complaintFilter, setComplaintFilter] = useState<'All' | 'Pending' | 'In Progress' | 'Resolved'>('All');
  const [resolutionRemark, setResolutionRemark] = useState('');
  const [activeComplaintId, setActiveComplaintId] = useState<string | null>(null);

  // New alert broadcast state
  const [newAlertTitle, setNewAlertTitle] = useState('');
  const [newAlertZone, setNewAlertZone] = useState(zones[0]?.id || 'sitabuldi');
  const [newAlertMsg, setNewAlertMsg] = useState('');

  // AI Briefing State
  const [aiBriefingLoading, setAiBriefingLoading] = useState(false);
  const [aiBriefingResult, setAiBriefingResult] = useState<any>(null);

  const pendingApps = vendorApplications.filter((a) => a.status === 'Pending');
  const filteredComplaints = complaints.filter((c) => {
    if (complaintFilter === 'All') return true;
    return c.status === complaintFilter;
  });

  const handleBroadcastSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlertTitle || !newAlertMsg) return;
    const z = zones.find((item) => item.id === newAlertZone) || zones[0];
    broadcastAlert({
      zoneId: z.id,
      zoneName: z.name,
      type: 'CONGESTION_WARNING',
      title: newAlertTitle,
      message: newAlertMsg,
      severity: 'warning',
      civicRecommendation: 'Traffic marshals deployed for perimeter enforcement.'
    });
    setNewAlertTitle('');
    setNewAlertMsg('');
    alert('Civic alert broadcasted successfully across public GIS channels.');
  };

  const handleGenerateAiBriefing = async () => {
    setAiBriefingLoading(true);
    try {
      const topZone = zones[0];
      const res = await fetchAIZoneAdvisory({
        zoneName: 'Citywide Commercial Zones (Nagpur & Pune ULBs)',
        currentVolume: totalTodayTransactions,
        peakHour: '6:30 PM - 9:00 PM',
        trafficPressure: 'Critical in 3 hubs',
        complaintsCount: complaints.filter((c) => c.status === 'Pending').length,
        promptType: 'Executive Municipal Smart City Footfall & Enforcement Briefing'
      });
      setAiBriefingResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setAiBriefingLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Official Government Header */}
      <div className="bg-[#0f2942] text-white rounded-xl p-5 border-b-2 border-amber-500 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold tracking-tight">
                {t('Government & Urban Local Body (ULB) Control Center', 'महानगरपालिका व शासन नियंत्रण कक्ष')}
              </h2>
              <p className="text-xs text-slate-300">
                Authorized Municipal Division: <strong className="text-amber-300">Urban Mobility & Commercial Planning Dept</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Quick Officer Info */}
        <div className="flex items-center space-x-3 text-xs bg-white/10 px-3 py-1.5 rounded-lg border border-white/20">
          <UserCheck className="w-4 h-4 text-emerald-400" />
          <span>Officer ID: <strong>MAHA-ULB-8842</strong></span>
        </div>
      </div>

      {/* Government Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-2 flex flex-wrap items-center gap-1.5 text-xs font-bold">
        <button
          onClick={() => setActiveSection('applications')}
          className={`px-3 py-2 rounded-lg transition flex items-center space-x-1.5 ${
            activeSection === 'applications'
              ? 'bg-[#0f2942] text-white shadow-sm'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Vendor Applications</span>
          {pendingApps.length > 0 && (
            <span className="bg-amber-500 text-slate-950 text-[10px] px-1.5 py-0.2 rounded-full font-mono font-black">
              {pendingApps.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSection('complaints')}
          className={`px-3 py-2 rounded-lg transition flex items-center space-x-1.5 ${
            activeSection === 'complaints'
              ? 'bg-[#0f2942] text-white shadow-sm'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <AlertCircle className="w-4 h-4 text-rose-500" />
          <span>Citizen Grievances</span>
          <span className="bg-rose-100 text-rose-800 text-[10px] px-1.5 py-0.2 rounded-full font-mono">
            {complaints.filter((c) => c.status === 'Pending').length} Pending
          </span>
        </button>

        <button
          onClick={() => setActiveSection('zone-analytics')}
          className={`px-3 py-2 rounded-lg transition flex items-center space-x-1.5 ${
            activeSection === 'zone-analytics'
              ? 'bg-[#0f2942] text-white shadow-sm'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Activity className="w-4 h-4 text-blue-500" />
          <span>Zone Analytics & Heatmap</span>
        </button>

        <button
          onClick={() => setActiveSection('peak-reports')}
          className={`px-3 py-2 rounded-lg transition flex items-center space-x-1.5 ${
            activeSection === 'peak-reports'
              ? 'bg-[#0f2942] text-white shadow-sm'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-4 h-4 text-purple-500" />
          <span>Peak Hour Reports</span>
        </button>

        <button
          onClick={() => setActiveSection('trending-shops')}
          className={`px-3 py-2 rounded-lg transition flex items-center space-x-1.5 ${
            activeSection === 'trending-shops'
              ? 'bg-[#0f2942] text-white shadow-sm'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-amber-500" />
          <span>Trending Commercial Nodes</span>
        </button>

        <button
          onClick={() => setActiveSection('ai-briefing')}
          className={`px-3 py-2 rounded-lg transition flex items-center space-x-1.5 ${
            activeSection === 'ai-briefing'
              ? 'bg-[#0f2942] text-white shadow-sm'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>AI Municipal Briefing</span>
        </button>
      </div>

      {/* Section 1: Vendor Applications Approvals */}
      {activeSection === 'applications' && (
        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-[#0f2942]">
                {t('Pending Vendor Onboarding Applications', 'नवीन व्यापारी नोंदणी अर्ज व मंजुरी')}
              </h3>
              <p className="text-xs text-slate-500">
                Verify merchant details, aadhaar mask, and GIS stall coordinates for official registration.
              </p>
            </div>
          </div>

          {vendorApplications.length > 0 ? (
            <div className="space-y-3 text-xs">
              {vendorApplications.map((app) => (
                <div
                  key={app.id}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-sm text-[#0f2942]">{app.shopName}</span>
                      <span className="bg-slate-200 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded">
                        {app.category}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          app.status === 'Approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : app.status === 'Rejected'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>

                    <p className="text-slate-600">
                      Owner: <strong>{app.ownerName}</strong> • Mobile: {app.mobile} • Aadhaar: {app.aadhaarMasked}
                    </p>
                    <p className="text-slate-500">
                      Zone: {app.zoneName} • Address: {app.address} • Applied on: {app.appliedDate}
                    </p>
                  </div>

                  {app.status === 'Pending' && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleVendorApplicationStatus(app.id, 'Approved', 'Verified by Ward Inspector')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold transition flex items-center space-x-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve & Issue Certificate</span>
                      </button>
                      <button
                        onClick={() => handleVendorApplicationStatus(app.id, 'Rejected', 'Insufficient spatial setback')}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded font-bold transition flex items-center space-x-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500 text-xs">
              No vendor applications currently pending review.
            </div>
          )}
        </div>
      )}

      {/* Section 2: Complaints Triage & Resolution */}
      {activeSection === 'complaints' && (
        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-[#0f2942]">
                {t('Aaple Sarkar Citizen Grievance Redressal Pipeline', 'नागरिक तक्रार निवारण प्रक्रिया')}
              </h3>
              <p className="text-xs text-slate-500">
                Action, assign officers, and close verified complaints regarding encroachment, hygiene, or traffic blocks.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="inline-flex rounded-lg border border-slate-300 bg-slate-50 p-0.5 text-xs">
              {(['All', 'Pending', 'In Progress', 'Resolved'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setComplaintFilter(filter)}
                  className={`px-3 py-1 rounded-md font-semibold transition ${
                    complaintFilter === filter ? 'bg-[#0f2942] text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Complaints Table */}
          <div className="space-y-3 text-xs">
            {filteredComplaints.slice(0, 15).map((comp) => (
              <div
                key={comp.id}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-[#0f2942] bg-white px-2 py-0.5 rounded border border-slate-300">
                      {comp.grievanceToken}
                    </span>
                    <span className="font-bold text-slate-800">{comp.complaintType}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        comp.status === 'Resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : comp.status === 'In Progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {comp.status}
                    </span>
                  </div>
                  <span className="text-slate-500 text-[11px]">{comp.timestamp}</span>
                </div>

                <p className="text-slate-700 text-xs leading-relaxed">{comp.description}</p>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/80 text-[11px]">
                  <div className="text-slate-600">
                    Location: <strong>{comp.zoneName}</strong> • Citizen: {comp.citizenMobileMasked} • Assigned:{' '}
                    <strong>{comp.assignedOfficer || 'Ward Cell'}</strong>
                  </div>

                  {comp.status !== 'Resolved' && (
                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() =>
                          updateComplaintStatus(
                            comp.id,
                            'In Progress',
                            'Field inspection team dispatched',
                            'Inspector S. N. Deshmukh'
                          )
                        }
                        className="px-2.5 py-1 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                      >
                        Mark In Progress
                      </button>

                      <button
                        onClick={() =>
                          updateComplaintStatus(
                            comp.id,
                            'Resolved',
                            'Site cleared and vendor issued compliance warning.',
                            'Inspector S. N. Deshmukh'
                          )
                        }
                        className="px-2.5 py-1 rounded bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition"
                      >
                        Resolve & Close
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 3: Zone Analytics & Heatmap Summary */}
      {activeSection === 'zone-analytics' && (
        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-[#0f2942]">
              {t('Municipal Commercial Zone Activity & Footfall Registry', 'विभागीय गर्दी व व्यवहार तपशील')}
            </h3>
            <span className="text-xs font-mono font-bold text-slate-700">
              Total Monitored Pulses: {totalTodayTransactions.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {zones.map((z) => (
              <div key={z.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[#0f2942]">{z.name}</span>
                  <span className="font-mono font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                    Score: {z.activityScore}/100
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 bg-white p-2.5 rounded-lg border border-slate-200 text-[11px]">
                  <div>
                    <span className="text-slate-500 block">Today's Tx</span>
                    <strong className="text-slate-900">{z.todayTransactions}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Total Hawkers</span>
                    <strong className="text-slate-900">{z.totalVendors}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Traffic Status</span>
                    <strong className="text-rose-700">{z.trafficPressure}</strong>
                  </div>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">{z.aiAdvisoryNote}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 4: AI Municipal Briefing Generator */}
      {activeSection === 'ai-briefing' && (
        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-[#0f2942] flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>{t('Citywide AI Municipal Briefing & Enforcement Plan', 'AI महापालिका सारांश व अंमलबजावणी योजना')}</span>
              </h3>
              <p className="text-xs text-slate-500">
                Synthesizes digital transaction signals across all municipal wards to recommend traffic deployments.
              </p>
            </div>

            <button
              onClick={handleGenerateAiBriefing}
              disabled={aiBriefingLoading}
              className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg font-bold text-xs transition flex items-center space-x-1.5 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{aiBriefingLoading ? 'Synthesizing Signals...' : 'Generate New Briefing'}</span>
            </button>
          </div>

          {aiBriefingResult ? (
            <div className="bg-purple-50/70 rounded-xl p-5 border border-purple-200 space-y-4 text-xs">
              <div>
                <span className="font-mono text-[10px] uppercase font-bold text-purple-900 bg-purple-200 px-2 py-0.5 rounded">
                  Intelligence Source: {aiBriefingResult.source}
                </span>
                <h4 className="text-sm font-bold text-[#0f2942] mt-2">Executive Footfall Dynamics Summary</h4>
                <p className="text-slate-800 mt-1 leading-relaxed">{aiBriefingResult.summary}</p>
              </div>

              <div className="bg-white p-3.5 rounded-lg border border-purple-200 space-y-1">
                <h5 className="font-bold text-rose-800 text-xs">Mandatory Enforcement Actions:</h5>
                <p className="text-slate-700 leading-relaxed">{aiBriefingResult.trafficAction}</p>
              </div>

              <div className="space-y-1">
                <h5 className="font-bold text-slate-700">Movement Pattern Insights:</h5>
                <ul className="space-y-1 text-slate-600 list-disc list-inside">
                  {aiBriefingResult.keyInsights?.map((k: string, i: number) => (
                    <li key={i}>{k}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-xs text-slate-500">
              Click "Generate New Briefing" to run Gemini AI cross-ward intelligence.
            </div>
          )}
        </div>
      )}

      {/* Civic Alert Broadcast Box */}
      <div className="bg-white rounded-xl shadow-md border border-slate-200 p-5 space-y-3">
        <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
          <Send className="w-4 h-4 text-amber-600" />
          <h4 className="text-sm font-bold text-[#0f2942]">
            {t('Broadcast Real-Time Civic & Traffic Alert', 'नागरिक व वाहतूक इशारा प्रसारित करा')}
          </h4>
        </div>

        <form onSubmit={handleBroadcastSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1">Target Zone</label>
            <select
              value={newAlertZone}
              onChange={(e) => setNewAlertZone(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded font-semibold text-slate-800"
            >
              {zones.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Alert Title</label>
            <input
              type="text"
              value={newAlertTitle}
              onChange={(e) => setNewAlertTitle(e.target.value)}
              placeholder="e.g. Evening Commercial Surge at Sitabuldi"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded font-semibold text-slate-800"
              required
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Citizen Advisory Note</label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newAlertMsg}
                onChange={(e) => setNewAlertMsg(e.target.value)}
                placeholder="e.g. Avoid 4-wheeler entry via Liberty Cinema"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-800"
                required
              />
              <button
                type="submit"
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded transition flex-shrink-0"
              >
                Broadcast
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
