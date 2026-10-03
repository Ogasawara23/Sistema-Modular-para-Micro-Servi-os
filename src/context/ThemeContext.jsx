import React, { createContext, useContext, useState, useEffect } from 'react';
import { SimulatedAPI } from '../mocks/SimulatedAPI';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [tenantId, setTenantId] = useState(SimulatedAPI.getActiveTenantId());
  const [themeConfig, setThemeConfig] = useState(null);

  useEffect(() => {
    // Apply data-tenant attribute to root DOM node for native CSS variables theme swap
    document.documentElement.setAttribute('data-tenant', tenantId);
    
    // Sync with SimulatedAPI config
    SimulatedAPI.getTenantConfig(tenantId).then(config => {
      setThemeConfig(config);
    });
  }, [tenantId]);

  const changeTenantTheme = (newTenantId) => {
    setTenantId(newTenantId);
    SimulatedAPI.setActiveTenantId(newTenantId);
    document.documentElement.setAttribute('data-tenant', newTenantId);
  };

  return (
    <ThemeContext.Provider value={{ tenantId, changeTenantTheme, themeConfig }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
