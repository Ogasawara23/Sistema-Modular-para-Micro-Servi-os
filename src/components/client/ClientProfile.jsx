import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PrivateNotes } from './PrivateNotes';
import { User, Phone, Mail, Calendar, History, Shield, Sparkles, FileText, CheckCircle2 } from 'lucide-react';

/**
 * ClientProfile Component
 * Highly dynamic client detail view. Injects or hides the <PrivateNotes/> tab
 * and AI anamnesis summary tab conditionally based on tenant feature flags!
 */
export function ClientProfile({ client }) {
  const { features, tenantType, tenantName } = useAuth();
  const [activeTab, setActiveTab] = useState('history');

  if (!client) return null;

  // Feature Flag gating condition for PrivateNotes tab
  // E.g. Allowed when hasCommission is true or tenant has specific privacy module enabled
  const canViewPrivateNotes = Boolean(features?.hasCommission || features?.hasAiAnamnesis);

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="glass-card p-6 rounded-tenant border border-surface-border flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <img
            src={client.avatar}
            alt={client.name}
            className="w-20 h-20 rounded-full object-cover border-2 border-primary shadow-tenant"
          />
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold font-heading text-tenantText-main">{client.name}</h2>
              {client.vip && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-500 flex items-center gap-1">
                  ★ VIP
                </span>
              )}
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-light text-primary">
                {client.status}
              </span>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-tenantText-muted">
              <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-primary" /> {client.email}</span>
              <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-primary" /> {client.phone}</span>
              <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-primary" /> Última visita: {client.lastVisit}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-surface-border pt-4 md:pt-0 md:pl-6 w-full md:w-auto">
          <div className="text-center px-4">
            <span className="block text-2xl font-bold text-primary font-heading">{client.totalVisits}</span>
            <span className="text-xs text-tenantText-muted">Visitas Realizadas</span>
          </div>
          <div className="text-center px-4 border-l border-surface-border">
            <span className="block text-2xl font-bold text-emerald-500 font-heading">
              R$ {client.history?.reduce((acc, h) => acc + h.price, 0) || 0}
            </span>
            <span className="text-xs text-tenantText-muted">LTV Total</span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-surface-border pb-2">
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-tenant text-sm font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'history'
              ? 'bg-primary text-primary-text shadow-tenant'
              : 'text-tenantText-muted hover:text-tenantText-main hover:bg-surface-dim/40'
          }`}
        >
          <History className="w-4 h-4" /> Histórico de Serviços ({client.history?.length || 0})
        </button>

        {/* Conditional Tab Injection for Private Notes */}
        {canViewPrivateNotes ? (
          <button
            onClick={() => setActiveTab('notes')}
            className={`px-4 py-2 rounded-tenant text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'notes'
                ? 'bg-primary text-primary-text shadow-tenant'
                : 'text-tenantText-muted hover:text-tenantText-main hover:bg-surface-dim/40'
            }`}
          >
            <Shield className="w-4 h-4 text-amber-400" /> Notas Privadas & Sigilo
          </button>
        ) : (
          <span className="text-xs text-tenantText-muted italic px-3 py-1 bg-surface-dim/30 rounded-tenant flex items-center gap-1">
            <Shield className="w-3 h-3 opacity-50" /> Notas ocultadas para {tenantName} (Flag Desativada)
          </span>
        )}
      </div>

      {/* Tab Contents */}
      {activeTab === 'history' && (
        <div className="glass-card p-6 rounded-tenant border border-surface-border space-y-4">
          <h3 className="font-bold font-heading text-lg text-tenantText-main flex items-center justify-between">
            <span>Histórico de Atendimentos</span>
            <span className="text-xs text-tenantText-muted font-normal">Ordenado por recência</span>
          </h3>

          <div className="divide-y divide-surface-border">
            {client.history?.map((item, idx) => (
              <div key={idx} className="py-3.5 flex items-center justify-between hover:bg-surface-dim/20 px-3 rounded-tenant transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-tenant bg-primary-light text-primary flex items-center justify-center font-bold">
                    #{idx + 1}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-tenantText-main">{item.service}</h4>
                    <p className="text-xs text-tenantText-muted">Profissional: {item.professional} • {item.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-sm text-tenantText-main">R$ {item.price.toFixed(2)}</span>
                  <span className="block text-[11px] text-emerald-500 font-medium">Pago</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Conditional Private Notes Tab Content */}
      {activeTab === 'notes' && canViewPrivateNotes && (
        <PrivateNotes client={client} />
      )}
    </div>
  );
}
