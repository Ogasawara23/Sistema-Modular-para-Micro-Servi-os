import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  BarChart3, 
  FileText, 
  TrendingUp, 
  Users, 
  PieChart, 
  CreditCard, 
  Calculator,
  ShieldCheck,
  Award
} from 'lucide-react';
import { SE01Receipt } from '../components/se/SE01Receipt';
import { SE02Revenue } from '../components/se/SE02Revenue';
import { SE03Productivity } from '../components/se/SE03Productivity';
import { SE04DRE } from '../components/se/SE04DRE';
import { PaymentsPanel } from '../components/readonly/PaymentsPanel';
import { mockPayments } from '../data/mockData';
import { tenantConfigManager } from '../patterns/singletons/TenantConfigManager';

export function ReportsPage() {
  const { tenantId, tenantName } = useAuth();
  const currentTenant = tenantConfigManager.getTenant();
  const [activeTab, setActiveTab] = useState('se01'); // se01 | se02 | se03 | se04 | gateways

  return (
    <div className="space-y-6">
      {/* Header Banner com Metadados de APF & Saídas Externas */}
      <div className="glass-card p-6 rounded-tenant border border-surface-border flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30 inline-flex items-center gap-1">
              <Calculator className="w-3.5 h-3.5" /> Análise de Pontos de Função (APF - IFPUG)
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500 border border-emerald-500/30">
              4 SEs Prototipadas • 24 PFs Totais
            </span>
          </div>
          <h1 className="text-2xl font-bold font-heading text-tenantText-main mt-1.5 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-primary" /> Módulo de Saídas Externas (SE) & Relatórios — {tenantName}
          </h1>
          <p className="text-xs text-tenantText-muted mt-0.5">
            Estimativas funcionais com 2 SEs por membro da equipe, dados derivados e ao menos 5 funcionalidades interativas por modelo.
          </p>
        </div>

        {/* Resumo Rápido da Equipe */}
        <div className="flex items-center gap-3 text-xs">
          <div className="p-3 rounded-tenant bg-surface-dim/60 border border-surface-border space-y-0.5">
            <div className="text-tenantText-muted font-medium">Membro 1 (Arthur Major):</div>
            <div className="font-bold text-tenantText-main">SE-01 (7 PF) + SE-02 (5 PF) = <span className="text-primary">12 PFs</span></div>
          </div>
          <div className="p-3 rounded-tenant bg-surface-dim/60 border border-surface-border space-y-0.5">
            <div className="text-tenantText-muted font-medium">Membro 2 (Dupla):</div>
            <div className="font-bold text-tenantText-main">SE-03 (5 PF) + SE-04 (7 PF) = <span className="text-primary">12 PFs</span></div>
          </div>
        </div>
      </div>

      {/* Navegação entre as 4 Saídas Externas (SEs) e Auditoria de Gateway */}
      <div className="flex items-center overflow-x-auto bg-surface-dim/40 p-1.5 rounded-tenant border border-surface-border gap-1 text-xs">
        <button
          onClick={() => setActiveTab('se01')}
          className={`px-3.5 py-2 rounded-tenant-sm font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'se01'
              ? 'bg-primary text-primary-text shadow-sm'
              : 'text-tenantText-muted hover:text-tenantText-main'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>SE-01: Recibos Fiscais (Membro 1)</span>
        </button>

        <button
          onClick={() => setActiveTab('se02')}
          className={`px-3.5 py-2 rounded-tenant-sm font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'se02'
              ? 'bg-primary text-primary-text shadow-sm'
              : 'text-tenantText-muted hover:text-tenantText-main'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>SE-02: Fechamento Caixa (Membro 1)</span>
        </button>

        <button
          onClick={() => setActiveTab('se03')}
          className={`px-3.5 py-2 rounded-tenant-sm font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'se03'
              ? 'bg-primary text-primary-text shadow-sm'
              : 'text-tenantText-muted hover:text-tenantText-main'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>SE-03: Produtividade & Comissões (Membro 2)</span>
        </button>

        <button
          onClick={() => setActiveTab('se04')}
          className={`px-3.5 py-2 rounded-tenant-sm font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'se04'
              ? 'bg-primary text-primary-text shadow-sm'
              : 'text-tenantText-muted hover:text-tenantText-main'
          }`}
        >
          <PieChart className="w-3.5 h-3.5" />
          <span>SE-04: DRE & Multi-Tenant (Membro 2)</span>
        </button>

        <button
          onClick={() => setActiveTab('gateways')}
          className={`px-3.5 py-2 rounded-tenant-sm font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ml-auto ${
            activeTab === 'gateways'
              ? 'bg-primary text-primary-text shadow-sm'
              : 'text-tenantText-muted hover:text-tenantText-main'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Auditoria Stripe / Pix (AIE)</span>
        </button>
      </div>

      {/* Renderização Condicional da Saída Externa Ativa */}
      {activeTab === 'se01' && <SE01Receipt currentTenant={currentTenant} />}
      {activeTab === 'se02' && <SE02Revenue currentTenant={currentTenant} />}
      {activeTab === 'se03' && <SE03Productivity currentTenant={currentTenant} />}
      {activeTab === 'se04' && <SE04DRE currentTenant={currentTenant} />}
      {activeTab === 'gateways' && (
        <div className="space-y-4">
          <PaymentsPanel payments={mockPayments} />
        </div>
      )}
    </div>
  );
}
