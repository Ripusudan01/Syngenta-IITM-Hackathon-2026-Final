// import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="p-8 bg-white border border-slate-200 rounded-xl text-center text-xs font-bold text-slate-400">
        🔒 Authentication required. Please log in to your GeoAI Operator profile.
      </div>
    );
  }

  // Master bypass: If the operator is a super admin, let them see any view workspace
  if (user.role === 'admin') {
    return children;
  }

  // Standard evaluation check for other standard roles
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="p-8 bg-rose-50/30 border border-rose-100 rounded-xl text-center text-xs font-bold text-rose-500 bg-rose-50/30">
        🚫 Access Denied. Your current operator role ({user.role?.toUpperCase() || 'NONE'}) doesn't have system permission clearance here.
      </div>
    );
  }

  return children;
}