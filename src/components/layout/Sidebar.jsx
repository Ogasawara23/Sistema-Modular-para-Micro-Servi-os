import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Calendar,
  Users,
  UserCheck,
  Briefcase,
  UserCog,
  ShoppingCart,
  Package,
  BarChart3,
  Video,
  Brain,
  Settings,
  LogOut,
  Lock,
  Sparkles,
  GitBranch,
  Database
} from 'lucide-react';

export function Sidebar() {
  const { features, tenantId } = useAuth();

  const navItems = [
    { to: '/', label: '1. Dashboard', icon: LayoutDashboard },
    { to: '/calendar', label: '2. Agenda', icon: Calendar },
    { to: '/clients', label: '3. Clientes', icon: Users },
    { to: '/clients/CLI-001', label: '4. Perfil Cliente', icon: UserCheck },
    { to: '/services', label: '5. Serviços', icon: Briefcase },
    { to: '/team', label: '6. Equipe & Staff', icon: UserCog },
    { to: '/checkout', label: '7. Checkout / PDV', icon: ShoppingCart },
    {
      to: '/products',
      label: '8. Produtos / Estoque',
      icon: Package,
      flagName: 'hasProducts',
      active: features?.hasProducts,
    },
    {
      to: '/reports',
      label: '9. Relatórios & Comissões',
      icon: BarChart3,
      flagName: 'hasCommission',
      active: features?.hasCommission,
    },
    {
      to: '/telehealth',
      label: '10. Teleconsulta',
      icon: Video,
      flagName: 'hasTelehealth',
      active: features?.hasTelehealth,
    },
    {
      to: '/anamnesis',
      label: '11. Anamnese IA',
      icon: Brain,
      flagName: 'hasAiAnamnesis',
      active: features?.hasAiAnamnesis,
      isLazy: true,
    },
    { to: '/settings', label: '12. Configurações', icon: Settings },
    { to: '/login', label: '13. Tenant Switcher', icon: LogOut },
    { to: '/variability', label: '14. Variabilidade & Reuso', icon: GitBranch },
  ];

  return (
    <aside className="w-64 bg-surface-card border-r border-surface-border min-h-[calc(100vh-65px)] p-4 flex flex-col justify-between shrink-0">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-tenantText-muted flex items-center justify-between">
          <span>Abas do Protótipo</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary-light text-primary font-mono">{tenantId}</span>
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isGated = item.flagName && !item.active;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-tenant text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary text-primary-text font-semibold shadow-tenant'
                    : 'text-tenantText-main hover:bg-surface-dim/40'
                } ${isGated ? 'opacity-60' : ''}`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </div>

              {item.isLazy && item.active && (
                <Sparkles className="w-3 h-3 text-amber-400 shrink-0 animate-pulse" />
              )}
              {isGated && (
                <Lock className="w-3 h-3 text-tenantText-muted shrink-0" />
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Footer System Status Info */}
      <div className="p-3 rounded-tenant bg-surface-dim/30 border border-surface-border text-xs space-y-1.5 text-tenantText-muted mt-6">
        <div className="flex items-center justify-between font-semibold text-tenantText-main">
          <span>SQLite Nativo</span>
          <span className="flex items-center gap-1.5 text-emerald-500 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
            Online
          </span>
        </div>
        <p className="text-[11px] leading-tight text-tenantText-muted">
          Banco relacional com isolamento Multi-Tenant e Padrões GoF
        </p>
      </div>
    </aside>
  );
}
