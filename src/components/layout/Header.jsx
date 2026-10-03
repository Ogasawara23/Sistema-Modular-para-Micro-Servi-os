import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { getCheckoutStrategy } from '../../strategies/checkoutStrategies';
import { Scissors, Stethoscope, Sparkles, User, RefreshCw, Layers, Database } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Header() {
  const { user, tenantId, switchTenantUser, features, tenantType } = useAuth();
  const activeStrategy = getCheckoutStrategy(tenantType, features?.checkoutStrategy);

  return (
    <header className="sticky top-0 z-40 bg-surface-card/90 backdrop-blur-md border-b border-surface-border transition-colors">
      <div className="px-6 py-3.5 flex items-center justify-between gap-4">
        
        {/* Brand & Active Tenant Title */}
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-tenant bg-primary text-primary-text flex items-center justify-center font-bold text-xl shadow-tenant group-hover:scale-105 transition-transform">
              {tenantId === 'TenantA' || tenantId === 'BARBER' ? <Scissors className="w-5 h-5" /> : <Stethoscope className="w-5 h-5" />}
            </div>
            <div>
              <h1 className="font-heading font-bold text-lg leading-snug text-tenantText-main flex items-center gap-2">
                {user?.tenantName || 'SaaS Agendamento'}
                <span className="text-[10px] px-2 py-0.5 rounded-full font-sans font-semibold bg-primary-light text-primary uppercase">
                  {tenantId}
                </span>
              </h1>
              <p className="text-xs text-tenantText-muted font-sans">
                {tenantId === 'TenantA' || tenantId === 'BARBER' ? 'Barbearia & Salão Studio' : 'Clínica Mente & Corpo'}
              </p>
            </div>
          </Link>

          {/* Active Payment Strategy Badge */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <Layers className="w-3.5 h-3.5" />
            <span>Estratégia PDV: <strong>{activeStrategy.badgeText}</strong></span>
          </div>

          {/* SQLite DB Status */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" title="Banco de dados SQLite Conectado">
            <Database className="w-3.5 h-3.5" />
            <span>SQLite: <strong>Online</strong></span>
          </div>
        </div>

        {/* Tenant Switcher Quick Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-surface-dim/40 p-1 rounded-tenant border border-surface-border">
            <button
              onClick={() => switchTenantUser('TenantA')}
              className={`px-3 py-1.5 rounded-tenant-sm text-xs font-semibold transition-all flex items-center gap-1.5 ${
                tenantId === 'TenantA' || tenantId === 'BARBER'
                  ? 'bg-primary text-primary-text shadow-sm'
                  : 'text-tenantText-muted hover:text-tenantText-main'
              }`}
            >
              <Scissors className="w-3.5 h-3.5" /> Barbearia (TenantA)
            </button>
            <button
              onClick={() => switchTenantUser('TenantB')}
              className={`px-3 py-1.5 rounded-tenant-sm text-xs font-semibold transition-all flex items-center gap-1.5 ${
                tenantId === 'TenantB' || tenantId === 'CLINIC'
                  ? 'bg-primary text-primary-text shadow-sm'
                  : 'text-tenantText-muted hover:text-tenantText-main'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5" /> Clínica (TenantB)
            </button>
          </div>

          {/* User Profile Pill */}
          <div className="hidden sm:flex items-center gap-3 border-l border-surface-border pl-3">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={user?.name}
              className="w-9 h-9 rounded-full object-cover border border-primary"
            />
            <div className="text-left text-xs">
              <span className="block font-semibold text-tenantText-main">{user?.name}</span>
              <span className="text-[11px] text-tenantText-muted">{user?.role}</span>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
}
