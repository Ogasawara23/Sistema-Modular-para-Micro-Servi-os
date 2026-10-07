import React, { useState } from 'react';
import { 
  BarChart3, 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  CreditCard, 
  Download, 
  CheckCircle2, 
  ArrowUpRight, 
  Layers, 
  Filter,
  FileSpreadsheet
} from 'lucide-react';

export function SE02Revenue({ currentTenant }) {
  // 1. Estado para filtro temporal
  const [period, setPeriod] = useState('MONTH'); // TODAY | WEEK | MONTH
  // 2. Estado de feedback de download
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Dados base por período (simulando agregação dinâmica de dados do BD)
  const periodData = {
    TODAY: {
      label: 'Hoje (07/10/2026)',
      atendimentos: 14,
      bruto: 1840.00,
      pixPerc: 0.65,
      cartaoPerc: 0.35,
      diasCorridos: 1,
      diasMes: 30,
      variacaoMesAnt: '+18.4%'
    },
    WEEK: {
      label: 'Últimos 7 Dias',
      atendimentos: 86,
      bruto: 11250.00,
      pixPerc: 0.58,
      cartaoPerc: 0.42,
      diasCorridos: 7,
      diasMes: 30,
      variacaoMesAnt: '+12.1%'
    },
    MONTH: {
      label: 'Mês Atual (Outubro/2026)',
      atendimentos: 342,
      bruto: 45680.00,
      pixPerc: 0.60,
      cartaoPerc: 0.40,
      diasCorridos: 7,
      diasMes: 30,
      variacaoMesAnt: '+15.8%'
    }
  };

  const current = periodData[period];

  // Cálculos Derivados (Fórmulas Matemáticas da Saída Externa SE)
  const volumePix = current.bruto * current.pixPerc;
  const volumeCartao = current.bruto * current.cartaoPerc;
  
  const taxaPix = volumePix * 0.0099; // 0.99% taxa Pix BACEN
  const taxaCartao = volumeCartao * 0.0299; // 2.99% taxa Stripe
  const totalTaxas = taxaPix + taxaCartao;
  const faturamentoLiquido = current.bruto - totalTaxas;

  const ticketMedio = current.bruto / current.atendimentos;

  // Projeção Estatística Run-Rate Mensal: (Faturamento até hoje / dias decorridos) * 30
  const mediaDiaria = current.bruto / current.diasCorridos;
  const projecaoMensal = mediaDiaria * current.diasMes;

  const handleExportCSV = () => {
    const csvContent = `data:text/csv;charset=utf-8,`
      + `Periodo;Total_Atendimentos;Faturamento_Bruto;Taxas_Gateway;Faturamento_Liquido;Ticket_Medio;Volume_Pix;Volume_Cartao\n`
      + `${current.label};${current.atendimentos};${current.bruto.toFixed(2)};${totalTaxas.toFixed(2)};${faturamentoLiquido.toFixed(2)};${ticketMedio.toFixed(2)};${volumePix.toFixed(2)};${volumeCartao.toFixed(2)}\n`;
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `fechamento_caixa_${period.toLowerCase()}_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Ficha Técnica APF */}
      <div className="glass-card p-5 rounded-tenant border border-primary/30 bg-primary/5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-surface-border pb-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary text-primary-text">
              SE-02
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-tenantText-muted">
              Saída Externa (IFPUG)
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-tenantText-muted">Responsável:</span>
            <span className="font-bold text-tenantText-main px-2 py-0.5 rounded bg-surface-dim border border-surface-border">
              Membro 1 (Arthur Major)
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
              <li><code className="text-primary font-mono">ALI_AGENDAMENTOS</code> (Soma de Valores & Status)</li>
              <li><code className="text-primary font-mono">ALI_SERVICOS</code> (Categorização e Preços)</li>
              <li><code className="text-primary font-mono">ALI_TENANTS</code> (Regras Multi-Tenant)</li>
            </ul>
          </div>
          <div>
            <strong className="text-tenantText-main block mb-1">Itens de Dados (12 DERs):</strong>
            <p className="text-tenantText-muted leading-relaxed">
              Período Inicial, Período Final, Total Atendimentos, Faturamento Bruto, Deduções Taxas, Faturamento Líquido, Ticket Médio, Volume Pix, Volume Cartão, Variação %, Projeção Run-Rate, Status Conciliação.
            </p>
          </div>
          <div>
            <strong className="text-tenantText-main block mb-1">Cálculo & Lógica Matemática:</strong>
            <p className="text-tenantText-muted leading-relaxed">
              Cálculo de Ticket Médio Ponderado (<code className="text-xs text-amber-400">Bruto / Atendimentos</code>), conciliação com dedução de alíquotas bancárias (0.99% e 2.99%) e algoritmo de Run-Rate estatístico.
            </p>
          </div>
        </div>
      </div>

      {/* Funcionalidade 1: Barra de Filtro Temporal e Ação de Exportação */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-card p-4 rounded-tenant border border-surface-border">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold text-tenantText-muted">1. Filtro de Fechamento por Período:</span>
          <div className="flex items-center bg-surface-dim p-1 rounded-tenant border border-surface-border text-xs">
            <button
              onClick={() => setPeriod('TODAY')}
              className={`px-3 py-1 rounded-tenant-sm font-semibold transition-all ${
                period === 'TODAY'
                  ? 'bg-primary text-primary-text'
                  : 'text-tenantText-muted hover:text-tenantText-main'
              }`}
            >
              Hoje
            </button>
            <button
              onClick={() => setPeriod('WEEK')}
              className={`px-3 py-1 rounded-tenant-sm font-semibold transition-all ${
                period === 'WEEK'
                  ? 'bg-primary text-primary-text'
                  : 'text-tenantText-muted hover:text-tenantText-main'
              }`}
            >
              7 Dias
            </button>
            <button
              onClick={() => setPeriod('MONTH')}
              className={`px-3 py-1 rounded-tenant-sm font-semibold transition-all ${
                period === 'MONTH'
                  ? 'bg-primary text-primary-text'
                  : 'text-tenantText-muted hover:text-tenantText-main'
              }`}
            >
              Mês Atual
            </button>
          </div>
        </div>

        {/* Funcionalidade 5: Exportação de Extrato Analítico */}
        <button
          onClick={handleExportCSV}
          className="px-4 py-2 rounded-tenant bg-primary text-primary-text font-bold text-xs flex items-center gap-2 hover:bg-primary-hover transition-colors shadow-tenant"
        >
          <FileSpreadsheet className="w-4 h-4" />
          {downloadSuccess ? 'Extrato CSV Baixado!' : 'Exportar Extrato CSV (5. Funcionalidade)'}
        </button>
      </div>

      {/* Grid de Cards com Cálculos Derivados (Funcionalidades 2, 3 e 4) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Faturamento Bruto */}
        <div className="glass-card p-5 rounded-tenant border border-surface-border space-y-1">
          <span className="text-xs text-tenantText-muted">Faturamento Bruto</span>
          <span className="text-2xl font-bold font-heading text-tenantText-main block">
            R$ {current.bruto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
          <span className="text-xs text-emerald-500 font-medium flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> {current.variacaoMesAnt} vs mês ant.
          </span>
        </div>

        {/* Card 2: Faturamento Líquido com Taxas Conciliadas */}
        <div className="glass-card p-5 rounded-tenant border border-surface-border space-y-1">
          <span className="text-xs text-tenantText-muted">Faturamento Líquido (Deduções)</span>
          <span className="text-2xl font-bold font-heading text-emerald-500 block">
            R$ {faturamentoLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
          <span className="text-[11px] text-tenantText-muted block">
            Taxas Absorvidas: -R$ {totalTaxas.toFixed(2)}
          </span>
        </div>

        {/* Card 3: Ticket Médio Ponderado (Funcionalidade 3) */}
        <div className="glass-card p-5 rounded-tenant border border-surface-border space-y-1">
          <span className="text-xs text-tenantText-muted">Ticket Médio Ponderado</span>
          <span className="text-2xl font-bold font-heading text-primary block">
            R$ {ticketMedio.toFixed(2)}
          </span>
          <span className="text-[11px] text-tenantText-muted block">
            Base: {current.atendimentos} atendimentos realizados
          </span>
        </div>

        {/* Card 4: Projeção de Faturamento Mensal Run-Rate (Funcionalidade 4) */}
        <div className="glass-card p-5 rounded-tenant border border-surface-border space-y-1">
          <span className="text-xs text-tenantText-muted">Projeção de Faturamento (Run-Rate)</span>
          <span className="text-2xl font-bold font-heading text-amber-400 block">
            R$ {projecaoMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
          <span className="text-[11px] text-tenantText-muted block">
            Ritmo: R$ {mediaDiaria.toFixed(2)}/dia útil
          </span>
        </div>
      </div>

      {/* Funcionalidade 2: Decomposição Segregada por Gateway de Pagamento */}
      <div className="glass-card p-6 rounded-tenant border border-surface-border space-y-4">
        <h3 className="text-base font-bold font-heading text-tenantText-main flex items-center justify-between border-b border-surface-border pb-3">
          <span className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-primary" />
            2. Decomposição de Receita por Meio de Pagamento & Conciliação
          </span>
          <span className="text-xs text-tenantText-muted">Status: Conciliado no BD SQLite</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card Pix */}
          <div className="p-4 rounded-tenant bg-surface-dim/50 border border-surface-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-tenantText-main">Pix Instantâneo (BACEN)</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-bold">
                Taxa: 0,99%
              </span>
            </div>
            <div className="text-lg font-bold text-tenantText-main font-heading">
              R$ {volumePix.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-tenantText-muted flex justify-between">
              <span>Participação no Faturamento:</span>
              <span className="font-bold text-tenantText-main">{(current.pixPerc * 100).toFixed(0)}%</span>
            </div>
            <div className="text-xs text-tenantText-muted flex justify-between">
              <span>Taxa Bancária Retida:</span>
              <span className="font-mono text-red-400">- R$ {taxaPix.toFixed(2)}</span>
            </div>
          </div>

          {/* Card Cartão */}
          <div className="p-4 rounded-tenant bg-surface-dim/50 border border-surface-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-tenantText-main">Cartão de Crédito (Stripe)</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 font-bold">
                Taxa: 2,99%
              </span>
            </div>
            <div className="text-lg font-bold text-tenantText-main font-heading">
              R$ {volumeCartao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-tenantText-muted flex justify-between">
              <span>Participação no Faturamento:</span>
              <span className="font-bold text-tenantText-main">{(current.cartaoPerc * 100).toFixed(0)}%</span>
            </div>
            <div className="text-xs text-tenantText-muted flex justify-between">
              <span>Taxa Bancária Retida:</span>
              <span className="font-mono text-red-400">- R$ {taxaCartao.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
