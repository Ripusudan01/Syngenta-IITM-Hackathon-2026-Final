import { useState } from 'react';
import { Shovel, HelpCircle, Activity, Globe, Database, ArrowRight } from 'lucide-react';

export default function EntryGateway({ onAuthenticate, dataMatrix }) {
  const [targetId, setTargetId] = useState('RET-TN-901');
  const [accessRole, setAccessRole] = useState('farmer');

  const handleFormActionSubmit = (e) => {
    e.preventDefault();
    if (!targetId.trim()) return;
    onAuthenticate(targetId.trim(), accessRole);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-12">
      <div className="bg-white rounded-3xl shadow-2xl border border-[#cfc4b0] max-w-5xl w-full overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-150">
        
        {/* SIDE PANELS: Live API Documentation & Engine States */}
        <div className="md:col-span-5 bg-[#1a1208] text-white p-8 flex flex-col justify-between relative text-left">
          <div className="space-y-6 relative z-10">
            <div className="flex items-center space-x-2.5">
              <div className="bg-[#2a7040] text-white p-2 rounded-xl shadow-md">
                <Shovel className="w-4 h-4" />
              </div>
              <span className="font-mono font-bold text-xs tracking-widest text-[#ede7dc]">VAANI SECURITY MATRIX</span>
            </div>

            <div className="space-y-2">
              <span className="text-[9px] font-mono bg-[#2a7040]/30 text-[#d8f0e0] border border-[#2a7040]/40 px-2 py-0.5 rounded uppercase">
                RBAC Core Interface Enabled
              </span>
              <h2 className="text-2xl font-normal font-serif text-[#f6f1e9] leading-snug">
                Sub-continent Agricultural Spatial Telemetry Workspace
              </h2>
            </div>
          </div>

          {/* Simulated Live Backend Handshake Logs */}
          <div className="space-y-2 border-t border-[#ede7dc]/10 pt-6 font-mono text-[11px] text-[#8a7860]">
            <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
              <span className="flex items-center gap-1.5"><Database className="w-3.5 h-3.5 text-[#2a7040]" /> FastAPI Endpoints:</span>
              <span className="text-[#ede7dc] font-bold">Authenticated</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
              <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-[#2a7040]" /> ChromaDB Vector:</span>
              <span className="text-[#2a7040] font-bold">ONLINE</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
              <span className="flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 text-[#2a7040]" /> RandomForest:</span>
              <span className="text-[#ede7dc] font-bold">Predictive Ready</span>
            </div>
          </div>
        </div>

        {/* MAIN PANEL: Form Operations & Quick Select Matrix */}
        <div className="md:col-span-7 p-8 md:p-12 flex flex-col justify-between bg-white text-left space-y-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold font-serif text-[#1a1208]">Gateway Session Handshake</h3>
            <p className="text-xs text-[#8a7860]">Select target functional tier profile to mount workspace properties.</p>

            {/* Explicit Role Picker */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              {[
                { type: 'farmer', title: 'Cultivator Node' },
                { type: 'admin', title: 'Macro Controller' }
              ].map((r) => (
                <button
                  key={r.type}
                  type="button"
                  onClick={() => setAccessRole(r.type)}
                  className={`p-3 text-xs font-bold font-mono border text-center rounded-xl transition-all ${
                    accessRole === r.type 
                      ? 'border-[#2a7040] bg-[#d8f0e0]/40 text-[#2a7040]' 
                      : 'border-[#cfc4b0] bg-[#f6f1e9]/30 text-[#8a7860]'
                  }`}
                >
                  {r.title}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleFormActionSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-mono font-bold text-[#8a7860] uppercase tracking-wider mb-1.5">
                Target Node Parameter ID (`retailer_id`)
              </label>
              <input
                type="text"
                value={targetId}
                onChange={e => setTargetId(e.target.value)}
                placeholder="e.g. RET-TN-901"
                className="w-full text-xs p-3 font-mono bg-[#f6f1e9]/60 border border-[#cfc4b0] rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#2a7040]"
              />
            </div>

            {/* QUICK SELECTION DATA MATRIX DIRECTORY TABLE */}
            <div className="bg-[#f6f1e9] border border-[#cfc4b0]/70 rounded-xl p-3 space-y-2">
              <span className="text-[9px] font-mono font-bold text-[#8a7860] uppercase block">
                Available Mock Profiles inside Backend Schema:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 font-mono text-[10px]">
                {dataMatrix.map(item => (
                  <button
                    key={item.retailer_id}
                    type="button"
                    onClick={() => setTargetId(item.retailer_id)}
                    className="p-1.5 bg-white border border-[#cfc4b0]/40 rounded-lg text-left hover:border-[#2a7040] transition-all flex justify-between items-center group"
                  >
                    <div>
                      <span className="font-bold text-[#2a7040] block group-hover:underline">{item.retailer_id}</span>
                      <span className="text-slate-400 text-[9px]">{item.farmer_name} ({item.state})</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </form>

          <div className="pt-4 border-t border-[#ede7dc] flex items-center justify-between text-xs">
            <span className="text-[11px] text-[#8a7860] flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-[#2a7040]" /> Session matches dynamic Pandas frames.
            </span>
            <button
              onClick={handleFormActionSubmit}
              className="px-5 py-2.5 bg-[#2a7040] hover:bg-[#164028] text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <span>Mount Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}