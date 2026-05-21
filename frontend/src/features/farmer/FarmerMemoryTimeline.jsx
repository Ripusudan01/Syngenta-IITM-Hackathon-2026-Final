// src/features/farmer/FarmerMemoryTimeline.jsx
import React from 'react';
import { History, Activity, AlertCircle, Sparkles } from 'lucide-react';

export default function FarmerMemoryTimeline({ memoryRecords = [] }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <div>
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
          <History className="w-4 h-4 text-slate-500" /> Farmer Memory Timeline Trace
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Historical sequence of ground truth parameters overriding satellite telemetry.
        </p>
      </div>

      {memoryRecords.length === 0 ? (
        <div className="p-6 text-center text-xs text-slate-400 font-bold border border-dashed rounded-xl">
          Empty chronological ledger trace. Log a field interaction block above.
        </div>
      ) : (
        <div className="relative border-l-2 border-slate-100 pl-4 ml-2 space-y-5">
          {memoryRecords.map((log, index) => {
            const isPanicState = log.sentiment === 'PANIC';
            const isAnxiousState = log.sentiment === 'ANXIOUS';

            return (
              <div key={index} className="relative group animate-slideIn">
                {/* Visual Timeline Marker Node Dot */}
                <div className={`absolute -left-[23px] top-1 w-2.5 h-2.5 rounded-full border-2 bg-white transition-all ${
                  isPanicState 
                    ? 'border-rose-500 shadow-sm ring-4 ring-rose-100' 
                    : isAnxiousState 
                    ? 'border-amber-500 ring-4 ring-amber-50' 
                    : 'border-emerald-600 ring-4 ring-emerald-50'
                }`} />

                {/* Log Content Metadata Block */}
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center justify-between text-[10px] gap-2">
                    <span className={`px-2 py-0.5 font-bold tracking-wide rounded font-mono uppercase ${
                      isPanicState 
                        ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                        : isAnxiousState
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                    }`}>
                      {log.interaction_type || "Field Log Operation"}
                    </span>
                    <span className="text-slate-400 font-mono font-bold tracking-tight">
                      {log.date}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 font-medium leading-relaxed bg-slate-50/60 group-hover:bg-slate-50 p-3 rounded-xl border border-slate-100 transition-colors">
                    {log.notes}
                  </p>

                  {/* Micro Feedback Footer Flags */}
                  <div className="flex items-center space-x-2 text-[9px] font-bold uppercase tracking-wider text-slate-400 pl-1">
                    <span>Sentiment Vector:</span>
                    <span className={isPanicState ? 'text-rose-600 font-black' : isAnxiousState ? 'text-amber-600 font-black' : 'text-emerald-700 font-black'}>
                      {log.sentiment || 'STABLE'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}