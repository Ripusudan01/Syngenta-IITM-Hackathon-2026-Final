import { useState } from 'react';
import {
    Sprout,
    Shield,
    Zap,
    Target,
    Smartphone,
    Check,
    ArrowRight,
    Layers,
    Lock,
    // UserPlus,
    Server,
    Globe,
    Cpu,
    CheckCircle
} from 'lucide-react';

export default function LandingPage({ onLaunchApp, onLogin, onRegister }) {
    const [authModal, setAuthModal] = useState({
        isOpen: false,
        mode: 'login'
    });

    const [selectedRole, setSelectedRole] = useState('farmer');
    const [emailInput, setEmailInput] = useState('');
    const [nameInput, setNameInput] = useState('');
    const [locationInput, setLocationInput] = useState('Chennai');

    const handleAuthActionSubmit = (e) => {
        e.preventDefault();

        if (authModal.mode === 'login') {
            onLogin(emailInput, selectedRole);
        } else {
            onRegister({
                name: nameInput,
                email: emailInput,
                role: selectedRole,
                location: locationInput
            });
        }

        setAuthModal({
            isOpen: false,
            mode: 'login'
        });
    };

    return (
        // Style definition: forced 'font-serif' globally to apply Times New Roman
        <div className="min-h-screen bg-white text-slate-800 font-serif antialiased selection:bg-[#00875A]/20">

            {/* 1. Global Navigation Navbar Bar */}
            <nav className="w-full bg-white border-b border-slate-100 sticky top-0 z-50 h-16">
                <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                        <div className="bg-[#00875A] text-white p-1.5 rounded-xl font-bold flex items-center justify-center shadow-md shadow-emerald-700/10">
                            <Sprout className="w-5 h-5" />
                        </div>
                        {/* Added standard font weights that look exceptionally sharp in Times New Roman */}
                        <span className="font-bold text-slate-900 text-xl tracking-tight">
                            Syngenta <span className="text-[#00875A] italic font-normal">GeoAI</span>
                        </span>
                    </div>

                    <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
                        <a href="#features" className="hover:text-[#00875A] transition-colors">Features</a>
                        <a href="#science" className="hover:text-[#00875A] transition-colors">Our Science</a>
                        <a href="#case-studies" className="hover:text-[#00875A] transition-colors">Case Studies</a>
                        <a href="#pricing" className="hover:text-[#00875A] transition-colors">Pricing</a>
                    </div>

                    <button
                        onClick={() => setAuthModal({
                            isOpen: true,
                            mode: 'login'
                        })} className="bg-[#041E42] hover:bg-[#00875A] text-white px-5 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all shadow-md active:scale-95 font-sans"
                    >
                        Launch Core Platform
                    </button>
                </div>
            </nav>

            {/* 2. Hero Section - Configured to cover the entire page window view height */}
            <section className="w-full min-h-[calc(100vh-16px)] bg-[#E6F4EA]/50 border-b border-emerald-100/40 flex items-center px-6 relative overflow-hidden py-12 lg:py-0">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">

                    {/* Hero Content Column */}
                    <div className="lg:col-span-6 space-y-6 text-center lg:text-left z-10">
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl text-[#041E42] leading-[1.1] font-normal tracking-tight">
                            Hyper-Local Precision <br />
                            <span className="text-[#00875A] italic">for Every Farm.</span> <br />
                            Insights at Your Fingertips.
                        </h2>
                        <p className="text-slate-700 text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
                            Transform data into yield. Discover dynamic crop-risk mapping, real-time agronomic activity logging, and direct-to-farmer communication vectors engineered to secure regional production limits.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                            <button
                                onClick={onLaunchApp}
                                className="w-full sm:w-auto bg-[#00875A] hover:bg-[#041E42] text-white px-7 py-3.5 rounded-xl text-xs font-bold tracking-wide transition-all shadow-lg shadow-emerald-700/20 flex items-center justify-center gap-2 font-sans"
                            >
                                Access Admin Dashboard <ArrowRight className="w-4 h-4" />
                            </button>
                            <a
                                href="#features"
                                className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-7 py-3.5 rounded-xl text-xs font-bold tracking-wide transition-all text-center font-sans"
                            >
                                Explore System Architecture
                            </a>
                        </div>
                    </div>

                    {/* Hero UI Dashboard Mock Container Mockup */}
                    <div className="lg:col-span-6 relative flex justify-center z-10 w-full">
                        <div className="w-full max-w-lg bg-white border border-slate-200/80 rounded-3xl shadow-2xl p-4 relative overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
                            <div className="w-full h-72 sm:h-80 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col justify-between p-4 overflow-hidden relative">
                                <div className="flex justify-between items-center border-b pb-2">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide font-sans">Live Vector Grid Node Matrix</span>
                                    <span className="text-[9px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.5 rounded border border-emerald-200 font-sans">TAMIL NADU CORE</span>
                                </div>

                                {/* Simulated Grid Overlay Graphic */}
                                <div className="absolute inset-0 p-8 flex items-center justify-center opacity-30">
                                    <div className="w-48 h-48 rounded-full border-4 border-dashed border-emerald-600/30 animate-spin" style={{ animationDuration: '60s' }}></div>
                                    <div className="absolute w-28 h-28 rounded-full border-2 border-dashed border-emerald-600/20 animate-spin" style={{ animationDuration: '20s' }}></div>
                                </div>

                                {/* Simulated Map Flag Context Popover */}
                                <div className="space-y-1.5 z-10 relative">
                                    <div className="bg-white/95 backdrop-blur-xs p-3 rounded-xl border border-slate-100 shadow-sm max-w-55">
                                        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-800 font-sans">
                                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                                            <span>Salem Hub: <strong className="text-rose-600 font-black">42 Alerts</strong></span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-[#00875A] text-white text-xs px-4 py-2.5 rounded-xl flex justify-between items-center z-10 font-sans font-bold shadow-md">
                                    <span>96.2% Targeting Lift Applied</span>
                                    <span className="text-[9px] font-mono opacity-80 bg-emerald-900/30 px-1.5 py-0.5 rounded">ACTIVE SYNC</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Decorative Graphic Elements to balance the Fullscreen layout */}
                <div className="absolute top-1/3 -right-32 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-10 left-10 w-64 h-64 bg-emerald-100/30 rounded-full blur-2xl pointer-events-none"></div>
            </section>

            {/* 3. Key Benefits Grid Row Section */}
            <section className="w-full py-24 px-6 bg-white max-w-7xl mx-auto">
                <div className="text-center space-y-3 mb-20">
                    <span className="text-[11px] font-bold text-[#00875A] uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full font-sans">Core Pillars</span>
                    <h3 className="text-3xl font-normal text-[#041E42] tracking-tight">Designed for High-Yield Operations</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        { title: 'Precision Ag', desc: 'Deploy automated geo-coordinate clustering and targeting grids localized to the sector block level.', icon: Target },
                        { title: 'Real-Time Monitoring', desc: 'Track immediate user updates across WhatsApp, Interactive Voice Response logs, and dealer networks.', icon: Zap },
                        { title: 'Community Sync', desc: 'Keep field officers, area managers, and retail stores updated instantly across shared states.', icon: Layers },
                        { title: 'Risk Prediction', desc: 'Isolate crop pathology outspreads before critical windows close using proactive alert workflows.', icon: Shield }
                    ].map((benefit, idx) => {
                        const Icon = benefit.icon;
                        return (
                            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all group duration-200">
                                <div className="w-11 h-11 rounded-xl bg-[#E6F4EA]/80 text-[#00875A] flex items-center justify-center mb-5 font-bold group-hover:bg-[#00875A] group-hover:text-white transition-all shadow-xs">
                                    <Icon className="w-4 h-4" />
                                </div>
                                <h4 className="text-base font-bold text-slate-900 mb-2">{benefit.title}</h4>
                                <p className="text-xs text-slate-600 leading-relaxed font-medium">{benefit.desc}</p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* 4. Architecture Showcase Section */}
            <section id="features" className="w-full py-24 px-6 bg-slate-50 border-t border-b border-slate-100">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        <div className="lg:col-span-5 space-y-4">
                            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider font-sans">Interface Module</span>
                            <h3 className="text-2xl font-normal text-[#041E42] tracking-tight">Unified Workspace Architecture</h3>
                            <p className="text-sm text-slate-600 leading-relaxed font-medium">
                                Manage operations with our structured panel layout. View data visualizations, update regional team accounts, and monitor warehousing logistics from a central command dashboard.
                            </p>
                            <ul className="space-y-2.5 pt-3 text-xs text-slate-700 font-bold font-sans">
                                {['Interactive map grid filtering', 'Dynamic database status changes', 'One-click retail item tracking'].map((item, i) => (
                                    <li key={i} className="flex items-center gap-2.5">
                                        <span className="w-4 h-4 rounded-full bg-emerald-100 text-[#00875A] flex items-center justify-center"><Check className="w-2.5 h-2.5" /></span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                            <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 text-center space-y-4">
                                <div className="flex items-center justify-between border-b pb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                        <span className="text-[10px] font-mono font-bold text-slate-500">GeoAI CORE LAYOUT PREVIEW</span>
                                    </div>
                                    <span className="text-[9px] bg-slate-200/70 px-2 py-0.5 rounded font-mono text-slate-600">V2.4</span>
                                </div>
                                <div className="grid grid-cols-3 gap-3 font-sans">
                                    <div className="bg-white p-4 rounded-xl border text-left shadow-xs"><span className="block text-[9px] font-bold text-slate-400 uppercase">USERS</span><span className="text-xl font-black text-slate-800">338</span></div>
                                    <div className="bg-white p-4 rounded-xl border text-left shadow-xs"><span className="block text-[9px] font-bold text-slate-400 uppercase">ALERTS</span><span className="text-xl font-black text-rose-600">26 ⚠️</span></div>
                                    <div className="bg-white p-4 rounded-xl border text-left shadow-xs"><span className="block text-[9px] font-bold text-slate-400 uppercase">EFFECTIVENESS</span><span className="text-xl font-black text-emerald-600">96.2%</span></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Row B: Broadcast Engagement Channels */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-20">
                        <div className="lg:col-span-6 lg:order-2 space-y-4">
                            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider font-sans">Omnichannel Output</span>
                            <h3 className="text-2xl font-normal text-[#041E42] tracking-tight">Direct Engagement Channels</h3>
                            <p className="text-sm text-slate-600 leading-relaxed font-medium">
                                Connect directly with farmers through clean communication links. Deliver diagnostic crop intelligence, localized input advice, and product recommendations to mobile layouts automatically.
                            </p>
                            <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2">
                                <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-md w-max font-sans">
                                    <Smartphone className="w-3.5 h-3.5" /> High-Confidence Delivery Engine
                                </div>
                                <p className="text-xs text-slate-500 leading-relaxed font-medium">Automated system filters tailor message delivery channels dynamically based on local user profiles.</p>
                            </div>
                        </div>

                        <div className="lg:col-span-6 lg:order-1 flex justify-center w-full">
                            <div className="w-64 bg-slate-900 rounded-[36px] p-3 shadow-xl border border-slate-800">
                                <div className="bg-white rounded-[26px] overflow-hidden border border-slate-100 flex flex-col justify-between h-96 text-slate-800">
                                    <div className="bg-[#041E42] text-white p-3 pt-4 flex items-center gap-2 font-sans">
                                        <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-[10px]">S</div>
                                        <div>
                                            <span className="block text-[10px] font-bold leading-tight">Syngenta Broadcast</span>
                                            <span className="block text-[7px] text-emerald-400 font-medium">Online Engine Agent</span>
                                        </div>
                                    </div>
                                    <div className="p-3 bg-[#F4F7F6] flex-1 flex flex-col justify-end font-sans">
                                        <div className="bg-white p-2.5 rounded-xl shadow-xs border border-slate-200/60 text-[9px] space-y-1 max-w-[90%]">
                                            <p className="font-bold text-slate-900">🌾 வணக்கம் விவசாயியே!</p>
                                            <p className="text-slate-600 font-medium leading-normal">உங்கள் நெற்பயிரில் குலைநோய் (Blast) அறிகுறி தெரிகிறதா? உடனடியாக Amistar Top பயன்படுத்தவும்!</p>
                                            <span className="block text-right text-[7px] text-slate-400">9:26 AM</span>
                                        </div>
                                    </div>
                                    <div className="p-2 bg-white border-t flex justify-between items-center text-[9px] font-bold text-slate-500 font-sans">
                                        <span>Conv. Lift: <strong className="text-emerald-600">14.2%</strong></span>
                                        <span>Confidence: <strong className="text-slate-900">94%</strong></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. Footer Container */}
            <footer className="w-full bg-[#041E42] text-white pt-16 pb-8 px-6 border-t border-slate-900">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 border-b border-slate-800/60 pb-12">
                    <div className="md:col-span-5 space-y-3">
                        <span className="text-xl tracking-tight text-white block">Syngenta GeoAI Engine</span>
                        <p className="text-xs text-slate-400 max-w-sm leading-relaxed font-medium">
                            Industrial platform delivering field performance insight trackers, crop safety triggers, and automated community communications.
                        </p>
                    </div>
                    <div className="md:col-span-3 text-xs space-y-1.5 font-medium text-slate-400">
                        <span className="block text-xs font-bold text-white mb-2 tracking-wider uppercase font-sans">Contact Details</span>
                        <span className="block">Syngenta GeoAI Corporate Suite</span>
                        <span className="block">Ph: +91 1531 9020</span>
                        <span className="block">Email: precision.support@syngenta-geo.com</span>
                    </div>
                    <div className="md:col-span-4 space-y-2 text-xs font-sans">
                        <span className="block font-bold text-white tracking-wider uppercase">Sign Up for Updates</span>
                        <div className="flex gap-2">
                            <input type="email" placeholder="Enter corporate email address" className="bg-slate-900/60 border border-slate-700/80 rounded-lg p-2.5 text-xs font-medium placeholder:text-slate-500 text-white flex-1 focus:outline-none focus:border-[#00875A]" />
                            <button className="bg-[#00875A] hover:bg-emerald-600 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors">Sign Up</button>
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between text-[10px] font-bold text-slate-500 tracking-wider uppercase font-sans">
                    <span>&copy; {new Date().getFullYear()} Syngenta GeoAI Platform. All Rights Reserved.</span>
                    <div className="flex space-x-6 mt-4 sm:mt-0">
                        <a href="#terms" className="hover:text-white transition-colors">Terms of Service</a>
                        <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
                    </div>
                </div>
            </footer>
            {authModal.isOpen && (
                <div className="fixed inset-0 bg-syngenta-dark/60 backdrop-blur-md flex items-center justify-center z-9999 p-4 sm:p-6 md:p-10">

                    <div className="bg-white rounded-[28px] shadow-2xl border border-slate-200/60 max-w-4xl w-full overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-145 animate-fadeIn">

                        {/* LEFT PANEL */}
                        <div className="md:col-span-5 bg-syngenta-dark p-8 text-white flex flex-col justify-between relative overflow-hidden border-r border-emerald-950/30">

                            <div className="absolute top-0 right-0 w-64 h-64 bg-syngenta-light/10 rounded-full blur-3xl pointer-events-none"></div>

                            <div className="space-y-6 relative z-10">
                                <div className="flex items-center space-x-2.5">
                                    <div className="bg-syngenta-green text-white p-2 rounded-xl shadow-inner">
                                        <Sprout className="w-5 h-5" />
                                    </div>

                                    <span className="font-bold text-lg tracking-tight">
                                        GeoAI Hub
                                    </span>
                                </div>

                                <div className="space-y-2 pt-4">
                                    <span className="text-[10px] font-mono bg-syngenta-green/20 text-syngenta-light border border-syngenta-green/30 px-2.5 py-1 rounded-md uppercase tracking-wider font-bold">
                                        Passwordless Gateway
                                    </span>

                                    <h3 className="text-xl font-normal font-serif text-slate-100 leading-snug">
                                        Instant access via validated organizational signatures.
                                    </h3>
                                </div>
                            </div>

                            {/* STATUS BLOCKS */}
                            <div className="space-y-3 pt-8 border-t border-emerald-900/40 font-mono relative z-10 text-[11px] text-slate-400">

                                <div className="flex items-center justify-between bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-900/20">
                                    <span className="flex items-center gap-2">
                                        <Server className="w-3.5 h-3.5 text-syngenta-green" />
                                        Node Matrix:
                                    </span>

                                    <span className="text-slate-200 font-bold">
                                        Tamil Nadu Active
                                    </span>
                                </div>

                                <div className="flex items-center justify-between bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-900/20">
                                    <span className="flex items-center gap-2">
                                        <Globe className="w-3.5 h-3.5 text-syngenta-green" />
                                        Authentication:
                                    </span>

                                    <span className="text-syngenta-light font-bold flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-syngenta-light animate-ping"></span>
                                        Direct RBAC
                                    </span>
                                </div>

                                <div className="flex items-center justify-between bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-900/20">
                                    <span className="flex items-center gap-2">
                                        <Cpu className="w-3.5 h-3.5 text-syngenta-green" />
                                        System Guard:
                                    </span>

                                    <span className="text-slate-200 font-bold">
                                        Encryption Verified
                                    </span>
                                </div>

                            </div>
                        </div>

                        {/* RIGHT FORM PANEL */}
                        <form onSubmit={handleAuthActionSubmit} className="md:col-span-7 p-8 md:p-10 flex flex-col justify-between space-y-6 bg-white">

                            {/* Header Context Switcher */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                                            {authModal.mode === 'login' ? 'Account Authentication Context' : 'Register Secure Profile'}
                                        </h2>
                                        <p className="text-xs text-slate-400 mt-0.5 font-medium">
                                            Select your operational division workspace parameter below.
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setAuthModal({ isOpen: false, mode: 'login' })}
                                        className="text-slate-300 hover:text-slate-600 transition-colors text-lg p-1 font-mono"
                                    >
                                        ✕
                                    </button>
                                </div>

                                {/* Main Toggle Switcher: Login vs Register */}
                                <div className="flex bg-slate-100 p-1 rounded-xl gap-1 text-xs font-bold w-fit">
                                    <button
                                        type="button"
                                        onClick={() => setAuthModal({ ...authModal, mode: 'login' })}
                                        className={`px-4 py-2 rounded-lg transition-all ${authModal.mode === 'login' ? 'bg-white text-syngenta-dark shadow-xs' : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                        Login Gate
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setAuthModal({ ...authModal, mode: 'register' })}
                                        className={`px-4 py-2 rounded-lg transition-all ${authModal.mode === 'register' ? 'bg-white text-syngenta-dark shadow-xs' : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                        Registration Portal
                                    </button>
                                </div>
                            </div>

                            {/* INPUT FIELDS STACK ZONE */}
                            <div className="space-y-4">

                                {/* ROLE MATRIX SELECTOR CARDS (Highly explicit UX) */}
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                                        Verified Access Tier Role
                                    </label>
                                    <div className="grid grid-cols-3 gap-2.5">
                                        {[
                                            { id: 'farmer', label: 'Farmer Area' },
                                            { id: 'retailer', label: 'Retailer Depot' },
                                            ...(authModal.mode === 'login' ? [{ id: 'admin', label: 'Root Admin' }] : [])
                                        ].map((role) => (
                                            <button
                                                key={role.id}
                                                type="button"
                                                onClick={() => setSelectedRole(role.id)}
                                                className={`p-3 rounded-xl border text-center text-xs font-bold transition-all relative flex flex-col items-center justify-center gap-1 ${selectedRole === role.id
                                                        ? 'border-syngenta-green bg-[#E6F4EA]/40 text-syngenta-green shadow-xs'
                                                        : 'border-slate-200 bg-slate-50/50 text-slate-500 hover:bg-slate-50'
                                                    }`}
                                            >
                                                {selectedRole === role.id && (
                                                    <span className="absolute top-1.5 right-1.5 text-syngenta-green">
                                                        <CheckCircle className="w-3.5 h-3.5 fill-current text-syngenta-green stroke-white" />
                                                    </span>
                                                )}
                                                <span>{role.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Dynamic Field: Input Full Name (Only visible when user toggles Register mode) */}
                                {authModal.mode === 'register' && (
                                    <div className="animate-slideDown">
                                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Full Legal Name</label>
                                        <input
                                            required
                                            type="text"
                                            value={nameInput}
                                            onChange={e => setNameInput(e.target.value)}
                                            placeholder="e.g. Rajesh Kumar"
                                            className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-syngenta-green/20 focus:border-syngenta-green focus:outline-none transition-all"
                                        />
                                    </div>
                                )}

                                {/* Corporate Assigned Email Box */}
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Corporate Email Address</label>
                                    <input
                                        required
                                        type="email"
                                        value={emailInput}
                                        onChange={e => setEmailInput(e.target.value)}
                                        placeholder="e.g. name@domain.com"
                                        className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-syngenta-green/20 focus:border-syngenta-green focus:outline-none transition-all"
                                    />
                                </div>

                                {/* Location Selection Dropdown Selector */}
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Assigned Regional Hub Operation Node</label>
                                    <select
                                        value={locationInput}
                                        onChange={e => setLocationInput(e.target.value)}
                                        className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:bg-white focus:outline-none focus:border-syngenta-green transition-all"
                                    >
                                        <option value="Chennai">Chennai Hub Zone</option>
                                        <option value="Salem">Salem Hub Zone</option>
                                        <option value="Thanjavur">Thanjavur Hub Zone</option>
                                        <option value="Madurai">Madurai Hub Zone</option>
                                    </select>
                                </div>

                                {/* Explicit Notification Text Explaining Passwordless Concept */}
                                <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3 flex items-start gap-2.5">
                                    <Lock className="w-4 h-4 text-syngenta-green shrink-0 mt-0.5" />
                                    <p className="text-[11px] text-slate-500 leading-normal">
                                        <strong>Zero-Password Configuration Access Policy:</strong> No password is required. Verification routes securely by confirming your registered account context matches our platform matrix.
                                    </p>
                                </div>

                            </div>

                            {/* ACTION FOOTER BUTTONS BUTTON BOX */}
                            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3 text-xs font-bold">
                                <button
                                    type="button"
                                    onClick={() => setAuthModal({ isOpen: false, mode: 'login' })}
                                    className="px-5 py-2.5 bg-slate-100 text-slate-600 hover:bg-slate-200/80 rounded-xl transition-colors"
                                >
                                    Dismiss
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2.5 bg-syngenta-green hover:bg-syngenta-dark text-white rounded-xl shadow-md transition-all flex items-center gap-1.5"
                                >
                                    <span>{authModal.mode === 'login' ? 'Initialize Work Session' : 'Provision Secure Profile'}</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                            </div>

                        </form>

                    </div>
                </div>
            )}
        </div>
    );
}