// import React from 'react';

// export default function SeasonArcTracker() {
//   const developmentalEpochs = [
//     { name: "Sowing & Nursery", timeline: "Weeks 1-3", state: "past" },
//     { name: "Vegetative Vigor", timeline: "Weeks 4-8", state: "current" },
//     { name: "Flowering Window", timeline: "Weeks 9-12", state: "future" },
//     { name: "Yield Extraction", timeline: "Weeks 13-16", state: "future" }
//   ];

//   return (
//     <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
//       <div className="flex justify-between items-center mb-4">
//         <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">🌾 Active Seasonal Arc Sequence</h4>
//         <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 px-2 py-0.5 rounded">Day 42 of Phase Matrix</span>
//       </div>
//       <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
//         {developmentalEpochs.map((epoch, i) => (
//           <div 
//             key={i} 
//             className={`p-3 rounded-xl border transition-all ${
//               epoch.state === 'current' 
//                 ? 'bg-emerald-50/60 border-emerald-500/40 shadow-xs ring-1 ring-emerald-500/10' 
//                 : epoch.state === 'past' 
//                 ? 'bg-slate-50/70 border-slate-200/60 opacity-60' 
//                 : 'bg-white border-dashed border-slate-200/80'
//             }`}
//           >
//             <div className="flex justify-between text-[9px] font-mono tracking-tight">
//               <span className={epoch.state === 'current' ? 'text-emerald-700 font-bold' : 'text-slate-400'}>Phase 0{i+1}</span>
//               <span className="text-slate-400">{epoch.timeline}</span>
//             </div>
//             <p className="text-xs font-bold text-slate-800 mt-1">{epoch.name}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
// src/features/farmer/SeasonArcTracker.jsx
import React from 'react';
import { Sprout, CheckCircle2 } from 'lucide-react';
import { getRegionalContext } from '../../config/indiaRegionalContext';

export default function SeasonArcTracker({ currentStage, stateLocation }) {
  // 1. Fetch exact geographic seasonal lifecycle parameters dynamically
  // const regionalConfig = getRegionalContext(stateLocation);
  const regionalConfig = getRegionalContext('maharashtra');
  const stages = regionalConfig.seasons;
  const labels = regionalConfig.uiLabels;
  
  const normalizedStage = currentStage || stages[1];
  const activeIndex = stages.findIndex(s => s.toLowerCase() === normalizedStage.toLowerCase());
  const safeIndex = activeIndex !== -1 ? activeIndex : 1; 

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <div className="space-y-0.5">
          <span className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider">
            Territory Crop Lifecycle ({stateLocation || "All-India Axis"})
          </span>
          <h3 className="text-sm font-bold text-slate-900">
            {labels.currentStage}: <span className="text-[#2563EB] font-extrabold">{normalizedStage}</span>
          </h3>
        </div>
        <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-xl flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide">
          <Sprout className="w-3.5 h-3.5 text-emerald-600" /> Live Arc
        </div>
      </div>

      {/* Dynamic Progress Timeline Bar Track */}
      <div className="relative pt-4 pb-2 px-1">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-100 -translate-y-1/2 rounded-full z-0" />
        <div 
          className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-emerald-500 to-[#2563EB] -translate-y-1/2 rounded-full z-0 transition-all duration-500"
          style={{ width: `${(safeIndex / (stages.length - 1)) * 100}%` }}
        />

        <div className="relative flex justify-between z-10">
          {stages.map((saStage, idx) => {
            const isCompleted = idx < safeIndex;
            const isActive = idx === safeIndex;

            return (
              <div key={saStage} className="flex flex-col items-center">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 border-2 text-xs font-bold ${
                  isCompleted ? 'bg-emerald-500 border-emerald-500 text-white' :
                  isActive ? 'bg-white border-[#2563EB] text-[#2563EB] shadow-md scale-110' :
                  'bg-white border-slate-200 text-slate-400'
                }`}>
                  {isCompleted ? <CheckCircle2 className="w-4 h-4 text-white stroke-[3]" /> : idx + 1}
                </div>
                <span className={`text-[10px] font-bold mt-2 tracking-tight max-w-[80px] text-center ${isActive ? 'text-slate-800 font-black' : 'text-slate-400'}`}>
                  {saStage}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}