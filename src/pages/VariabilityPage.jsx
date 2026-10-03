import React from 'react';
import { VariabilityPlanning } from '../components/VariabilityPlanning';
import { useAuth } from '../context/AuthContext';
import { tenantConfigManager } from '../patterns/singletons/TenantConfigManager';

export function VariabilityPage() {
  const { tenantId, switchTenantUser } = useAuth();
  const currentTenant = tenantConfigManager.getTenant();

  const handleTenantSwitch = (type) => {
    switchTenantUser(type === 'BARBER' ? 'TenantA' : 'TenantB');
  };

  return (
    <div className="space-y-6">
      <VariabilityPlanning 
        currentTenant={currentTenant}
        onTenantSwitch={handleTenantSwitch}
      />
    </div>
  );
}
