import  { useState, useEffect } from 'react';
import { Database, Plus, Search, AlertCircle, ShoppingBag, Package, RefreshCcw, ArrowUpRight } from 'lucide-react';

export default function Inventory() {
  const [stockItems, setStockItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // 1. Simulate API Data Pipeline Hydration
  useEffect(() => {
    const fetchMockInventory = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setStockItems([
        { id: 'SKU-AMISTAR-01', name: 'Amistar Top Protective Fungicide', category: 'Crop Protection', stock: 420, criticalLimit: 100, price: '₹1,450', location: 'Warehouse Cluster A' },
        { id: 'SKU-CRUISER-02', name: 'Cruiser 350 FS Seed Treatment', category: 'Seed Security', stock: 85, criticalLimit: 150, price: '₹2,100', location: 'Warehouse Cluster B' },
        { id: 'SKU-EFORIA-03', name: 'Eforia Advanced Insecticide', category: 'Crop Protection', stock: 610, criticalLimit: 120, price: '₹980', location: 'Warehouse Cluster A' },
        { id: 'SKU-QUANTIS-04', name: 'Quantis Bio-Nutrient Optimizer', category: 'Biostimulants', stock: 45, criticalLimit: 50, price: '₹1,850', location: 'Warehouse Cluster C' },
        { id: 'SKU-MATCH-05', name: 'Match Insect Growth Regulator', category: 'Crop Protection', stock: 290, criticalLimit: 75, price: '₹1,120', location: 'Warehouse Cluster B' }
      ]);
      setIsLoading(false);
    };
    fetchMockInventory();
  }, []);

  // 2. Local State Modifier Handlers (Ready to plug directly to backend mutation triggers)
  const quickRestock = (id, quantity) => {
    // REST API Swap: await axios.patch(`/api/inventory/${id}/restock`, { amt: quantity })
    setStockItems(stockItems.map(item => item.id === id ? { ...item, stock: item.stock + quantity } : item));
  };

  const filteredItems = stockItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-5 animate-fadeIn text-slate-700 w-full max-w-375 mx-auto">
      
      {/* Action Header Banner */}
      <div className="bg-[#00875A] rounded-2xl p-4 px-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-white shadow-sm border border-emerald-700/20">
        <div>
          <h3 className="text-base font-bold tracking-wide flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-200" /> Agronomic Inventory Matrix Ledger
          </h3>
          <p className="text-xs text-emerald-100/80 mt-0.5">Asset deployment analytics, product stock indices, and automated depletion warnings</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-emerald-900/40 hover:bg-emerald-900/60 border border-emerald-500/30 rounded-xl text-xs font-bold text-white transition-all shadow-sm">
          <Plus className="w-4 h-4" />
          <span>Ingest Cargo Asset</span>
        </button>
      </div>

      {/* Real-time Threshold Depletion Diagnostic Grid Block */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stockItems.filter(i => i.stock <= i.criticalLimit).map((item, idx) => (
          <div key={idx} className="bg-rose-50/50 border border-rose-200/60 rounded-xl p-3.5 flex items-start space-x-3 animate-pulse">
            <div className="p-2 bg-rose-500 text-white rounded-lg shrink-0 mt-0.5"><AlertCircle className="w-4 h-4" /></div>
            <div>
              <span className="block text-[11px] font-bold text-rose-800 uppercase tracking-wide">Critical Restock Depletion Threat</span>
              <span className="block font-bold text-slate-800 text-xs truncate mt-0.5 max-w-55">{item.name}</span>
              <span className="block text-[10px] text-slate-500 font-medium mt-1">Current Balance: <strong className="text-rose-600 font-black">{item.stock} Units</strong> (Threshold: {item.criticalLimit})</span>
            </div>
          </div>
        ))}
      </div>

      {/* Control Filters Layer Row */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search assets by catalog item descriptor or code..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#F4F7F6] border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#00875A] focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Main Asset Records Layout Grid Grid Frame */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Left Side Comprehensive Records Catalog List Grid Wrapper Panel (Columns 1-8) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-20 text-center space-y-3">
              <div className="w-8 h-8 border-4 border-[#00875A] border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-xs font-bold text-slate-400">Syncing dynamic asset stock indexes...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F4F7F6] border-b border-slate-200 text-slate-500 font-bold text-[10px] uppercase tracking-wider">
                    <th className="p-4 pl-6">SKU Identifier Asset</th>
                    <th className="p-4">Category Class</th>
                    <th className="p-4">Balance Stock</th>
                    <th className="p-4">Retail Unit Price</th>
                    <th className="p-4">Allocation Location</th>
                    <th className="p-4 pr-6 text-right">Quick Management Pipeline Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                  {filteredItems.map((item) => {
                    const isLow = item.stock <= item.criticalLimit;
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-4 pl-6">
                          <div>
                            <span className="block font-bold text-slate-900 text-xs">{item.name}</span>
                            <span className="block text-[10px] font-mono text-slate-400 font-normal mt-0.5">{item.id}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-[10px] font-bold text-slate-600 uppercase tracking-wide">
                            {item.category}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-1.5">
                            <span className={`text-sm font-black ${isLow ? 'text-rose-600' : 'text-slate-800'}`}>{item.stock}</span>
                            <span className="text-[10px] text-slate-400 font-bold">qty</span>
                          </div>
                        </td>
                        <td className="p-4 font-bold text-slate-900">{item.price}</td>
                        <td className="p-4 text-slate-500 font-medium">{item.location}</td>
                        <td className="p-4 pr-6 text-right space-x-1.5">
                          <button onClick={() => quickRestock(item.id, 50)} className="bg-[#E6F4EA] hover:bg-[#00875A] text-[#00875A] hover:text-white font-bold text-[10px] px-2.5 py-1.5 rounded-lg border border-emerald-100 transition-all shadow-xs cursor-pointer">+50 Units</button>
                          <button onClick={() => quickRestock(item.id, 100)} className="bg-[#E6F4EA] hover:bg-[#00875A] text-[#00875A] hover:text-white font-bold text-[10px] px-2.5 py-1.5 rounded-lg border border-emerald-100 transition-all shadow-xs cursor-pointer">+100</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Side Allocation Flow Summary Log (Columns 9-12) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-4">
            <h4 className="text-xs font-bold text-[#041E42] pb-2.5 border-b border-slate-100 uppercase tracking-wider">Asset Channel Flow Dynamics</h4>
            
            <div className="space-y-3">
              <div className="bg-[#F4F7F6] border border-slate-100 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-emerald-100 text-[#00875A] rounded-lg"><ShoppingBag className="w-4 h-4" /></div>
                  <div>
                    <span className="block font-bold text-slate-800 text-xs">Total Catalog Volume</span>
                    <span className="block text-[10px] text-slate-400 font-semibold mt-0.5">Across all product scopes</span>
                  </div>
                </div>
                <span className="text-sm font-black text-slate-800">1,430 <ArrowUpRight className="w-3 h-3 text-emerald-500 inline" /></span>
              </div>

              <div className="bg-[#F4F7F6] border border-slate-100 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Package className="w-4 h-4" /></div>
                  <div>
                    <span className="block font-bold text-slate-800 text-xs">Awaiting Logistics Cargo</span>
                    <span className="block text-[10px] text-slate-400 font-semibold mt-0.5">En route inbound sync</span>
                  </div>
                </div>
                <span className="text-sm font-black text-slate-800">320 Units</span>
              </div>
            </div>

            <div className="bg-[#E6F4EA]/40 border border-emerald-100 rounded-xl p-3.5 text-center text-[11px] font-semibold text-slate-500">
              <p className="leading-normal">All physical asset counts are synchronized with spatial transit beacons across sub-regional points.</p>
              <button className="mt-2.5 w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold py-1.5 rounded-lg text-[10px] transition-all flex items-center justify-center gap-1.5 shadow-sm">
                <RefreshCcw className="w-3 h-3 text-[#00875A]" /> Perform Network Hardware Scan
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}