import
//  React, 
{ useState } from 'react';
import { AuthContext } from './AuthContext'; // Import the shared context instance

export function AuthProvider({ children }) {
  const [user, setUser] = useState({
    name: 'Syngenta Officer',
    role: 'admin', 
    region: 'Tamil Nadu',
    permissions: ['view_analytics', 'approve_campaigns', 'manage_inventory']
  });

  const switchRole = (roleName) => {
    const rolesConfig = {
      admin: { name: 'Regional Director', role: 'admin', region: 'Chennai HQ', permissions: ['all'] },
      shopkeeper: { name: 'Vellore Agri Traders', role: 'shopkeeper', region: 'North District', permissions: ['edit_stock', 'view_demands'] },
      farmer: { name: 'K. Selvam (5 Acres)', role: 'farmer', region: 'South - Tamil Nadu', permissions: ['view_advisories'] }
    };
    setUser(rolesConfig[roleName]);
  };

  return (
    <AuthContext.Provider value={{ user, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}