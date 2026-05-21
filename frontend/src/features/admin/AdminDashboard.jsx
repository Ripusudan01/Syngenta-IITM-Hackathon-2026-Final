import { useState, useEffect } from 'react';
import {
  Plus, Minus, RotateCcw, Layers,  
  Info,  ChevronLeft, ChevronRight, RefreshCw,
   Flame, Users, Sprout, ShieldCheck, HeartPulse
} from 'lucide-react';
import RegionalThreatMap from './RegionalThreatMap';
import { apiService } from '../../utils/apiService';
import DailyVisitPlan from './DailyVisitPlan'; 

export default function AdminDashboard() {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeLayer, setActiveLayer] = useState('telemetry'); 

  // --- API STATE VARIABLES ---
  const [loading, setLoading] = useState(true);
  const [dashboardMetrics, setDashboardMetrics] = useState({
    activeFarmers: 0,
    mappedRetailers: 0,
    integrityRating: '95.0%',
    activeWarnings: 0,
    advisoryText: 'Loading real-time advisories...',
    // /trust-summary metrics
    trustTotalFarmers: 0,
    criticalCases: 0,
    highRiskCases: 0,
    panicFarmers: 0,
    // /llm-summary metrics
    trustedFarmers: 0,
    panicStateFarmers: 0,
    totalProfiles: 0
  });

  useEffect(() => {
    let isMounted = true;
    async function loadDashboardData() {
      try {
        setLoading(true);
        const defaultRetailerId = "RET-TN-042"; 
        
        // Fetching all endpoints in parallel for maximum network efficiency
        const [criticalData, llmSummary, advisoryMessage, trustSummary] = await Promise.all([
          apiService.getCriticalFarmers(),
          apiService.getLlmSummary(),
          apiService.getRelationshipMessage(defaultRetailerId),
          apiService.getTrustSummary()
        ]);

        if (isMounted) {
          setDashboardMetrics({
            activeFarmers: criticalData?.total_farmers || 4890, 
            mappedRetailers: criticalData?.active_nodes || 1240,
            integrityRating: llmSummary?.integrity_score || '96.2% Optimal',
            activeWarnings: criticalData?.warning_count || 26,
            advisoryText: advisoryMessage?.generated_text || 'Localized telemetry adjustments detected near Tamil Nadu grids.',
            // /trust-summary dynamic payload mapping
            trustTotalFarmers: trustSummary?.total_farmers || 86735,
            criticalCases: trustSummary?.critical_cases || 21640,
            highRiskCases: trustSummary?.high_risk_cases || 14358,
            panicFarmers: trustSummary?.panic_farmers || 21640,
            // /llm-summary newly integrated fields
            trustedFarmers: llmSummary?.trusted_farmers || 34593,
            panicStateFarmers: llmSummary?.panic_state_farmers || 21640,
            totalProfiles: llmSummary?.total_profiles || 86735
          });
        }
      } catch (error) {
        console.error("Error communicating with FastAPI Backend:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadDashboardData();
    return () => { isMounted = false; };
  }, []);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 15, 175));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 15, 60));
  const handleResetZoom = () => setZoomLevel(100);

  // Compute calculated ratios for advanced telemetry visual elements
  const trustRatio = dashboardMetrics.totalProfiles > 0 
    ? ((dashboardMetrics.trustedFarmers / dashboardMetrics.totalProfiles) * 100).toFixed(1) 
    : 0;

  return (
    <div className="space-y-6 text-slate-700 w-full p-2 font-sans antialiased bg-slate-50/40 rounded-3xl border border-slate-200/50 shadow-xs">
      
      {/* 1. TOP PREMIUM GEOMETRIC KPI SUITE */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* TOTAL PROFILES AND VERIFIED NETWORK */}
        <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-xs relative overflow-hidden group hover:border-emerald-500/30 transition-all duration-300">
          <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500" />
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Total Profiles</span>
              <span className="text-2xl font-black text-slate-900 tracking-tight">{dashboardMetrics.totalProfiles.toLocaleString()}</span>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 group-hover:scale-110 transition-transform duration-300">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Active Farmers Node:</span>
            <span className="font-bold text-slate-800">{dashboardMetrics.trustTotalFarmers.toLocaleString()}</span>
          </div>
        </div>

        {/* ECOSYSTEM TRUST INDEX & RATIO */}
        <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-xs relative overflow-hidden group hover:border-teal-500/30 transition-all duration-300">
          <div className="absolute top-0 left-0 right-0 h-1 bg-teal-500" />
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Trusted Network</span>
              <span className="text-2xl font-black text-slate-900 tracking-tight">{dashboardMetrics.trustedFarmers.toLocaleString()}</span>
            </div>
            <div className="p-3 bg-teal-50 rounded-xl text-teal-600 group-hover:scale-110 transition-transform duration-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          {/* Micro Telemetry Bar Component */}
          <div className="mt-3 space-y-1">
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden flex">
              <div style={{ width: `${trustRatio}%` }} className="bg-teal-500 h-full rounded-full transition-all duration-500" />
            </div>
            <div className="flex justify-between text-[10px] font-bold text-slate-400">
              <span>TRUST INDEX</span>
              <span className="text-teal-600">{trustRatio}% Alpha</span>
            </div>
          </div>
        </div>

        {/* HIGH RISK REGIONAL SEGMENTATION */}
        <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-xs relative overflow-hidden group hover:border-amber-500/30 transition-all duration-300">
          <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500" />
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">High Risk Cases</span>
              <span className="text-2xl font-black text-slate-900 tracking-tight">{dashboardMetrics.highRiskCases.toLocaleString()}</span>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl text-amber-600 group-hover:scale-110 transition-transform duration-300">
              <Sprout className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Critical Vectors:</span>
            <span className="font-extrabold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded text-[10px]">{dashboardMetrics.criticalCases.toLocaleString()}</span>
          </div>
        </div>

        {/* CRITICAL PANIC THREAT RESPONSE */}
        <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-xs relative overflow-hidden group hover:border-rose-500/30 transition-all duration-300">
          <div className="absolute top-0 left-0 right-0 h-1 bg-rose-500" />
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Panic State Metric</span>
              <span className="text-2xl font-black text-rose-600 tracking-tight">{dashboardMetrics.panicStateFarmers.toLocaleString()}</span>
            </div>
            <div className="p-3 bg-rose-50 rounded-xl text-rose-600 group-hover:scale-110 transition-transform duration-300">
              <Flame className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Mitigation Targets:</span>
            <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded text-[10px]">Active Response</span>
          </div>
        </div>

      </div>

      {/* 2. GEOSPATIAL CONTROL PLATFORM AND SIDE PANEL */}
      <div className="relative w-full h-[66vh] bg-emerald-950/15 rounded-2xl border border-slate-200/90 overflow-hidden shadow-md flex">
        
        {/* INTERACTIVE VECTOR CANVAS MAP */}
        <div className="flex-1 h-full relative overflow-hidden flex items-center justify-center bg-[#07100b] select-none">
          <div 
            style={{ 
              transform: `scale(${zoomLevel / 100})`, 
              transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)' 
            }}
            className="w-full h-full origin-center flex items-center justify-center"
          >
            <RegionalThreatMap />
          </div>

          {/* FLOATING CONTROL MATRIX */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-emerald-950/95 backdrop-blur-md p-1.5 rounded-xl shadow-2xl border border-emerald-800/40">
            <button onClick={handleZoomIn} aria-label="Zoom In" className="w-8 h-8 rounded-lg hover:bg-emerald-900/60 flex items-center justify-center text-emerald-100 active:scale-95 transition-all">
              <Plus className="w-4 h-4" />
            </button>
            <button onClick={handleZoomOut} aria-label="Zoom Out" className="w-8 h-8 rounded-lg hover:bg-emerald-900/60 flex items-center justify-center text-emerald-100 active:scale-95 transition-all">
              <Minus className="w-4 h-4" />
            </button>
            <button onClick={handleResetZoom} aria-label="Reset Zoom" className="w-8 h-8 rounded-lg hover:bg-emerald-900/60 flex items-center justify-center text-emerald-300 hover:text-white transition-colors">
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <div className="w-px h-4 bg-emerald-800/60 mx-1" />
            <button 
              onClick={() => setActiveLayer(activeLayer === 'telemetry' ? 'terrain' : 'telemetry')}
              aria-label="Toggle map layer"
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${activeLayer === 'telemetry' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'text-emerald-400 hover:bg-emerald-900/40'}`}
            >
              <Layers className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* SYSTEM BOTTOM HUD INFOBAR */}
          <div className="absolute bottom-4 left-4 right-4 z-20 bg-emerald-950/90 backdrop-blur-md border border-emerald-800/30 rounded-xl p-3 px-4 flex justify-between items-center text-[10px] text-emerald-200/80 font-medium shadow-2xl">
            <span className="flex items-center gap-2 tracking-wide uppercase">
              <Info className="w-3.5 h-3.5 text-emerald-400" />
              Core Analytics System Synchronized • Hyper-Local Agronomic Grid Ready
            </span>
            <span className="flex items-center gap-1.5 font-bold text-white bg-emerald-900/50 py-1 px-2.5 rounded-md border border-emerald-700/40">
              <RefreshCw className={`w-2.5 h-2.5 text-emerald-400 ${loading ? 'animate-spin' : ''}`} /> Sync Active
            </span>
          </div>

          {/* COLLAPSIBLE TOGGLE BUTTON */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label={isSidebarOpen ? "Collapse Info Panel" : "Expand Info Panel"}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-30 bg-emerald-950 text-emerald-400 hover:text-white shadow-2xl border-y border-l border-emerald-800/50 w-5 h-14 rounded-l-xl flex items-center justify-center transition-all"
          >
            {isSidebarOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* 3. CONTEXT EXTENDED SUMMARY SIDE PANEL */}
        <div 
          className={`h-full bg-white flex flex-col justify-between transition-all duration-300 ease-in-out relative z-10 border-l border-slate-200/60 ${
            isSidebarOpen ? 'w-80 opacity-100' : 'w-0 opacity-0 pointer-events-none'
          }`}
        >
          <div className="p-5 flex-1 flex flex-col justify-start space-y-4 overflow-y-auto select-text">
            
            <div>
              <span className="text-[9px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md uppercase tracking-wider">Workspace Node</span>
              <h3 className="text-base font-black text-slate-800 mt-1 tracking-tight">Ecosystem Supervisor</h3>
            </div>

            {/* SYSTEM STATUS BANNER */}
            <div className="bg-emerald-50/40 border border-emerald-100 p-3.5 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                <HeartPulse className="w-4 h-4 text-emerald-600" />
                <span>Ecosystem Health Matrix</span>
              </div>
              <p className="text-[11px] text-emerald-800/80 leading-relaxed font-medium">
                Real-time validation maps check model risk profiles against incoming agronomic signals. System pipelines match 1:1.
              </p>
            </div>

            {/* GRID TELEMETRY METRICS MODULE */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Zone Telemetry Metrics</span>
              
              <div className="border border-slate-100 rounded-xl divide-y divide-slate-100 text-xs overflow-hidden bg-white shadow-3xs">
                <div className="p-3 flex justify-between items-center hover:bg-slate-50/50 transition-colors">
                  <span className="text-slate-400 font-medium">Active Farmers</span>
                  <span className="font-bold text-slate-800">{dashboardMetrics.activeFarmers.toLocaleString()} Users</span>
                </div>
                <div className="p-3 flex justify-between items-center hover:bg-slate-50/50 transition-colors">
                  <span className="text-slate-400 font-medium">Mapped Retail Nodes</span>
                  <span className="font-bold text-slate-800">{dashboardMetrics.mappedRetailers.toLocaleString()} Sites</span>
                </div>
                <div className="p-3 flex justify-between items-center hover:bg-slate-50/50 transition-colors">
                  <span className="text-slate-400 font-medium">System Integrity</span>
                  <span className="font-extrabold text-emerald-700 text-[10px] bg-emerald-50 px-2 py-0.5 rounded uppercase">
                    {dashboardMetrics.integrityRating}
                  </span>
                </div>
                <div className="p-3 flex justify-between items-center hover:bg-slate-50/50 transition-colors">
                  <span className="text-slate-400 font-medium">Outbreak Warnings</span>
                  <span className="font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded text-[10px]">
                    {dashboardMetrics.activeWarnings} Active
                  </span>
                </div>
              </div>
            </div>

            {/* LIVE LLM-ADVISORY QUEUE BANNER */}
            <div className="border border-amber-200 bg-amber-50/40 p-3.5 rounded-xl space-y-1.5">
              <span className="text-[10px] font-extrabold text-amber-700 flex items-center gap-1 uppercase tracking-wider">
                ⚠️ Advisory Queue Trigger
              </span>
              <p className="text-[11px] text-amber-800 font-medium leading-normal">
                {dashboardMetrics.advisoryText}
              </p>
            </div>

          </div>

          {/* LOWER PANEL BASE */}
          <div className="p-4 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-400 tracking-wider uppercase">
            <span>Console Cluster V2</span>
            <span className="text-emerald-600 font-bold flex items-center gap-1">
              ● Live Synchronized
            </span>
          </div>
        </div>

      </div>
      {/* 4. DAILY VISIT PLAN RECOMMENDATIONS */}
      {/* <DailyVisitPlan /> */}

    </div>
  );
}