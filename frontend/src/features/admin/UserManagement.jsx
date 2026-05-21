import { useState, useEffect } from 'react';
import { apiService } from '../../utils/apiService';
import { Users, UserPlus, Search, Shield, Filter, Edit, Trash2, CheckCircle2, XCircle, ArrowUpRight } from 'lucide-react';

export default function UserManagement({ users = [], setUsers, onSelectFarmerClient }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [criticalFarmers, setCriticalFarmers] = useState([]);

  useEffect(() => {

    const fetchCriticalFarmers =
      async () => {

        try {

          const data =
            await apiService.getCriticalFarmers();

          setCriticalFarmers(data || []);

        } catch (err) {

          console.error(
            "Failed to load critical farmers:",
            err
          );
        }
      };

    fetchCriticalFarmers();

  }, []);

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'farmer',
    location: '',
    status: 'active'
  });

  // 1. Core State Operations linked to Global State Array
  const handleCreateUser = (e) => {
    e.preventDefault();

    // Maintain key integrity matching Vaani V4 Schema contracts
    const preparedUser = {
      id: `USR_CUSTOM_${Math.floor(100 + Math.random() * 900)}`,
      farmer_name: newUser.name, // Linked to unified string key references
      email: newUser.email,
      role: newUser.role,
      state_location: newUser.location.includes(',') ? newUser.location.split(',')[1].trim() : 'Tamil Nadu',
      district: newUser.location.includes(',') ? newUser.location.split(',')[0].trim() : newUser.location,
      retailer_id: newUser.role === 'retailer' ? `RET-CUSTOM-${Math.floor(100 + Math.random() * 900)}` : "RET-TN-042",
      preferred_channel: "WhatsApp Core",
      season_stage: "Vegetative Phase",
      strategy: "Pre-emptive monitoring active.",
      panic_state: "STABLE",
      urgency_category: "LOW",
      dynamic_trust_score: 0.90,
      field_representative: { name: "Assigned Representative", phone: "+91 99999 99999" },
      history: [],
      status: newUser.status,
      joins: new Date().toISOString().split('T')[0]
    };

    if (setUsers) {
      setUsers([preparedUser, ...users]);
    }

    setShowAddModal(false);
    setNewUser({ name: '', email: '', role: 'farmer', location: '', status: 'active' });
  };

  const toggleUserStatus = (id) => {
    if (!setUsers) return;
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u));
  };

  const deleteUser = (id) => {
    if (!setUsers) return;
    setUsers(users.filter(u => u.id !== id));
  };

  // 2. Query Filtration Architecture 
  const filteredUsers = users.filter(user => {
    const nameString = user.farmer_name || user.name || '';
    const emailString = user.email || '';
    const idString = user.id || '';

    const matchesSearch =
      nameString.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emailString.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idString.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const criticalFarmerMap = {};

  criticalFarmers.forEach((farmer) => {

    criticalFarmerMap[
      farmer.retailer_id
    ] = farmer;
  });

  return (
    <div className="space-y-5 animate-fadeIn text-slate-700 w-full max-w-[1200px] mx-auto font-sans">

      {/* Action Header Ribbon */}
      <div className="bg-[#00875A] rounded-2xl p-4 px-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-white shadow-sm border border-emerald-700/20">
        <div>
          <h3 className="text-base font-bold tracking-wide flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-200" /> Identity Matrix & Provisioning Hub
          </h3>
          <p className="text-xs text-emerald-100/80 mt-0.5">Manage administrative credentials, distributor profiles, and regional field scopes</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-emerald-900/40 hover:bg-emerald-900/60 border border-emerald-500/30 rounded-xl text-xs font-bold text-white transition-all shadow-sm"
        >
          <UserPlus className="w-4 h-4" />
          <span>Provision Account</span>
        </button>
      </div>

      {/* Control Filters Layer */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by identifier, alias or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#F4F7F6] border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#00875A] focus:bg-white transition-all"
          />
        </div>
        <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-[#F4F7F6] border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-600 focus:outline-none focus:ring-1 focus:ring-[#00875A]"
          >
            <option value="all">All Enterprise Classes</option>
            <option value="admin">System Admin</option>
            <option value="retailer">Authorized Retailer/Distributor</option>
            <option value="farmer">Registered Producer (Farmer)</option>
          </select>
        </div>
      </div>

      {/* Core Enterprise Data Matrix Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F4F7F6] border-b border-slate-200 text-slate-500 font-bold text-[10px] uppercase tracking-wider">
                <th className="p-4 pl-6">Profile Descriptor</th>
                <th className="p-4">Authorization Domain</th>
                <th className="p-4">Geographic Node</th>
                <th className="p-4">System Identity Code</th>
                <th className="p-4">Operational Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((item) => {

                  const criticalData =
                    criticalFarmerMap[item.retailer_id];

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 pl-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-[#E6F4EA] text-[#00875A] font-bold text-xs flex items-center justify-center">
                            {(item.farmer_name || item.name || 'U').charAt(0)}
                          </div>
                          <div>
                            <span className="block font-bold text-slate-900">{item.farmer_name || item.name}</span>
                            <span className="block text-[10px] text-slate-400 font-normal">{item.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${item.role === 'admin' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          item.role === 'retailer' || item.role === 'shopkeeper' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                            'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}>
                          <Shield className="w-2.5 h-2.5" />
                          {(item.role === 'shopkeeper'
                            ? 'RETAILER'
                            : (item.role || 'FARMER')
                          ).toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-slate-800">
                        {item.district ? `${item.district}, ${item.state_location}` : (item.location || 'N/A')}
                      </td>
                      <td className="p-4 font-mono text-[11px] text-slate-500">{item.id}</td>
                      <td className="p-4">
                        <button
                          onClick={() => toggleUserStatus(item.id)}
                          className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-all ${(item.status || 'active') === 'active' ? 'bg-[#E6F4EA] text-[#00875A]' : 'bg-rose-50 text-rose-600'
                            }`}
                        >
                          {(item.status || 'active') === 'active' ? <CheckCircle2 className="w-2.5 h-2.5" /> : <XCircle className="w-2.5 h-2.5" />}
                          <span>{(item.status || 'active').toUpperCase()}</span>
                        </button>
                      </td>
                      <td className="p-4 pr-6 text-right space-x-2 whitespace-nowrap">
                        {/* INTEGRATION CONTEXT: Inter-Component Selection Router Trigger */}
                        {(item.role === 'farmer' || !item.role) && (
                          <button
                            onClick={() => onSelectFarmerClient && onSelectFarmerClient(item.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-[#00875A] hover:text-white transition-all rounded-lg text-[11px] font-bold shadow-2xs mr-1"
                          >
                            Launch Console <ArrowUpRight className="w-3 h-3" />
                          </button>
                        )}
                        <button className="p-1 text-slate-400 hover:text-slate-800 transition-colors"><Edit className="w-3.5 h-3.5" /></button>
                        <button onClick={() => deleteUser(item.id)} className="p-1 text-slate-400 hover:text-rose-600 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                      </td>
                    </tr>
                  );})
              ) : (
              <tr>
                <td colSpan="6" className="p-10 text-center text-xs font-bold text-slate-400 bg-slate-50/50">
                  No identities found matching the selected search query criteria.
                </td>
              </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-over Form Overlay Sheet Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-100 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-5 m-4 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h4 className="text-sm font-bold text-[#041E42]">Provision Network Identity Token</h4>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-800 font-bold text-sm">✕</button>
            </div>
            <form onSubmit={handleCreateUser} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-500 block">Full Name</label>
                <input required type="text" placeholder="e.g. Arul Prakash" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} className="w-full p-2 bg-[#F4F7F6] border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00875A] focus:bg-white" />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-500 block">Enterprise Mail Routing Address</label>
                <input required type="email" placeholder="arul@agri.com" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} className="w-full p-2 bg-[#F4F7F6] border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00875A] focus:bg-white" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-500 block">System Access Tier</label>
                  <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })} className="w-full p-2 bg-[#F4F7F6] border border-slate-200 rounded-lg font-semibold text-slate-600 focus:outline-none">
                    <option value="farmer">Farmer</option>
                    <option value="retailer">Retailer (Distributor)</option>
                    <option value="admin">System Admin</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-500 block">Hub Region (District, State)</label>
                  <input required type="text" placeholder="e.g. Trichy, TN" value={newUser.location} onChange={(e) => setNewUser({ ...newUser, location: e.target.value })} className="w-full p-2 bg-[#F4F7F6] border border-slate-200 rounded-lg focus:outline-none" />
                </div>
              </div>
              <div className="pt-3 flex justify-end space-x-2 border-t border-slate-100">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-lg transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#00875A] hover:bg-emerald-700 text-white font-bold rounded-lg transition-all shadow-sm">Save Provision Profile</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}