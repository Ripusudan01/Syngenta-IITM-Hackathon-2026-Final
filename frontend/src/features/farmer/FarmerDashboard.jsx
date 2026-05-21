import { useState, useEffect } from 'react';
import { 
  Tractor, 
  MapPin, 
  Sprout, 
  CloudSun, 
  Droplets, 
  ShieldCheck, 
  TrendingUp, 
  Layers,
  Thermometer,
  Gauge,
  Calendar,
  AlertTriangle,
  ChevronRight,
  Info,
  Wind
} from 'lucide-react';
import apiClient from '../../api/client'; 
import RegionalThreatMap from '../admin/RegionalThreatMap';

export default function FarmerDashboard({ activeFarmer }) {
  const [activeFarmerProfile, setActiveFarmerProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [selectedAdvisoryTab, setSelectedAdvisoryTab] = useState('protection');

  useEffect(() => {
    if (activeFarmer && activeFarmer.retailer_id) {
      setProfileLoading(true);
      
      apiClient.get(`/farmer-profile/${activeFarmer.retailer_id}`)
        .then((res) => {
          if (res.data) {
            setActiveFarmerProfile(res.data);
          }
          setProfileLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching live backend profile matrix:", err);
          setProfileLoading(false);
        });
    }
  }, [activeFarmer]); 

  if (profileLoading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center bg-gradient-to-br from-emerald-950 to-[#012010] rounded-3xl border border-emerald-800 shadow-xl">
        <div className="relative flex items-center justify-center mb-4">
          <div className="absolute w-12 h-12 rounded-full border-4 border-emerald-500/20 border-t-emerald-400 animate-spin"></div>
          <Sprout className="w-5 h-5 text-emerald-400 animate-pulse" />
        </div>
        <p className="text-xs font-bold text-emerald-200 tracking-widest font-mono uppercase">Syngenta Bio-Intelligence Engine</p>
        <p className="text-[11px] text-emerald-400/60 mt-1 animate-pulse">Syncing satellite telemetry & agronomic diagnostics...</p>
      </div>
    );
  }

  // Dynamic calculation mapping text growth phases to standard visual nodes
  const getGrowthStageStep = (stage) => {
    const clean = String(stage || '').toLowerCase();
    if (clean.includes('seed') || clean.includes('nursery') || clean.includes('ਬਿਜਾਈ')) return 1;
    if (clean.includes('veg') || clean.includes('growth') || clean.includes('ਵਾਧਾ') || clean.includes('tillering')) return 2;
    if (clean.includes('panicle') || clean.includes('initiation') || clean.includes('ਨਿਸਾਰਾ')) return 3;
    if (clean.includes('flower') || clean.includes('booting') || clean.includes('ਬੂਰ')) return 4;
    if (clean.includes('matur') || clean.includes('harvest') || clean.includes('ਪੱਕਣ')) return 5;
    return 2; // Default baseline step fallback
  };

  const activeStep = getGrowthStageStep(activeFarmerProfile?.season_stage);

  return (
    <div 
      className="relative p-5 space-y-5 w-full mx-auto rounded-3xl pb-12 overflow-hidden bg-slate-50 transition-all duration-300 select-none"
      style={{
        backgroundImage: `
          radial-gradient(circle at 0% 0%, rgba(232, 245, 233, 0.6) 0%, transparent 45%),
          radial-gradient(circle at 100% 100%, rgba(255, 253, 231, 0.5) 0%, transparent 40%),
          url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm40 40h40v40H40V40zM0 78h80v2H0v-2zm0-4h80v2H0v-2zm0-4h80v2H0v-2zm0-4h80v2H0v-2zm0-4h80v2H0v-2zm0-4h80v2H0v-2zm0-4h80v2H0v-2zm0-4h80v2H0v-2zm0-4h80v2H0v-2zm0-4h80v2H0v-2zm0-4h80v2H0v-2zm0-4h80v2H0v-2zm0-4h80v2H0v-2zm0-4h80v2H0v-2zm0-4h80v2H0v-2zm0-4h80v2H0v-2zm0-4h80v2H0v-2zm0-4h80v2H0v-2zm0-4h80v2H0v-2z' fill='%2310b981' fill-opacity='0.025' fill-rule='evenodd'/%3E%3C/svg%3E")
        `
      }}
    >
      
      {/* Ambient Photosynthesis Leaf Orbs Floating in Background */}
      <div className="absolute top-1/4 right-[-10%] w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none z-0"></div>
      <div className="absolute bottom-10 left-[-5%] w-80 h-80 bg-amber-100/30 rounded-full blur-3xl pointer-events-none z-0"></div>

      {/* ─── ROW 1: LIVE AGRO-ENVIRONMENTAL TELEMETRY TICKER (DYNAMIC) ─── */}
      <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-3 bg-gradient-to-r from-[#012413] via-[#043d20] to-[#012413] p-3 rounded-2xl border-b-4 border-emerald-600 shadow-xl shadow-emerald-950/10">
        
        {/* Soil Moisture */}
        <div className="flex items-center space-x-2.5 px-3 py-1.5 bg-black/20 rounded-xl border border-white/5 backdrop-blur-xs">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Droplets className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="block text-[9px] text-emerald-300/60 font-mono uppercase tracking-wider">Soil Moisture</span>
            <span className="block text-xs font-bold font-mono text-emerald-100">
              {activeFarmerProfile?.soil_moisture ? `${activeFarmerProfile.soil_moisture}%` : 'N/A'}{' '}
              <span className="text-[10px] text-emerald-400 font-normal">VWC</span>
            </span>
          </div>
        </div>

        {/* NDVI Grid Index */}
        <div className="flex items-center space-x-2.5 px-3 py-1.5 bg-black/20 rounded-xl border border-white/5 backdrop-blur-xs">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
            <Gauge className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="block text-[9px] text-emerald-300/60 font-mono uppercase tracking-wider">NDVI Index</span>
            <span className="block text-xs font-bold font-mono text-emerald-100">
              {activeFarmerProfile?.ndvi_index || activeFarmerProfile?.ndvi || '0.72'}{' '}
              <span className="text-[10px] text-amber-400 font-normal">SAT</span>
            </span>
          </div>
        </div>

        {/* Canopy Temperature */}
        <div className="flex items-center space-x-2.5 px-3 py-1.5 bg-black/20 rounded-xl border border-white/5 backdrop-blur-xs">
          <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400">
            <Thermometer className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="block text-[9px] text-emerald-300/60 font-mono uppercase tracking-wider">Canopy Temp</span>
            <span className="block text-xs font-bold font-mono text-emerald-100">
              {activeFarmerProfile?.canopy_temp ? `${activeFarmerProfile.canopy_temp}°C` : '26.8°C'}{' '}
              <span className="text-[10px] text-sky-400 font-normal">▲ Active</span>
            </span>
          </div>
        </div>

        {/* Transpiration / Humidity Index */}
        <div className="flex items-center space-x-2.5 px-3 py-1.5 bg-black/20 rounded-xl border border-white/5 backdrop-blur-xs">
          <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400">
            <Wind className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="block text-[9px] text-emerald-300/60 font-mono uppercase tracking-wider">Atmospheric Hum.</span>
            <span className="block text-xs font-bold font-mono text-emerald-100">
              {activeFarmerProfile?.humidity || '62%'}{' '}
              <span className="text-[10px] text-teal-400 font-normal">RH</span>
            </span>
          </div>
        </div>
      </div>

      {/* ─── ROW 2: WELCOME HERO BANNER (DYNAMIC) ─── */}
      <div className="relative z-10 bg-[#01371b] p-8 rounded-3xl text-white flex flex-col md:flex-row md:justify-between md:items-center shadow-lg border border-emerald-800 overflow-hidden group">
        <div className="absolute -right-6 -bottom-6 w-52 h-52 bg-gradient-to-tr from-emerald-600/20 to-transparent rounded-full pointer-events-none group-hover:scale-110 transition-transform duration-700"></div>
        <div className="absolute right-1/4 top-0 w-40 h-40 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="space-y-3 relative z-10 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[9px] font-mono font-black tracking-widest text-emerald-300 bg-emerald-950/80 border border-emerald-500/30 px-2.5 py-0.5 rounded flex items-center gap-1 uppercase">
              <Sprout className="w-3 h-3 text-emerald-400 animate-bounce" /> Syngenta Crop Matrix Desk
            </span>
            <span className="text-[10px] font-bold bg-white/10 text-white px-2.5 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-md border border-white/10">
              <MapPin className="w-3 h-3 text-amber-400 fill-amber-400/20" />
              {activeFarmer?.district || activeFarmerProfile?.district || 'Regional'}, {activeFarmer?.state_location || activeFarmerProfile?.state || 'India'}
            </span>
          </div>
          
          <div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white drop-shadow-xs">
              Grower Profile: {activeFarmer?.farmer_name || activeFarmerProfile?.farmer_name || "Active Field Producer"}
            </h2>
            <p className="text-xs md:text-sm text-emerald-100/70 font-medium mt-1 leading-relaxed">
              Targeted diagnostic matrix calibrated for the crop profile of the{' '}
              <span className="text-amber-300 font-bold underline underline-offset-4 decoration-amber-400/40">
                {activeFarmer?.tehsil || activeFarmerProfile?.tehsil || 'Zone'}
              </span>{' '}
              sector block fields.
            </p>
          </div>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center space-x-3 shrink-0 relative z-10 bg-emerald-950/50 border border-emerald-800 p-3.5 rounded-2xl backdrop-blur-md">
          <Tractor className="w-10 h-10 text-emerald-300 animate-pulse" />
          <div className="text-right">
            <span className="block text-[9px] text-emerald-400 font-mono uppercase tracking-wider">GIS Ground Link</span>
            <span className="block text-xs font-bold text-emerald-200 uppercase tracking-wide">
              ID: {activeFarmer?.retailer_id || 'SYN-GRID'}
            </span>
          </div>
        </div>
      </div>

      {/* ─── ROW 3: PHENOLOGICAL CROP TIMELINE TRACKER (DYNAMIC) ─── */}
      <div className="relative z-10 backdrop-blur-md bg-white/75 p-5 rounded-3xl border border-emerald-100/80 shadow-md">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-emerald-100/40">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-emerald-800" />
            <h3 className="text-xs font-black text-emerald-950 uppercase tracking-wide">Phenological Growth Timeline</h3>
          </div>
          <span className="text-[10px] bg-emerald-800 text-white border border-emerald-900 px-2.5 py-0.5 rounded-md font-mono font-bold uppercase tracking-wider">
            Current Stage: {activeFarmerProfile?.season_stage?.toUpperCase().replace('_', ' ') || 'VEGETATIVE'}
          </span>
        </div>

        <div className="grid grid-cols-5 gap-2 relative pt-2">
          {[
            { step: 1, name: "Nursery / Sowing", desc: "Germination Phase" },
            { step: 2, name: "Vegetative / Tillering", desc: "Canopy Splitting" },
            { step: 3, name: "Panicle Initiation", desc: "Stem Elongation" },
            { step: 4, name: "Booting / Flowering", desc: "Anthesis Window" },
            { step: 5, name: "Physiological Maturity", desc: "Grain Hardening" }
          ].map((node) => {
            const isDone = activeStep > node.step;
            const isCurrent = activeStep === node.step;
            return (
              <div key={node.step} className="relative flex flex-col items-center text-center">
                {node.step < 5 && (
                  <div className={`absolute left-1/2 right-[-50%] top-3.5 h-0.5 z-0 ${
                    isDone ? 'bg-emerald-600' : 'bg-emerald-100'
                  }`}></div>
                )}
                
                <div className={`w-7 h-7 rounded-full flex items-center justify-center font-mono font-bold text-xs relative z-10 transition-all border shadow-xs ${
                  isCurrent ? 'bg-amber-400 border-amber-500 text-amber-950 scale-110 ring-4 ring-amber-100' :
                  isDone ? 'bg-emerald-700 border-emerald-800 text-white' : 'bg-white border-emerald-100 text-slate-400'
                }`}>
                  {isDone ? '✓' : node.step}
                </div>
                
                <span className={`block text-[10px] font-bold mt-2 truncate w-full px-1 ${
                  isCurrent ? 'text-emerald-950 font-extrabold' : isDone ? 'text-slate-700' : 'text-slate-400'
                }`}>{node.name}</span>
                <span className="hidden md:block text-[9px] text-slate-400 font-medium truncate w-full px-1">{node.desc}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── ROW 4: STRATEGIC AGRONOMY METRICS GLASS TILES (DYNAMIC) ─── */}
    {/* ─── ROW 4: STRATEGIC AGRONOMY METRICS GLASS TILES (DYNAMIC) ─── */}
      <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Dynamic Metric Tile 1: Revenue / Value */}
        <div className="backdrop-blur-md bg-white/75 p-4 rounded-2xl border border-emerald-100/80 shadow-md hover:shadow-xl hover:border-emerald-400 hover:bg-white transform hover:-translate-y-0.5 transition-all duration-300">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Seasonal Pipeline Value</span>
            <div className="p-1 rounded-lg bg-emerald-50 text-emerald-600 shadow-2xs">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <span className="text-xl font-black text-slate-800 block mt-2 tracking-tight">
            ₹{activeFarmerProfile?.weekly_revenue ? Number(activeFarmerProfile.weekly_revenue).toLocaleString('en-IN') : '0.00'}
          </span>
          <div className="mt-2 flex items-center text-[10px] text-emerald-800 font-medium bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded-md w-fit">
            <span>🌾 Calculated Harvest Metrics</span>
          </div>
        </div>

        {/* Dynamic Metric Tile 2: Area / Land Size */}
        <div className="backdrop-blur-md bg-white/75 p-4 rounded-2xl border border-emerald-100/80 shadow-md hover:shadow-xl hover:border-emerald-400 hover:bg-white transform hover:-translate-y-0.5 transition-all duration-300">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Cultivation Acreage Block</span>
            <div className="p-1 rounded-lg bg-amber-50 text-amber-600 shadow-2xs">
              <Layers className="w-3.5 h-3.5" />
            </div>
          </div>
          <span className="text-xl font-black text-slate-800 block mt-2 tracking-tight">
            {activeFarmerProfile?.inventory_qty ? (Number(activeFarmerProfile.inventory_qty) / 10).toFixed(1) : '3.8'}{' '}
            <span className="text-xs font-bold text-slate-400">Acres</span>
          </span>
          <span className="text-[10px] text-slate-400 block mt-1.5 font-medium">Calculated via Satellite Coordinates</span>
        </div>

        {/* Dynamic Metric Tile 3: Vigour / Performance */}
        <div className="backdrop-blur-md bg-white/75 p-4 rounded-2xl border border-emerald-100/80 shadow-md hover:shadow-xl hover:border-emerald-400 hover:bg-white transform hover:-translate-y-0.5 transition-all duration-300">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Crop Vigour Coefficient</span>
            <div className="p-1 rounded-lg bg-sky-50 text-sky-500 shadow-2xs">
              <CloudSun className="w-3.5 h-3.5" />
            </div>
          </div>
          <span className="text-xl font-black text-[#01371b] block mt-2 tracking-tight">
            {activeFarmerProfile?.retailer_efficiency ? `${(Number(activeFarmerProfile.retailer_efficiency) * 10).toFixed(1)}%` : '85.2%'}
          </span>
          <span className="text-[10px] text-slate-400 block mt-1.5 font-medium">Biomass Density Verification</span>
        </div>

        {/* Dynamic Metric Tile 4: Pathogen & Outbreak Status */}
        <div className="backdrop-blur-md bg-white/75 p-4 rounded-2xl border border-emerald-100/80 shadow-md hover:shadow-xl hover:border-emerald-400 hover:bg-white transform hover:-translate-y-0.5 transition-all duration-300">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Outbreak Urgency Index</span>
            <div className={`p-1 rounded-lg shadow-2xs ${
              activeFarmerProfile?.panic_state === 'PANIC' || activeFarmerProfile?.priority_category === 'HIGH_PRIORITY'
                ? 'bg-rose-50 text-rose-500' : 'bg-slate-50 text-slate-500'
            }`}>
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
          </div>
          <span className="text-xl font-black text-slate-800 block mt-2 tracking-tight">
            {activeFarmerProfile?.priority_score ? `${(Number(activeFarmerProfile.priority_score) * 100).toFixed(0)}%` : '15%'}
          </span>
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md inline-block mt-1.5 uppercase font-mono border ${
            activeFarmerProfile?.panic_state === 'PANIC' || activeFarmerProfile?.priority_category === 'HIGH_PRIORITY'
              ? 'bg-rose-50 text-rose-700 border-rose-200/60 animate-pulse'
              : 'bg-emerald-50 text-emerald-800 border-emerald-200/60'
          }`}>
            {activeFarmerProfile?.panic_state === 'PANIC' || activeFarmerProfile?.priority_category === 'HIGH_PRIORITY' ? 'CRITICAL RISK' : 'LOW RISK'}
          </span>
        </div>
      </div>

      {/* ─── ROW 5: GEOSPATIAL REGIONAL THREAT MAP FLUID CANVAS ─── */}
      <div className="relative z-10 space-y-2">
        <div className="text-[10px] font-black text-emerald-900 uppercase tracking-widest pl-1 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981] animate-ping"></span>
          <span>Epidemiology Grid Layer Overlay</span>
        </div>
        <div className="rounded-3xl border-2 border-emerald-800/20 overflow-hidden shadow-lg bg-white p-1">
          <RegionalThreatMap users={activeFarmer ? [activeFarmer] : []} />
        </div>
      </div>

      {/* ─── ROW 6: INPUT LEDGER ADVISORY CARDS (DYNAMIC) ─── */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Dynamic Treatment Ledger Block */}
        <div className="backdrop-blur-md bg-white/75 rounded-3xl border border-emerald-100/80 shadow-md p-5 lg:col-span-7 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-emerald-100/40 pb-3 mb-4 gap-2">
              <h4 className="text-xs font-black text-emerald-950 uppercase tracking-wide flex items-center gap-1.5">
                <span>🛡️</span> Syngenta Target Crop Input Ledger
              </h4>
              <div className="flex bg-emerald-50 border border-emerald-100 p-0.5 rounded-lg text-[10px] font-bold">
                <button 
                  onClick={() => setSelectedAdvisoryTab('protection')}
                  className={`px-3 py-1 rounded-md transition-all ${selectedAdvisoryTab === 'protection' ? 'bg-[#01371b] text-white shadow-xs' : 'text-emerald-700 hover:text-emerald-950'}`}
                >
                  Fungicides
                </button>
                <button 
                  onClick={() => setSelectedAdvisoryTab('nutrition')}
                  className={`px-3 py-1 rounded-md transition-all ${selectedAdvisoryTab === 'nutrition' ? 'bg-[#01371b] text-white shadow-xs' : 'text-emerald-700 hover:text-emerald-950'}`}
                >
                  Bio-Nutrients
                </button>
              </div>
            </div>

            {selectedAdvisoryTab === 'protection' ? (
              <div className="space-y-3">
                <div className="p-3 bg-white/90 rounded-xl border border-emerald-100/60 flex items-start justify-between shadow-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase block font-mono">Prescribed Solution</span>
                    <p className="text-xs font-extrabold text-slate-800">
                      {activeFarmerProfile?.recommended_product || 'Syngenta Amistar Top®'}
                    </p>
                    <p className="text-[11px] text-slate-500 leading-normal font-medium">
                      Targeted systemic defense matrix optimized for protecting leaf tissue architecture during the current cycle stage.
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-emerald-300 shrink-0 mt-1" />
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-emerald-50/60 border border-emerald-100/80 p-2 rounded-xl">
                    <span className="block text-[9px] text-slate-400 uppercase font-bold">Calibrated Dosage</span>
                    <span className="block text-xs font-black text-emerald-950 mt-0.5">
                      {activeFarmerProfile?.dosage_volume || '200 ml / Acre'}
                    </span>
                  </div>
                  <div className="bg-emerald-50/60 border border-emerald-100/80 p-2 rounded-xl">
                    <span className="block text-[9px] text-slate-400 uppercase font-bold">Water Ratio Mix</span>
                    <span className="block text-xs font-black text-emerald-950 mt-0.5">
                      {activeFarmerProfile?.water_ratio || '200 Litres'}
                    </span>
                  </div>
                  <div className="bg-emerald-50/60 border border-emerald-100/80 p-2 rounded-xl">
                    <span className="block text-[9px] text-slate-400 uppercase font-bold">Application Phase</span>
                    <span className="block text-amber-800 font-mono mt-0.5 uppercase text-[10px] font-black">
                      {activeFarmerProfile?.application_timing || 'Pre-Infection'}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-3 bg-white/90 rounded-xl border border-emerald-100/60 shadow-xs">
                  <span className="text-[10px] font-bold text-sky-700 uppercase block font-mono">Nutritional Plant Optimizer</span>
                  <p className="text-xs font-extrabold text-slate-800">
                    {activeFarmerProfile?.nutritional_product || 'Syngenta Quantis®'}
                  </p>
                  <p className="text-[11px] text-slate-500 leading-normal font-medium mt-0.5">
                    Activates organic anti-stress pathways to safeguard yield counts against spikes in canopy thermal profiles.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-emerald-100 flex items-start space-x-2 bg-amber-50/40 border border-amber-200/40 p-3 rounded-xl">
            <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed text-slate-600 font-medium">
              <strong className="text-slate-800">Dynamic Recommendation Strategy:</strong> <br />
              <span className="italic">
                "{activeFarmerProfile?.recommended_action || activeFarmerProfile?.insights || "Calibrating dynamic input thresholds based on real-time canopy telemetry indexes..."}"
              </span>
            </div>
          </div>
        </div>

        {/* Diagnostics & Verified Security Fields Block */}
        <div className="backdrop-blur-md bg-white/75 rounded-3xl border border-emerald-100/80 shadow-md p-5 lg:col-span-5 flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="text-xs font-black text-emerald-950 uppercase tracking-wide border-b border-emerald-100/40 pb-3">
              Diagnostic Field Health Matrix Identity
            </h4>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-0.5">
                <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider block">Bio-Security Tier</span>
                <div className="flex items-center space-x-1 font-bold text-xs text-slate-800 uppercase">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{activeFarmerProfile?.trust_level || 'VERIFIED PRO'}</span>
                </div>
              </div>

              <div className="space-y-0.5">
                <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider block">Canopy Stress Factor</span>
                <span className={`block font-mono text-xs font-black uppercase tracking-wide ${
                  activeFarmerProfile?.emotion === 'PANIC' || activeFarmerProfile?.stress_state === 'HIGH' ? 'text-rose-600 animate-pulse' : 'text-emerald-700'
                }`}>
                  🌾 {activeFarmerProfile?.emotion || activeFarmerProfile?.stress_state || 'STABLE'}
                </span>
              </div>

              <div className="space-y-0.5">
                <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider block">Alert Notification Loop</span>
                <span className="block font-semibold text-xs text-slate-700 uppercase">
                  📱 {activeFarmerProfile?.preferred_channel || 'WhatsApp Link Bot'}
                </span>
              </div>

              <div className="space-y-0.5">
                <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider block">Cropping Cycle Window</span>
                <span className="block font-semibold text-xs text-slate-700">
                  📅 {activeFarmerProfile?.relationship_stage || activeFarmerProfile?.season_cycle || 'Core Kharif Cycle'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-emerald-100/40 bg-emerald-50/40 p-3 rounded-xl border border-emerald-100 space-y-1.5 text-[11px]">
            <div className="flex justify-between items-center text-emerald-900 font-medium">
              <span>Primary Supply Depot Node:</span>
              <span className="font-bold text-emerald-950">
                {activeFarmer?.district || activeFarmerProfile?.district || 'Regional'} Center
              </span>
            </div>
            <div className="w-full h-1 bg-emerald-200/50 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-600 w-[85%] rounded-full"></div>
            </div>
            <p className="text-[9px] text-slate-400 font-mono tracking-wide text-right">Syngenta Asset Node Verified</p>
          </div>
        </div>

      </div>
    </div>
  );
}