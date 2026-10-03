import React, { createContext, useContext, useState, useEffect } from 'react';
import { SimulatedAPI } from '../mocks/SimulatedAPI';
import { useTheme } from './ThemeContext';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const { changeTenantTheme } = useTheme();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const userData = await SimulatedAPI.getCurrentUser();
      setUser(userData);
    } catch (err) {
      console.error('Failed to load user mock:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const switchTenantUser = async (tenantId) => {
    setLoading(true);
    changeTenantTheme(tenantId);
    const updatedUser = await SimulatedAPI.switchTenant(tenantId);
    setUser(updatedUser);
    setLoading(false);
  };

  const updateFeatures = async (newFeatures) => {
    await SimulatedAPI.updateTenantSettings(newFeatures);
    await fetchUserData();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        tenantId: user?.tenantId || 'TenantB',
        tenantName: user?.tenantName || 'Clínica Mente & Corpo',
        tenantType: user?.tenantType || 'consultoria',
        features: user?.features || {},
        switchTenantUser,
        updateFeatures,
        refreshUser: fetchUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
