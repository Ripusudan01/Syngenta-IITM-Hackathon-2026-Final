// src/context/AppContext.jsx
import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [globalState, setGlobalState] = useState({
    selectedTerritoryId: null,
    selectedRetailerId: "RTL_00001", // Default starting hub context
    activeLanguageFilter: "All",
    notificationLogs: [
      { id: "1", message: "CRITICAL PANIC: Farmer_1240 reporting intense blast disease symptoms", severity: "critical" },
      { id: "2", message: "STOCKOUT RISK: RTL_00023 low inventory on Tilt 250 EC", severity: "warning" }
    ]
  });

  const updateGlobalState = (updates) => {
    setGlobalState(prev => ({ ...prev, ...updates }));
  };

  return (
    <AppContext.Provider value={{ globalState, updateGlobalState }}>
      {children}
    </AppContext.Provider>
  );
}

export const useGlobalApp = () => useContext(AppContext);