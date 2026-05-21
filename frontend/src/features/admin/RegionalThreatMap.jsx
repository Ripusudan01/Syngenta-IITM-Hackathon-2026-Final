import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import {
    Map,
    ShieldAlert,
    Activity,
    ShieldCheck,
    AlertTriangle,
    Crosshair,
    ArrowUpRight,
    Search,
    MapPin,
    SlidersHorizontal
} from 'lucide-react';
import axios from 'axios';

import 'leaflet/dist/leaflet.css';

// Fix default Leaflet marker assets breaking in modern bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Refined Dynamic Marker color palette to match High/Medium/Low designations
const createCustomMarker = (riskLevel, isSelected) => {
    let markerColor = '#10B981'; // Low Risk (Green)
    let pulseColor = 'rgba(16, 185, 129, 0.4)';

    if (riskLevel === 'HIGH') {
        markerColor = '#F43F5E'; // High Risk (Rose/Red)
        pulseColor = 'rgba(244, 63,  Rose, 0.4)';
    } else if (riskLevel === 'MEDIUM') {
        markerColor = '#F59E0B'; // Medium Risk (Amber/Orange)
        pulseColor = 'rgba(245, 158, 11, 0.4)';
    }

    return L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
      <div style="position: relative; display: flex; align-items: center; justify-content: center;">
        <span style="position: absolute; width: 28px; height: 28px; border-radius: 50%; background: ${pulseColor}; animation: ping 1.4s infinite; z-index: 1;"></span>
        <div style="
          width: ${isSelected ? '16px' : '12px'}; 
          height: ${isSelected ? '16px' : '12px'}; 
          border-radius: 50%; 
          background: ${markerColor}; 
          border: 2.5px solid #FFFFFF; 
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.35);
          z-index: 2;
          transform: scale(${isSelected ? '1.3' : '1'});
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        "></div>
      </div>
    `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
    });
};

function ChangeMapView({ center, zoom = 7 }) {
    const map = useMap();
    useEffect(() => {
        if (center && center[0] && center[1]) {
            map.setView(center, zoom, { animate: true, duration: 1.2 });
        }
    }, [center, zoom, map]);
    return null;
}

export default function RegionalThreatMap({ users = [] }) {
    const safeUsers = Array.isArray(users) ? users : [];

    const [coordinatesCache, setCoordinatesCache] = useState({});
    const [isGeocoding, setIsGeocoding] = useState(false);
    const [selectedNode, setSelectedNode] = useState(null);

    // Core Filter State Engine: "ALL" | "HIGH" | "MEDIUM" | "LOW"
    const [riskFilter, setRiskFilter] = useState('ALL');
    const [cityRiskData, setCityRiskData] = useState([]);
    const [cityRiskLoading, setCityRiskLoading] = useState(false);
    const mapRef = useRef(null);

    const cleanLocationName = (name) => {
        if (!name) return '';
        return name.split('_')[0];
    };

    // Helper to calculate risk context on incoming raw dataset records
    const calculateRiskLevel = (user) => {
        if (user.panic_state === 'PANIC' || user.urgency_category === 'CRITICAL') {
            return 'HIGH';
        }
        // Fallback checks against trust scores or optional custom metrics
        if (user.dynamic_trust_score && user.dynamic_trust_score < 0.75) {
            return 'MEDIUM';
        }
        return 'LOW';
    };

    // Parse, normalize, and inject calculated matrix risks to objects
    const mapNodes = cityRiskData.map((city, index) => {

        const lookupKey = city.district;

        const cachedCoord = coordinatesCache[lookupKey];

        const resolvedCoords =
            cachedCoord
                ? [cachedCoord.lat, cachedCoord.lng]
                : null;

        return {
            id: index + 1,
            district: city.district,
            farmer_name: `${city.total_farmers} Farmers`,
            total_farmers: city.total_farmers,
            anxious_farmers: city.anxious_farmers,
            panic_farmers: city.panic_farmers,
            risk_score: city.risk_score,
            calculatedRisk: city.risk_level,
            coordinates: resolvedCoords
        };
    });

    // Filtering Pipeline Execution Block
    const visibleNodes = mapNodes.filter(n => {
        const hasCoords = Array.isArray(n.coordinates) && n.coordinates[0];
        if (!hasCoords) return false;
        if (riskFilter === 'ALL') return true;
        return n.calculatedRisk === riskFilter;
    });

    const defaultIndiaCenter = [20.5937, 78.9629];

    // Aggregation matrices counters for badge headers
    const countByRisk = (level) => mapNodes.filter(n => n.coordinates && n.calculatedRisk === level).length;

    // Nominatim Geocoding Pipeline
useEffect(() => {

    const fetchMissingCoordinates = async () => {

        const targetsToGeocode = cityRiskData.filter(
            city =>
                city &&
                city.district &&
                !coordinatesCache[city.district]
        );

        if (targetsToGeocode.length === 0) return;

        setIsGeocoding(true);

        const updatedCache = { ...coordinatesCache };

        for (const city of targetsToGeocode) {

            try {

                const districtString = city.district;

                // LOCAL STORAGE CACHE
                const savedCoord = localStorage.getItem(
                    `geo_${districtString}`
                );

                if (savedCoord) {

                    updatedCache[districtString] =
                        JSON.parse(savedCoord);

                    continue;
                }

                const searchString = encodeURIComponent(
                    `${districtString}, India`
                );

                // CORS PROXY
                const url =
                    `https://corsproxy.io/?` +
                    `https://nominatim.openstreetmap.org/search?format=json&q=${searchString}&limit=1`;

                const response = await axios.get(url);

                const data = response.data;

                if (data && data.length > 0) {

                    const coord = {
                        lat: parseFloat(data[0].lat),
                        lng: parseFloat(data[0].lon)
                    };

                    updatedCache[districtString] = coord;

                    // SAVE CACHE
                    localStorage.setItem(
                        `geo_${districtString}`,
                        JSON.stringify(coord)
                    );
                }

                // RATE LIMIT SAFETY
                await new Promise(resolve =>
                    setTimeout(resolve, 700)
                );

            } catch (error) {

                console.error(
                    'Geocoding failed:',
                    city.district,
                    error
                );
            }
        }

        setCoordinatesCache(updatedCache);

        setIsGeocoding(false);
    };

    if (cityRiskData.length > 0) {
        fetchMissingCoordinates();
    }

}, [cityRiskData]);

    useEffect(() => {

        async function fetchCityRiskSummary() {

            try {

                setCityRiskLoading(true);

                const response = await fetch(
                    'http://localhost:8000/city-risk-summary'
                );

                const data = await response.json();

                if (data?.city_risk_summary) {
                    setCityRiskData(data.city_risk_summary);
                }

            } catch (err) {

                console.error(
                    'City risk summary fetch failed:',
                    err
                );

            } finally {

                setCityRiskLoading(false);
            }
        }

        fetchCityRiskSummary();

    }, []);
    // Track selections and adjust when current filter context shifts nodes
    useEffect(() => {
        if (visibleNodes.length > 0) {
            const isStillVisible = visibleNodes.some(n => n.id === selectedNode?.id);
            if (!isStillVisible) {
                setSelectedNode(visibleNodes[0]);
            }
        } else {
            setSelectedNode(null);
        }
    }, [riskFilter, users]);

    useEffect(() => {

        const timer = setTimeout(() => {

            if (mapRef.current) {
                mapRef.current.invalidateSize();
            }

        }, 300);

        return () => clearTimeout(timer);

    }, [selectedNode, riskFilter, visibleNodes]);

    return (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-3 transition-all duration-300">

            {/* LEFT & CENTER INTERACTIVE MAP VIEW CONTROLLER */}
            <div className="lg:col-span-2 p-7 bg-linear-to-b from-slate-50/70 to-white border-r border-slate-100 flex flex-col space-y-5">

                {/* HEAD REBOON AREA WITH TITLE AND TELEMETRY PROGRESS METRICS */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                    <div className="space-y-1">
                        <h3 className="text-xs font-black text-[#041E42] tracking-widest uppercase flex items-center gap-2">
                            <span className="p-1.5 bg-emerald-50 text-[#00875A] rounded-xl"><Map className="w-3.5 h-3.5" /></span>
                            Geospatial Telemetry Grid
                        </h3>
                    </div>

                    {isGeocoding && (
                        <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-mono animate-pulse">
                            <Search className="w-3 h-3 animate-spin" /> Resolving Zones...
                        </div>
                    )}
                </div>

                {/* THE MANDATORY RISK STRATIFICATION INTERACTIVE FILTER RAIL */}
                <div className="bg-slate-100/80 border border-slate-200/40 rounded-2xl p-2 flex flex-wrap items-center gap-2 shadow-inner">
                    <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-mono font-bold uppercase px-2">
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                        Risk Layer:
                    </div>

                    {[
                        { id: 'ALL', label: 'All Sectors', count: mapNodes.filter(n => n.coordinates).length, color: 'bg-slate-200 text-slate-700' },
                        { id: 'HIGH', label: 'High Risk', count: countByRisk('HIGH'), color: 'bg-rose-500 text-white shadow-rose-100' },
                        { id: 'MEDIUM', label: 'Medium Risk', count: countByRisk('MEDIUM'), color: 'bg-amber-500 text-white shadow-amber-100' },
                        { id: 'LOW', label: 'Low Risk', count: countByRisk('LOW'), color: 'bg-emerald-500 text-white shadow-emerald-100' }
                    ].map((btn) => {
                        const isActive = riskFilter === btn.id;
                        return (
                            <button
                                key={btn.id}
                                onClick={() => setRiskFilter(btn.id)}
                                className={`text-[11px] font-bold px-3.5 py-1.5 rounded-xl transition-all duration-200 flex items-center gap-2 cursor-pointer ${isActive
                                    ? `${btn.color} shadow-md font-extrabold scale-[1.02]`
                                    : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200/60'
                                    }`}
                            >
                                <span>{btn.label}</span>
                                <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-mono ${isActive ? 'bg-black/10 text-current' : 'bg-slate-100 text-slate-500'}`}>
                                    {btn.count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* MAP GRID SCREEN OVERLAY FRAME */}
                <div className="h-88 w-full rounded-2xl border border-slate-200/60 shadow-xl overflow-hidden relative z-10 group">
                    <MapContainer
                        center={defaultIndiaCenter}
                        ref={mapRef}
                        zoom={5}
                        scrollWheelZoom={true}
                        zoomControl={false}
                        style={{ height: '100%', width: '100%' }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />

                        {visibleNodes.map((farmer) => {
                            const isSelected = selectedNode?.id === farmer.id;

                            return (
                                <Marker
                                    key={farmer.id || Math.random().toString()}
                                    position={farmer.coordinates}
                                    icon={createCustomMarker(farmer.calculatedRisk, isSelected)}
                                    eventHandlers={{
                                        click: () => setSelectedNode(farmer),
                                    }}
                                >
                                    <Popup className="custom-leaflet-popup">
                                        <div className="p-2 min-w-[150px] font-sans space-y-1">
                                            <div className="font-extrabold text-slate-900 text-xs tracking-tight flex items-center gap-1">
                                                <MapPin className="w-3 h-3 text-slate-600" />
                                                {cleanLocationName(farmer.tehsil) || farmer.district} Core
                                            </div>
                                            <div className="text-[10px] text-slate-500 font-medium">District: {farmer.district}</div>
                                            <div className="text-[10px] text-slate-500 font-medium">Cultivator: {farmer.farmer_name}</div>
                                            <div className="pt-1 flex items-center justify-between border-t border-slate-100 mt-1">
                                                <span className={`text-[9px] font-black tracking-wide uppercase px-1.5 py-0.5 rounded ${farmer.calculatedRisk === 'HIGH' ? 'bg-rose-50 text-rose-600' : farmer.calculatedRisk === 'MEDIUM' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                                                    }`}>
                                                    {farmer.calculatedRisk} RISK
                                                </span>
                                            </div>
                                        </div>
                                    </Popup>
                                </Marker>
                            );
                        })}

                        <ChangeMapView center={selectedNode?.coordinates} zoom={selectedNode ? 9 : 5} />
                    </MapContainer>

                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-2 rounded-xl shadow-lg border border-slate-200/50 pointer-events-none z-50">
                        <Crosshair className="w-3.5 h-3.5 text-slate-600" />
                    </div>
                </div>

                {/* LOWER QUICK SELECTION CHIPS RAIL */}
                <div className="flex flex-wrap gap-1.5 bg-slate-100/60 p-1.5 rounded-2xl border border-slate-200/30">
                    {visibleNodes.length === 0 ? (
                        <div className="text-slate-400 text-[11px] px-3.5 py-2 italic font-sans font-medium">
                            No zones match this risk layer query parameter.
                        </div>
                    ) : (
                        visibleNodes.map((farmer) => {
                            const isSelected = selectedNode?.id === farmer.id;
                            const dotColor = farmer.calculatedRisk === 'HIGH' ? 'bg-rose-500' : farmer.calculatedRisk === 'MEDIUM' ? 'bg-amber-500' : 'bg-emerald-500';

                            return (
                                <button
                                    key={farmer.id}
                                    onClick={() => setSelectedNode(farmer)}
                                    className={`text-[11px] font-bold px-3.5 py-2 rounded-xl transition-all duration-200 flex items-center gap-2 ${isSelected
                                        ? 'bg-white text-[#041E42] shadow-sm font-extrabold border border-slate-200/60'
                                        : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'
                                        }`}
                                >
                                    <span className={`h-1.5 w-1.5 rounded-full ${dotColor} ${farmer.calculatedRisk === 'HIGH' ? 'animate-pulse' : ''}`}></span>
                                    {cleanLocationName(farmer.tehsil) || farmer.district}
                                </button>
                            );
                        })
                    )}
                </div>
            </div>

            {/* RIGHT SIDE PANEL SIDEBAR — TELEMETRY AND INTELLIGENCE */}
            <div className="p-7 bg-white flex flex-col justify-between space-y-6">
                {selectedNode ? (
                    <div className="space-y-5 animate-fadeIn">
                        <div className="space-y-1">
                            <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase block leading-none">
                                Target Node Telemetry Analysis
                            </span>
                            <h4 className="text-lg font-black text-[#041E42] tracking-tight mt-1 leading-tight flex items-center gap-1.5">
                                {cleanLocationName(selectedNode.tehsil) || selectedNode.district} Workspace <ArrowUpRight className="w-4 h-4 text-slate-300" />
                            </h4>
                            <div className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-100 rounded-lg px-2 py-0.5 mt-1 font-mono text-[10px] text-slate-500">
                                <span>GPS Vector:</span>
                                <span className="font-bold text-slate-700">
                                    {selectedNode.coordinates ? selectedNode.coordinates.map(c => c.toFixed(4)).join(', ') : 'Resolving Pin...'}
                                </span>
                            </div>
                        </div>

                        <hr className="border-slate-100/80" />

                        <div className={`p-4 rounded-2xl border transition-colors duration-300 ${selectedNode.calculatedRisk === 'HIGH'
                            ? 'bg-rose-50/40 border-rose-100/70 text-rose-900'
                            : selectedNode.calculatedRisk === 'MEDIUM'
                                ? 'bg-amber-50/40 border-amber-100/70 text-amber-900'
                                : 'bg-emerald-50/30 border-emerald-100/50 text-slate-900'
                            }`}>
                            <div className="flex items-center gap-2">
                                {selectedNode.calculatedRisk === 'HIGH' ? (
                                    <div className="p-1 bg-rose-500 text-white rounded-lg"><ShieldAlert className="w-3.5 h-3.5" /></div>
                                ) : selectedNode.calculatedRisk === 'MEDIUM' ? (
                                    <div className="p-1 bg-amber-500 text-white rounded-lg"><AlertTriangle className="w-3.5 h-3.5" /></div>
                                ) : (
                                    <div className="p-1 bg-emerald-500 text-white rounded-lg"><ShieldCheck className="w-3.5 h-3.5" /></div>
                                )}
                                <span className="text-[11px] font-black uppercase tracking-wider font-mono">
                                    Threat Analysis Classification
                                </span>
                            </div>
                            <p className="text-[11px] font-medium text-slate-500 mt-2.5 leading-relaxed">
                                {selectedNode.calculatedRisk === 'HIGH'
                                    ? 'Critical threshold breached. Ecosystem impacted by acute agronomic warnings or localized panic signatures.'
                                    : selectedNode.calculatedRisk === 'MEDIUM'
                                        ? 'Moderate operational deviations noticed. Performance indexing shows warning variances across target indicators.'
                                        : 'Agronomic parameters operate perfectly within secure normal limits.'}
                            </p>
                        </div>

                        <div className="space-y-1.5">
                            {[
                                { label: 'Assigned Cultivator', value: selectedNode.farmer_name || 'N/A', highlight: false },
                                { label: 'Home City / Tehsil', value: cleanLocationName(selectedNode.tehsil) || 'N/A', highlight: true },
                                { label: 'Parent District', value: selectedNode.district || 'N/A', highlight: false },
                                { label: 'State Territory', value: selectedNode.state_location || selectedNode.state || 'N/A', highlight: false },
                                { label: 'Threat Node Status', value: `${selectedNode.calculatedRisk} RISK LEVEL`, highlight: false }
                            ].map((row, index) => (
                                <div key={index} className="flex justify-between items-center text-xs p-3 bg-slate-50/50 rounded-xl border border-slate-100/70 font-sans">
                                    <span className="text-slate-400 font-semibold">{row.label}</span>
                                    <span className={`font-bold font-mono tracking-tight ${row.highlight ? 'text-emerald-600 uppercase text-[11px]' : 'text-slate-800'}`}>
                                        {row.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6 border-2 border-dashed rounded-2xl border-slate-100">
                        <Activity className="w-5 h-5 text-slate-300 animate-pulse mb-2" />
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">No Target Node Selected</span>
                    </div>
                )}
            </div>
        </div>
    );
}