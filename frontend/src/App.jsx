import { useState, useEffect } from 'react';
import apiClient from './api/client';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { RETAILERS_DATABASE } from './data/retailersList';
// import RegionalThreatMap from './features/admin/RegionalThreatMap';
import FarmerDashboard from './features/farmer/FarmerDashboard';
// Import Feature View Modules
import LandingPage from './features/marketing/LandingPage';
import AdminDashboard from './features/admin/AdminDashboard';
import FarmerInsights from './features/farmer/FarmerInsights';
import UserManagement from './features/admin/UserManagement';
import Inventory from './features/admin/Inventory';
import FarmerChatConsole from './features/farmer/FarmerChatConsole';

// Icons Asset Library
import {
  Layers, ShieldAlert, Store, Users, Database, MapPin, LogOut, Tractor, ShoppingBag, TrendingUp, Sparkles
} from 'lucide-react';

export default function App() {
  // 1. Core Authentication & Global Context Hooks
  const { user, switchRole } = useAuth();
  const [viewMode, setViewMode] = useState('landing');
  const [activeTab, setActiveTab] = useState('admin');
  const [activeSubView, setActiveSubView] = useState('field-operations');
  const [loading, setLoading] = useState(false);
  const [dashboardMetrics, setDashboardMetrics] = useState(null);
  const [inventory, setInventory] = useState([]);

  // ─── VAANI V4 NATION-WIDE TESTING MATRICES (UPGRADED WITH RETAILER IDENTIFIERS) ───
  const [users, setUsers] = useState([
    {
      id: "USR_TN_001",
      farmer_name: "Anbu Selvan",
      retailer_id: "RET-TN-042", // Connected to Salem/Thanjavur localized server node
      state_location: "Tamil Nadu",
      district: "Thanjavur",
      coordinates: [10.7870, 79.1378],
      preferred_channel: "WhatsApp Core",
      season_stage: "Panicle Initiation",
      strategy: "உங்கள் பகுதியில் நிலவும் அதிக ஈரப்பदम காரணமாக குலைநோய் தாக்குதல் ஏற்பட வாய்ப்புள்ளது. முன்னெச்சரிக்கையாக பரிந்துரைக்கப்பட்ட பூஞ்சாணக்கொல்லியை தெளிக்கவும்.",
      panic_state: "STABLE",
      urgency_category: "MODERATE",
      dynamic_trust_score: 0.88,
      field_representative: { name: "R. Kumar", phone: "+91 98765 43210" },
      history: [
        { date: "18 May 2026", interaction_type: "Routine Crop Audit", sentiment: "STABLE", notes: "Crop growth stable. Discussed scheduled deployment of preventative fungicides." }
      ]
    },
    {
      id: "USR_PB_002",
      farmer_name: "Baldev Singh",
      retailer_id: "RET-PB-099", // Connected to Punjab dynamic logistics gateway
      state_location: "Punjab",
      district: "Bathinda",
      coordinates: [30.2110, 74.9454],
      preferred_channel: "SMS Gateway",
      season_stage: "ਵਾਨਸਪਤੀ ਵਾਧਾ",
      strategy: "ਨਾਈਟ੍ਰੋਜਨ ਦੀ ਦੂਜੀ ਖੁਰਾਕ ਪਾਓ ਅਤੇ ਨਹਿਰੀ ਪਾਣੀ ਦੇ ਉਪਲਬਧ ਸ਼ੈਡਿਊਲ ਦੀ ਵਰਤੋਂ ਕਰੋ।",
      panic_state: "STABLE",
      urgency_category: "LOW",
      dynamic_trust_score: 0.94,
      field_representative: { name: "H. Singh", phone: "+91 94170 12345" },
      history: [
        { date: "12 May 2026", interaction_type: "Routine Crop Audit", sentiment: "STABLE", notes: "Crop status monitored on field. Shared digital canal irrigation scheduling roster." }
      ]
    },
    {
      id: "USR_MH_003",
      farmer_name: "Sanjay Patil",
      retailer_id: "RET-MH-512", // Connected to Maharashtra emergency depot grid
      state_location: "Maharashtra",
      district: "Nashik",
      coordinates: [19.9975, 73.7898],
      preferred_channel: "Voice Call Bot",
      season_stage: "शाकीय वाढ (Vegetative)",
      strategy: "कृपया पिकावरील कीड नियंत्रणासाठी तात्काळ फवारणीचे नियोजन करावे. जास्त पाऊस होण्याची शक्यता आहे.",
      panic_state: "PANIC",
      urgency_category: "CRITICAL",
      dynamic_trust_score: 0.65,
      field_representative: { name: "V. Shinde", phone: "+91 95520 98765" },
      history: [
        { date: "15 May 2026", interaction_type: "Pest Threat Assessment", sentiment: "PANIC", notes: "Severe infestation flagged. Farmer requested immediate emergency supply allocation." }
      ]
    }
  ]);

  // State pointer initialized randomly targeting the user array matrix on startup
  const [selectedFarmerIndex, setSelectedFarmerIndex] = useState(() => {
    return Math.floor(Math.random() * 3); // Fits the local baseline of 3 mock users
  });

  // Master fallback backup randomized structure selected straight from the 4000 database asset
  const [randomDatabaseRetailer] = useState(() => {
    const randomIndex = Math.floor(Math.random() * RETAILERS_DATABASE.length);
    const chosenRetailer = RETAILERS_DATABASE[randomIndex];
    return {
      id: `USR_DB_${chosenRetailer.retailer_id}`,
      retailer_id: chosenRetailer.retailer_id,
      territory_id: chosenRetailer.territory_id,
      district: chosenRetailer.district,
      state_location: chosenRetailer.state,
      farmer_name: `Lead Cultivator (${chosenRetailer.tehsil.split('_')[0]})`,
      panic_state: "STABLE",
      preferred_channel: "Direct Link Data Routing"
    };
  });

  // CRITICAL FIX: Derives the unified selection object cleanly without name conflicts
  // Fallback maps to the unique database selection if the local state matrix index becomes invalid
  const activeFarmer = users[selectedFarmerIndex] || randomDatabaseRetailer;

  // Network engine syncing side-effect hook
  useEffect(() => {
    if (viewMode === 'app' && apiClient.defaults.baseURL) {
      setLoading(true);
      Promise.all([
        apiClient.get('/critical-farmers').catch(() => null),
        apiClient.get('/llm-summary').catch(() => null),
        apiClient.get('/trust-summary').catch(() => null)
      ])
        .then(([farmersRes, summaryRes, trustRes]) => {
          if (farmersRes?.data) setUsers(farmersRes.data);
          setDashboardMetrics({
            ...(summaryRes?.data || {}),
            ...(trustRes?.data || {})
          });
          setLoading(false);
        })
        .catch(err => {
          console.warn("API fallbacks active; utilizing local Vaani V4 state data array.", err);
          setLoading(false);
        });
    }
  }, [viewMode]);

  // ─── VAANI V4 RELATIONSHIP INTELLIGENCE RUNTIME STATE PERSISTENCE ───
  const handleUpdateFarmerMemory = (farmerId, newLogBlock) => {
    setUsers((prevList) =>
      prevList.map((item) => {
        if (item.id !== farmerId) return item;

        const safeHistory = item.history || [];

        return {
          ...item,
          panic_state: newLogBlock.sentiment,
          urgency_category: newLogBlock.sentiment === 'PANIC' ? 'CRITICAL' : item.urgency_category,
          history: [newLogBlock, ...safeHistory]
        };
      })
    );
  };

  // 2. Define Sidebar Navigation Schema for each Header Tab
  const sidebarNavigationSchema = {
    admin: [
      { id: 'field-operations', label: 'Field Operations', icon: Layers },
      { id: 'user-management', label: 'Retailer Network', icon: Users },
      { id: 'inventory', label: 'Inventory Systems', icon: Database }
    ],
    farmer: [
      { id: 'farmer-profile', label: 'Cultivator Overview', icon: Tractor },
      { id: 'predictive-console', label: 'Predictive Simulator', icon: TrendingUp },
      { id: 'farmer-insights-view', label: 'Precision Insights', icon: Users },
      { id: 'crop-alerts', label: 'Crop Alerts', icon: ShieldAlert },
    ]
  };

  // Helper handler when top level tabs are clicked
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'retailer') switchRole('retailer');
    else switchRole(tabId);

    if (tabId === 'admin') setActiveSubView('field-operations');
    if (tabId === 'retailer') setActiveSubView('retailer-depot');
    if (tabId === 'farmer') setActiveSubView('farmer-profile');
  };

  // 4. Identity & Authentication Pipeline Hooks
  const handleLoginSubmit = (email, role) => {
    const existingUser = users.find(u => u.email?.toLowerCase() === email.toLowerCase() && u.role === role);

    if (existingUser) {
      switchRole(existingUser.role);
      handleTabChange(existingUser.role);
    } else {
      const fallbackUser = { id: `USR-${Date.now()}`, name: email.split('@')[0], email, role, location: 'Chennai', status: 'active', joins: new Date().toISOString().split('T')[0] };
      setUsers([fallbackUser, ...users]);
      switchRole(role);
      handleTabChange(role);
    }
    setViewMode('app');
  };

  const handleRegisterSubmit = (registrationData) => {
    const newUser = {
      id: `USR00${users.length + 1}`,
      name: registrationData.name,
      email: registrationData.email,
      role: registrationData.role,
      location: registrationData.location || 'Chennai',
      status: 'active',
      joins: new Date().toISOString().split('T')[0]
    };
    setUsers([newUser, ...users]);
    switchRole(registrationData.role);
    handleTabChange(registrationData.role);
    setViewMode('app');
  };

  const handleLogout = () => {
    setViewMode('landing');
  };

  if (viewMode === 'landing') {
    return (
      <LandingPage
        onLogin={handleLoginSubmit}
        onRegister={handleRegisterSubmit}
        onLaunchApp={() => {
          handleLoginSubmit('admin.geoai@syngenta.com', 'admin');
        }}
      />
    );
  }

  if (loading && viewMode === 'app') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F7F6]">
        <div className="text-sm font-bold text-slate-500 animate-pulse">
          Loading GeoAI Engine Matrix...
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-[#F4F7F6] text-slate-900 font-sans flex flex-col antialiased overflow-hidden select-none">
      
      {/* 1. Global Navigation Top Header */}
      <header className="bg-[#0F172A] text-white px-6 py-3 flex justify-between items-center z-50 shadow-md shrink-0">
        <div className="flex items-center space-x-3">
          <div className="bg-white p-1 rounded-xl text-[#00875A] font-black text-xl flex items-center justify-center shadow-md w-9 h-9 shrink-0">
            🌱
          </div>
          <div>
            <h1 className="font-bold text-base tracking-tight leading-none text-white">
              Syngenta GeoAI Engine
            </h1>
            <p className="text-[11px] text-slate-300 font-medium tracking-wide mt-1">Hyper-Local Agriculture Precision Suite</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-lg text-[11px] font-bold tracking-wide shadow-inner">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
            LOCAL PERSISTENCE LAYER ONLINE
          </div>

          <div className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2 text-xs">
            <span className="font-medium text-slate-200">
              <strong>{user?.name || 'Syngenta Operator'}</strong> <span className="text-[10px] bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded ml-1 uppercase">{user?.role}</span>
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white transition-all border border-rose-500/20 flex items-center gap-1.5"
          >
            <LogOut className="w-3 h-3" /> Sign Out
          </button>
        </div>
      </header>

      {/* 2. Primary Submenu Role Navigation Header Tabs */}
      <div className="bg-white border-b border-slate-200/70 px-6 pt-2 flex items-center shadow-sm">
        <div className="flex space-x-6">
          {[
            { id: 'admin', label: 'Admin Dashboard' },
            // { id: 'retailer', label: 'Retailer Portal' },
            { id: 'farmer', label: 'Farmer Insights' }
          ].map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`pb-2.5 text-xs font-bold tracking-wide transition-all border-b-2 relative ${isSelected
                  ? 'border-b-[#00875A] text-[#00875A] font-extrabold'
                  : 'border-b-transparent text-slate-400 hover:text-slate-700'
                  }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Outer Frame Splitting Component Panels Grid Layout */}
      <div className="flex-1 flex overflow-hidden w-full">

        {/* Left Side Dynamic Controller Layout Column — Premium Dark Aesthetic */}
        <aside className="w-56 bg-[#0F172A] border-r border-slate-800/80 h-full flex flex-col justify-between p-4 shrink-0 z-40 shadow-xl overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-32 bg-linear-to-b from-emerald-500/5 to-transparent pointer-events-none"></div>

          <div className="space-y-6 relative z-10">
            <div className="space-y-2">
              <span className="text-[9px] font-mono font-black tracking-widest text-slate-500 uppercase pl-3 block">
                Navigation Matrix
              </span>
              <div className="space-y-1">
                {sidebarNavigationSchema[activeTab]?.map((item) => {
                  const Icon = item.icon;
                  const isSubSelected = activeSubView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveSubView(item.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 relative group ${isSubSelected
                        ? 'bg-emerald-500/10 text-emerald-400 font-black shadow-inner shadow-black/10'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                        }`}
                    >
                      {isSubSelected && (
                        <span className="absolute left-0 top-2.5 bottom-2.5 w-1 rounded-r-md bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]"></span>
                      )}

                      <Icon className={`w-4 h-4 transition-colors duration-200 ${isSubSelected ? 'text-emerald-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <hr className="border-slate-800/60" />

            {/* Context Aware Active Layer Context Panel */}
            <div className="bg-[#09111E] border border-slate-800/80 rounded-xl p-3 text-[11px] space-y-2 shadow-inner">
              <div>
                <span className="block font-bold text-slate-500 uppercase tracking-wider text-[9px] font-mono">
                  Active UX Context
                </span>
                <span className="block font-black text-slate-200 mt-1 uppercase tracking-wide flex items-center gap-1.5 text-xs">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  {activeTab === 'admin' && "HQ Command Cluster"}
                  {activeTab === 'retailer' && `${activeFarmer?.district || 'Salem'} Depot Grid`}
                  {activeTab === 'farmer' && `${activeFarmer?.state_location || 'Delta Belt'} Vector`}
                </span>
              </div>

              {(activeTab === 'farmer' || activeTab === 'retailer') && (
                <div className="pt-2 border-t border-slate-800/60 space-y-1.5">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-500 font-medium">Active Name:</span>
                    <span className="font-bold text-slate-300 max-w-[90px] truncate text-right">{activeFarmer?.farmer_name}</span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-500 font-medium">State Region:</span>
                    <span className="font-bold text-slate-300 uppercase font-mono">{activeFarmer?.state_location}</span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-500 font-medium">Status Monitor:</span>
                    <span className={`font-bold uppercase font-mono ${activeFarmer?.panic_state === 'PANIC' ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`}>
                      {activeFarmer?.panic_state === 'PANIC' ? '🚨 CRITICAL' : '✨ OPERATIONAL'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-1 pt-3 border-t border-slate-800/60 relative z-10">
            <button className="w-full flex items-center space-x-3 px-3 py-2 text-slate-500 hover:text-slate-300 text-xs font-bold transition-all rounded-lg hover:bg-slate-800/30">
              <span className="text-slate-500">⚙️</span>
              <span>Console Settings</span>
            </button>
          </div>
        </aside>

        {/* Dynamic Route View Context Canvas Screen */}
        <main className="flex-1 h-full overflow-y-auto p-5 bg-green-100/80">
              
          {/* VIEW CONTEXT A: ADMIN SYSTEM WORKSPACE */}
          {activeTab === 'admin' && (
            <ProtectedRoute allowedRoles={['admin']}>
              {activeSubView === 'field-operations' && <AdminDashboard users={users} dashboardMetrics={dashboardMetrics} inventory={inventory} />}

              {activeSubView === 'user-management' && (
                <UserManagement
                  users={users}
                  setUsers={setUsers}
                  onSelectFarmerClient={(incomingId) => {
                    const matchIndex = users.findIndex(u => u.id === incomingId);
                    if (matchIndex !== -1) {
                      setSelectedFarmerIndex(matchIndex);
                      handleTabChange('farmer'); // Auto-navigate tab frame focus on selection trigger
                    }
                  }}
                />
              )}

              {activeSubView === 'inventory' && <Inventory inventory={inventory} setInventory={setInventory} />}

              {(activeSubView === 'crop-alerts' || activeSubView === 'retailer-network') && (
                <div className="p-10 bg-white border border-slate-200 rounded-xl text-center text-xs font-bold text-slate-400">
                  📋 Administrative operational strategy metrics logged on master database cluster.
                </div>
              )}
            </ProtectedRoute>
          )}

          {/* VIEW CONTEXT C: FARMER INSIGHTS DASHBOARD */}
          {activeTab === 'farmer' && (
            <ProtectedRoute allowedRoles={['admin', 'retailer', 'farmer']}>
              <div className="max-w-full mx-auto space-y-6">

                {/* Farmer Subview 1: Cultivator Overview */}
                {activeSubView === 'farmer-profile' && (
                  <FarmerDashboard activeFarmer={activeFarmer} />
                )}

                {/* Farmer Subview 2: Precision Charts View Panel */}
                {activeSubView === 'farmer-insights-view' && (
                  <FarmerInsights
                    selectedFarmerData={activeFarmer}
                    onUpdateFarmerMemory={handleUpdateFarmerMemory}
                    allFarmers={users}
                    onSelectFarmerIndex={setSelectedFarmerIndex}
                  />
                )}

                {/* Farmer Subview 3: ML Predictive Console */}
                {activeSubView === 'predictive-console' && (
                  <div className="space-y-4">
                    <div className="p-1.5 bg-white border border-slate-200 rounded-2xl shadow-xs">
                      <div className="p-4 bg-slate-50 border-b rounded-t-xl">
                        <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wide">
                          <Sparkles className="w-3.5 h-3.5 text-[#00875A]" /> Territory Decision Risk Simulator
                        </h3>
                        <p className="text-[11px] text-slate-400 mt-1">Submit pipeline matrices straight to your live machine learning classifier logic.</p>
                      </div>
                      <div className="p-2">
                        <FarmerChatConsole retailerId={activeFarmer?.retailer_id || "RET-TN-710"} />
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </ProtectedRoute>
          )}
        </main>
      </div>
    </div>
  );
}