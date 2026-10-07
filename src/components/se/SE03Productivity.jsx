import React, { useState } from 'react';
import { 
  Users, 
  Clock, 
  Percent, 
  Award, 
  TrendingUp, 
  Sliders, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowUpDown,
  DollarSign,
  UserCheck
} from 'lucide-react';

export function SE03Productivity({ currentTenant }) {
  // 1. Estado para meta de produtividade (Simulador Interativo)
  const [targetGoal, setTargetGoal] = useState(6000);
  // 2. Estado para ordenação do ranking
  const [sortBy, setSortBy] = useState('revenue'); // revenue | occupancy | appointments

  // Dados mockados estruturados dos profissionais (simulando junção com SQLite)
  const teamMembers = [
    {
      id: 'PROF-01',
      name: 'Carlos Oliveira (Navalha de Ouro)',
      role: 'Master Barber / Cirurgião',
      horasDisponiveis: 160,
      horasTrabalhadas: 136,
      atendimentos: 102,
      noShows: 4,
      faturamentoBruto: 9690.00,
      aliquotaBase: 0.40, // 40%
    },
    {
      id: 'PROF-02',
      name: 'Mariana Duarte (Especialista)',
      role: 'Barber & Visagista / Terapeuta',
      horasDisponiveis: 160,
      horasTrabalhadas: 120,
      atendimentos: 85,
      noShows: 7,
      faturamentoBruto: 7225.00,
      aliquotaBase: 0.35, // 35%
    },
    {
      id: 'PROF-03',
      name: 'Felipe Santos (Estilista)',
      role: 'Colorista & Barba / Dermatologista',
      horasDisponiveis: 140,
      horasTrabalhadas: 84,
      atendimentos: 56,
      noShows: 11,
      faturamentoBruto: 4760.00,
      aliquotaBase: 0.30, // 30%
    },
    {
      id: 'PROF-04',
      name: 'Camila Rocha (Junior)',
      role: 'Assistente / Clínica Geral',
      horasDisponiveis: 120,
      horasTrabalhadas: 66,
      atendimentos: 44,
      noShows: 3,
      faturamentoBruto: 3080.00,
      aliquotaBase: 0.25, // 25%
    }
  ];

  // Cálculos Derivados (Processamento Matemático de SE)
  const processedTeam = teamMembers.map((m) => {
    // 1. Taxa de Ocupação Horária
    const taxaOcupacao = (m.horasTrabalhadas / m.horasDisponiveis) * 100;
    // 2. Taxa de Absenteísmo / No-Show
    const totalAgendados = m.atendimentos + m.noShows;
    const taxaAbsenteismo = (m.noShows / totalAgendados) * 100;
    // 3. Comissão Base
    const comissaoBase = m.faturamentoBruto * m.aliquotaBase;
    // 4. Bônus por Bater a Meta (Simulador)
    const bateuMeta = m.faturamentoBruto >= targetGoal;
    const bonusExtra = bateuMeta ? m.faturamentoBruto * 0.05 : 0; // +5% de bônus
    const repasseFinal = comissaoBase + bonusExtra;

    return {
      ...m,
      taxaOcupacao,
      taxaAbsenteismo,
      comissaoBase,
      bateuMeta,
      bonusExtra,
      repasseFinal
    };
  });

  // Ordenação Dinâmica (Funcionalidade 5)
  const sortedTeam = [...processedTeam].sort((a, b) => {
    if (sortBy === 'occupancy') return b.taxaOcupacao - a.taxaOcupacao;
    if (sortBy === 'appointments') return b.atendimentos - a.atendimentos;
    return b.faturamentoBruto - a.faturamentoBruto;
  });

  // Agregados Globais da Clínica/Barbearia
  const totalHorasDisp = teamMembers.reduce((acc, m) => acc + m.horasDisponiveis, 0);
  const totalHorasTrab = teamMembers.reduce((acc, m) => acc + m.horasTrabalhadas, 0);
  const ocupacaoGeral = (totalHorasTrab / totalHorasDisp) * 100;

  const totalAtendimentosGlobal = teamMembers.reduce((acc, m) => acc + m.atendimentos, 0);
  const totalNoShowsGlobal = teamMembers.reduce((acc, m) => acc + m.noShows, 0);
  const noShowGeral = (totalNoShowsGlobal / (totalAtendimentosGlobal + totalNoShowsGlobal)) * 100;

  const totalComissoesGeral = processedTeam.reduce((acc, m) => acc + m.repasseFinal, 0);

  return (
    <div className="space-y-6">
      {/* Ficha Técnica APF */}
      <div className="glass-card p-5 rounded-tenant border border-primary/30 bg-primary/5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-surface-border pb-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary text-primary-text">
              SE-03
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-tenantText-muted">
              Saída Externa (IFPUG)
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-tenantText-muted">Responsável:</span>
            <span className="font-bold text-tenantText-main px-2 py-0.5 rounded bg-surface-dim border border-surface-border">
              Membro 2 (Dupla)
            </span>
            <span className="font-bold text-emerald-500 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
              Média • 5 PFs
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div>
            <strong className="text-tenantText-main block mb-1">ALIs Referenciados (3 ARs):</strong>
            <ul className="text-tenantText-muted space-y-0.5 list-disc list-inside">
              <li><code className="text-primary font-mono">ALI_DISPONIBILIDADE</code> (Escala & Horários)</li>
              <li><code className="text-primary font-mono">ALI_AGENDAMENTOS</code> (Reservas & No-Shows)</li>
              <li><code className="text-primary font-mono">ALI_SERVICOS</code> (Base de Comissionamento)</li>
            </ul>
          </div>
          <div>
            <strong className="text-tenantText-main block mb-1">Itens de Dados (13 DERs):</strong>
            <p className="text-tenantText-muted leading-relaxed">
              ID Profissional, Nome, Cargo, Horas Disponíveis, Horas Trabalhadas, Taxa Ocupação, Atendimentos, No-Shows, Taxa Absenteísmo, Faturamento Bruto, Alíquota Base, Comissão, Bônus Meta.
            </p>
          </div>
          <div>
            <strong className="text-tenantText-main block mb-1">Cálculo & Lógica Matemática:</strong>
            <p className="text-tenantText-muted leading-relaxed">
              Cálculo da Taxa de Ocupação (<code className="text-xs text-amber-400">Horas_Trab / Horas_Disp * 100</code>), apuração de No-Show, comissionamento progressivo e algoritmo de bônus condicional.
            </p>
          </div>
        </div>
      </div>

      {/* Grid de Indicadores de Produtividade Global (Funcionalidades 1 e 2) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card Ocupação Horária Global */}
        <div className="glass-card p-5 rounded-tenant border border-surface-border space-y-1">
          <span className="text-xs text-tenantText-muted flex items-center justify-between">
            <span>1. Taxa de Ocupação Global</span>
            <Clock className="w-3.5 h-3.5 text-primary" />
          </span>
          <span className="text-2xl font-bold font-heading text-tenantText-main block">
            {ocupacaoGeral.toFixed(1)}%
          </span>
          <div className="w-full bg-surface-dim h-2 rounded-full overflow-hidden mt-2">
            <div 
              className="bg-primary h-full transition-all duration-500 rounded-full" 
              style={{ width: `${ocupacaoGeral}%` }}
            />
          </div>
          <span className="text-[11px] text-tenantText-muted block pt-1">
            {totalHorasTrab}h produtivas de {totalHorasDisp}h disponíveis
          </span>
        </div>

        {/* Card No-Show e Absenteísmo */}
        <div className="glass-card p-5 rounded-tenant border border-surface-border space-y-1">
          <span className="text-xs text-tenantText-muted flex items-center justify-between">
            <span>2. Índice de No-Show / Cancelamentos</span>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
          </span>
          <span className="text-2xl font-bold font-heading text-amber-500 block">
            {noShowGeral.toFixed(1)}%
          </span>
          <span className="text-[11px] text-tenantText-muted block">
            {totalNoShowsGlobal} cancelamentos sobre {totalAtendimentosGlobal + totalNoShowsGlobal} agendados
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 inline-block font-semibold mt-1">
            Status: Risco Operacional Controlado
          </span>
        </div>

        {/* Card Repasse Total de Comissões */}
        <div className="glass-card p-5 rounded-tenant border border-surface-border space-y-1">
          <span className="text-xs text-tenantText-muted flex items-center justify-between">
            <span>3. Total em Comissões & Repasses</span>
            <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
          </span>
          <span className="text-2xl font-bold font-heading text-emerald-500 block">
            R$ {totalComissoesGeral.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
          <span className="text-[11px] text-tenantText-muted block">
            Inclui comissões contratuais e bônus de metas ativas
          </span>
        </div>
      </div>

      {/* Funcionalidade 4: Simulador Interativo de Metas de Produtividade */}
      <div className="glass-card p-6 rounded-tenant border border-surface-border space-y-4 bg-surface-dim/40">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold font-heading text-tenantText-main flex items-center gap-2">
              <Sliders className="w-4 h-4 text-primary" />
              4. Simulador Interativo de Metas de Faturamento & Bônus Extra (+5%)
            </h3>
            <p className="text-xs text-tenantText-muted mt-0.5">
              Ajuste o controle deslizante para simular o gatilho de bonificação e ver o recálculo em tempo real dos repasses.
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-tenantText-muted block">Meta de Faturamento Individual:</span>
            <span className="text-xl font-bold font-heading text-primary">
              R$ {Number(targetGoal).toLocaleString('pt-BR')},00
            </span>
          </div>
        </div>

        <input
          type="range"
          min="2000"
          max="10000"
          step="500"
          value={targetGoal}
          onChange={(e) => setTargetGoal(Number(e.target.value))}
          className="w-full accent-primary cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-tenantText-muted font-mono">
          <span>R$ 2.000 (Mínimo)</span>
          <span>R$ 6.000 (Padrão)</span>
          <span>R$ 10.000 (Elite)</span>
        </div>
      </div>

      {/* Funcionalidade 5: Tabela de Comissionamento & Ranking com Ordenação */}
      <div className="glass-card p-6 rounded-tenant border border-surface-border space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-surface-border pb-3">
          <div>
            <h3 className="text-base font-bold font-heading text-tenantText-main flex items-center gap-2">
              <Award className="w-4 h-4 text-primary" />
              5. Tabela Detalhada de Produtividade & Repasse por Profissional
            </h3>
            <p className="text-xs text-tenantText-muted">Ordenação e rateio calculados dinamicamente.</p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-tenantText-muted">Ordenar por:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs p-1.5 rounded-tenant bg-surface-dim border border-surface-border text-tenantText-main font-semibold"
            >
              <option value="revenue">Faturamento Bruto</option>
              <option value="occupancy">Taxa de Ocupação (%)</option>
              <option value="appointments">Qtd. Atendimentos</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-surface-border text-tenantText-muted font-semibold">
                <th className="py-2.5 px-3">Profissional</th>
                <th className="py-2.5 px-3">Horas (Trab/Disp)</th>
                <th className="py-2.5 px-3">Ocupação</th>
                <th className="py-2.5 px-3">Atendimentos</th>
                <th className="py-2.5 px-3">Faturamento</th>
                <th className="py-2.5 px-3">Taxa Base</th>
                <th className="py-2.5 px-3">Bônus Meta</th>
                <th className="py-2.5 px-3 text-right">Repasse Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {sortedTeam.map((member, idx) => (
                <tr key={member.id} className="hover:bg-surface-dim/30 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-bold text-tenantText-main">{member.name}</div>
                    <div className="text-[10px] text-tenantText-muted">{member.role}</div>
                  </td>
                  <td className="py-3 px-3 font-mono">
                    {member.horasTrabalhadas}h / {member.horasDisponiveis}h
                  </td>
                  <td className="py-3 px-3">
                    <span className={`font-bold font-mono px-2 py-0.5 rounded text-[11px] ${
                      member.taxaOcupacao >= 75
                        ? 'bg-emerald-500/10 text-emerald-500'
                        : member.taxaOcupacao >= 50
                        ? 'bg-blue-500/10 text-blue-500'
                        : 'bg-amber-500/10 text-amber-500'
                    }`}>
                      {member.taxaOcupacao.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono">
                    {member.atendimentos} atend.
                    <span className="text-[10px] text-amber-500 block">({member.noShows} faltas)</span>
                  </td>
                  <td className="py-3 px-3 font-bold text-tenantText-main font-mono">
                    R$ {member.faturamentoBruto.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 font-mono text-tenantText-muted">
                    {(member.aliquotaBase * 100).toFixed(0)}%
                  </td>
                  <td className="py-3 px-3">
                    {member.bateuMeta ? (
                      <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-500 font-bold flex items-center gap-1 w-fit">
                        <CheckCircle2 className="w-3 h-3" /> +R$ {member.bonusExtra.toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-[10px] text-tenantText-muted italic">Abaixo da meta</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-emerald-500 font-mono text-sm">
                    R$ {member.repasseFinal.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
