import React, { useState, useEffect } from 'react';
import { SimulatedAPI } from '../mocks/SimulatedAPI';
import { useAuth } from '../context/AuthContext';
import { FeatureGate } from '../components/common/FeatureGate';
import { BarChart3, DollarSign, Percent, TrendingUp, Download, CreditCard, ShieldCheck } from 'lucide-react';
import { PaymentsPanel } from '../components/readonly/PaymentsPanel';
import { mockPayments } from '../data/mockData';

export function ReportsPage() {
  const { tenantId, tenantName } = useAuth();
  const [reports, setReports] = useState(null);
  const [activeTab, setActiveTab] = useState('commissions'); // 'commissions' | 'gateways'

  useEffect(() => {
    SimulatedAPI.getReports().then(setReports);
  }, [tenantId]);

  return (
    <FeatureGate
      flagName="hasCommission"
      title="Relatórios Financeiros & Comissões de Profissionais"
      description="Este tenant não tem acesso ao módulo de comissionamento avançado e repasses."
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-heading text-tenantText-main flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-primary" /> Relatórios & Repasse de Comissões
            </h1>
            <p className="text-xs text-tenantText-muted mt-0.5">
              Demonstrativo financeiro e cálculo automático de comissões ({tenantName}).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-surface-dim/40 p-1 rounded-tenant border border-surface-border text-xs">
              <button
                onClick={() => setActiveTab('commissions')}
                className={`px-3 py-1.5 rounded-tenant-sm font-semibold transition-all ${
                  activeTab === 'commissions'
                    ? 'bg-primary text-primary-text shadow-sm'
                    : 'text-tenantText-muted hover:text-tenantText-main'
                }`}
              >
                Comissões da Equipe
              </button>
              <button
                onClick={() => setActiveTab('gateways')}
                className={`px-3 py-1.5 rounded-tenant-sm font-semibold transition-all flex items-center gap-1 ${
                  activeTab === 'gateways'
                    ? 'bg-primary text-primary-text shadow-sm'
                    : 'text-tenantText-muted hover:text-tenantText-main'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" /> Auditoria Stripe / Pix
              </button>
            </div>

            <button className="px-4 py-2 rounded-tenant bg-primary text-primary-text font-bold hover:bg-primary-hover transition-colors shadow-tenant text-sm flex items-center gap-2">
              <Download className="w-4 h-4" /> Exportar PDF
            </button>
          </div>
        </div>

        {activeTab === 'gateways' ? (
          <div className="space-y-4">
            <PaymentsPanel payments={mockPayments} />
          </div>
        ) : reports && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="glass-card p-5 rounded-tenant border border-surface-border space-y-1">
                <span className="text-xs text-tenantText-muted">Faturamento Bruto</span>
                <span className="text-2xl font-bold font-heading text-tenantText-main block">
                  R$ {reports.monthlyTotal.toLocaleString('pt-BR')},00
                </span>
              </div>
              <div className="glass-card p-5 rounded-tenant border border-surface-border space-y-1">
                <span className="text-xs text-tenantText-muted">Total em Comissões</span>
                <span className="text-2xl font-bold font-heading text-amber-500 block">
                  R$ {reports.totalCommissionsPaid.toLocaleString('pt-BR')},00
                </span>
              </div>
              <div className="glass-card p-5 rounded-tenant border border-surface-border space-y-1">
                <span className="text-xs text-tenantText-muted">Receita Líquida Tenant</span>
                <span className="text-2xl font-bold font-heading text-emerald-500 block">
                  R$ {reports.netRevenue.toLocaleString('pt-BR')},00
                </span>
              </div>
            </div>

            <div className="glass-card p-6 rounded-tenant border border-surface-border space-y-4">
              <h3 className="font-bold font-heading text-base text-tenantText-main">
                Detalhamento de Comissões por Profissional
              </h3>

              <div className="divide-y divide-surface-border">
                {reports.commissionsBreakdown?.map((prof, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between hover:bg-surface-dim/20 px-3 rounded-tenant transition-colors text-xs">
                    <div>
                      <h4 className="font-bold text-sm text-tenantText-main">{prof.name}</h4>
                      <p className="text-tenantText-muted">{prof.role} • Taxa: {prof.rate}</p>
                    </div>
                    <span className="font-bold text-sm text-emerald-500 font-heading">{prof.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </FeatureGate>
  );
}
