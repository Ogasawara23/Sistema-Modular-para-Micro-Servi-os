import React, { useState, useEffect } from 'react';
import { SimulatedAPI } from '../mocks/SimulatedAPI';
import { useAuth } from '../context/AuthContext';
import { DollarSign, Calendar, Users, TrendingUp, Clock, CheckCircle2, Scissors, Stethoscope, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function DashboardPage() {
  const { tenantId, tenantName, user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    SimulatedAPI.getDashboardStats().then((data) => {
      setStats(data);
      setLoading(false);
    });
  }, [tenantId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-card p-6 rounded-tenant border border-surface-border flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary-light text-primary uppercase">
            {tenantId} • {tenantId === 'TenantA' ? 'Barbearia Vintage' : 'Clínica Mente & Corpo'}
          </span>
          <h1 className="text-2xl font-bold font-heading text-tenantText-main mt-1">
            Painel Geral — {tenantName}
          </h1>
          <p className="text-xs text-tenantText-muted mt-0.5">
            Bem-vindo de volta, {user?.name}. Aqui está o resumo das suas operações hoje.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/calendar"
            className="px-4 py-2 rounded-tenant bg-primary text-primary-text font-semibold hover:bg-primary-hover transition-colors text-sm shadow-tenant flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" /> Ver Agenda
          </Link>
          <Link
            to="/checkout"
            className="px-4 py-2 rounded-tenant bg-surface-dim border border-surface-border font-semibold hover:bg-surface-dim/80 text-tenantText-main text-sm flex items-center gap-2"
          >
            <DollarSign className="w-4 h-4 text-emerald-500" /> Novo Checkout
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-card p-5 rounded-tenant border border-surface-border space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-tenantText-muted">Faturamento Mensal</span>
            <div className="p-2 rounded-tenant bg-emerald-500/10 text-emerald-500">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-bold font-heading text-tenantText-main block">
            {stats.monthlyRevenue}
          </span>
          <span className="text-xs text-emerald-500 font-medium flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> {stats.revenueChange}
          </span>
        </div>

        <div className="glass-card p-5 rounded-tenant border border-surface-border space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-tenantText-muted">Agendamentos</span>
            <div className="p-2 rounded-tenant bg-primary-light text-primary">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-bold font-heading text-tenantText-main block">
            {stats.totalAppointments}
          </span>
          <span className="text-xs text-tenantText-muted">Este mês</span>
        </div>

        <div className="glass-card p-5 rounded-tenant border border-surface-border space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-tenantText-muted">Clientes Ativos</span>
            <div className="p-2 rounded-tenant bg-amber-500/10 text-amber-500">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-bold font-heading text-tenantText-main block">
            {stats.activeClients}
          </span>
          <span className="text-xs text-tenantText-muted">Cadastrados no tenant</span>
        </div>

        <div className="glass-card p-5 rounded-tenant border border-surface-border space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-tenantText-muted">Taxa de Ocupação</span>
            <div className="p-2 rounded-tenant bg-sky-500/10 text-sky-500">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-bold font-heading text-tenantText-main block">
            {stats.occupancyRate}
          </span>
          <span className="text-xs text-emerald-500 font-medium">Horários otimizados</span>
        </div>
      </div>

      {/* Upcoming Appointments Table */}
      <div className="glass-card p-6 rounded-tenant border border-surface-border space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold font-heading text-lg text-tenantText-main">
            Próximos Agendamentos de Hoje
          </h3>
          <Link to="/calendar" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
            Ver Todos <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-surface-border">
          {stats.upcomingToday?.map((apt, idx) => (
            <div key={idx} className="py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-surface-dim/20 px-3 rounded-tenant transition-colors">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-tenant bg-primary-light font-bold text-primary text-xs">
                  {apt.time}
                </span>
                <div>
                  <h4 className="font-semibold text-sm text-tenantText-main">{apt.client}</h4>
                  <p className="text-xs text-tenantText-muted">{apt.service} • {apt.professional}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <span className="text-tenantText-muted font-medium">
                  Sinal/Pagamento: <strong className="text-tenantText-main">{apt.depositPaid}</strong>
                </span>
                <span className="px-2.5 py-0.5 rounded-full font-semibold bg-emerald-500/20 text-emerald-500 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> {apt.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
