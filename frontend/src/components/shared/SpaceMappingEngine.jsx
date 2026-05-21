import { useState } from 'react';
import { MapPin, Crosshair } from 'lucide-react';

export default function SpaceMappingEngine({ centralPin, plotMatrix = [] }) {
  const [activePin, setActivePin] = useState(centralPin || null);
  const elements = centralPin ? [centralPin] : plotMatrix;

  // Linear coordinate conversion algorithm standardizing subcontinent bounds to a localized bounding workspace canvas
  const computeGridPlacement = (lat, lng) => {
    const boundaries = { minLat: 8.0, maxLat: 36.0, minLng: 68.0, maxLng: 96.0 };

    const x = ((lng - boundaries.minLng) / (boundaries.maxLng - boundaries.minLng)) * 100;
    const y = 100 - (((lat - boundaries.minLat) / (boundaries.maxLat - boundaries.minLat)) * 100);

    return {
      left: `${Math.max(15, Math.min(x, 85))}%`,
      top: `${Math.max(15, Math.min(y, 85))}%`
    };
  };

  return (
    <div className="w-full h-full bg-[#11110e] relative flex items-center justify-center overflow-hidden">
      
      {/* Visual Topological Overlay Grid Lines */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(#2a7040 1px, transparent 1px)',
        backgroundSize: '32px 32px'
      }}></div>

      {/* Geopolitical Wireframe Contour Outlines */}
      <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M35 15 L52 10 L68 18 L60 42 L64 58 L52 86 L44 76 L38 52 Z" fill="none" stroke="#2a7040" strokeWidth="0.8" strokeDasharray="3 3" />
      </svg>

      {/* RENDER ACTIVE COORDINATE PLOTS */}
      <div className="absolute inset-0 w-full h-full">
        {elements.map((pin, i) => {
          const positionStyles = computeGridPlacement(pin.lat, pin.lng);

          return (
            <div
              key={pin.retailer_id || i}
              style={positionStyles}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group z-20"
            >
              <span className="absolute -inset-4 rounded-full bg-[#2a7040] opacity-25 animate-ping"></span>
              
              <button
                type="button"
                onClick={() => setActivePin(pin)}
                className="p-2 rounded-xl border bg-[#1a1208] text-[#2a7040] border-[#cfc4b0]/30 hover:border-[#2a7040] shadow-xl transition-all hover:scale-110 flex items-center justify-center"
              >
                <MapPin className="w-3.5 h-3.5" />
              </button>

              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-[#1a1208] text-[#ede7dc] text-[9px] font-mono px-2 py-1 rounded border border-[#cfc4b0]/20 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none font-bold">
                {pin.farmer_name} ({pin.retailer_id})
              </div>
            </div>
          );
        })}
      </div>

      {/* DATA SUMMARY CARD DETAIL POPUP INJECTION LAYOUT */}
      {activePin && (
        <div className="absolute bottom-4 left-4 right-4 md:right-auto bg-white p-4 rounded-xl border border-[#cfc4b0] shadow-2xl max-w-xs w-full text-left animate-slideUp z-50">
          <div className="flex justify-between items-start border-b border-[#ede7dc] pb-2 mb-2">
            <div>
              <span className="text-[9px] font-mono bg-[#d8f0e0] border border-[#2a7040]/30 text-[#164028] px-2 py-0.5 rounded font-bold">
                ANCHOR CORE: {activePin.state.toUpperCase()}
              </span>
              <h4 className="text-xs font-bold font-serif text-[#1a1208] mt-1">{activePin.farmer_name}</h4>
            </div>
            <button onClick={() => setActivePin(null)} className="text-neutral-300 hover:text-neutral-800 font-mono text-xs px-1">✕</button>
          </div>

          <div className="space-y-2 text-[11px]">
            <div className="bg-[#f6f1e9] p-2 rounded-lg border border-[#cfc4b0]/40 flex justify-between">
              <span className="text-neutral-400 font-medium">Primary Crop</span>
              <strong className="text-[#1a1208]">{activePin.crop}</strong>
            </div>
            <div className="bg-[#f6f1e9] p-2 rounded-lg border border-[#cfc4b0]/40 flex justify-between items-center">
              <div>
                <span className="block text-[8px] font-bold text-neutral-400 uppercase">Hardware Anchor Coordinates</span>
                <span className="font-mono text-[#2a7040] font-bold">{activePin.lat?.toFixed(4)}° N | {activePin.lng?.toFixed(4)}° E</span>
              </div>
              <Crosshair className="w-3.5 h-3.5 text-[#8a7860]" />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}