import React, { useState } from 'react';
import { 
  PieChart, 
  TrendingUp, 
  DollarSign, 
  FileText, 
  ArrowUpRight, 
  ArrowDownRight, 
  Building2, 
  ShieldCheck, 
  Download, 
  Layers,
  HelpCircle,
  Percent
} from 'lucide-react';

export function SE04DRE({ currentTenant }) {
  // 1. Estado para modo de visualização (Sintético vs Analítico)
  const [viewMode, setViewMode] = useState('ANALYTIC'); // SYNTHETIC | ANALYTIC
  // 2. Estado para simulação de custos fixos adicionais
  const [extraFixedCost, setExtraFixedCost] = useState(0);
  // 3. Estado de exportação
  const [exported, setExported] = useState(false);

  // Dados Financeiros Multi-Tenant Simulados
  const tenantFinancials = {
    BARBER: {
      nome: 'Barbearia Vintage & Style',
      receitaBruta: 45680.00,
      deducoesImpostos: 2740.80, // 6% Simples Nacional
      custoInsumos: 4120.00, // Pomadas, óleos, lâminas descartáveis
      comissoesEquipe: 15980.00,
      custosFixosBase: 8500.00, // Aluguel, software, água, luz
      ticketMedio: 95.00,
      categorias: [
        { nome: 'Cabelo e Barba', receita: 28400.00, margemPerc: 68 },
        { nome: 'Barboterapia & Tratamentos', receita: 11280.00, margemPerc: 74 },
        { nome: 'Revenda de Produtos Cosméticos', receita: 6000.00, margemPerc: 45 }
      ]
    },
    CLINIC: {
      nome: 'Clínica Mente & Corpo',
      receitaBruta: 89400.00,
      deducoesImpostos: 7152.00, // 8% Simples/Lucro Presumido
      custoInsumos: 9400.00, // Luvas, agulhas, dermocosméticos, prontuário
      comissoesEquipe: 31290.00,
      custosFixosBase: 16800.00, // Aluguel comercial nobre, recepcionista, software
      ticketMedio: 220.00,
      categorias: [
        { nome: 'Consultas Médicas & Psiquiatria', receita: 46200.00, margemPerc: 78 },
        { nome: 'Procedimentos & Harmonização', receita: 31200.00, margemPerc: 62 },
        { nome: 'Sessões de Terapia & Nutrição', receita: 12000.00, margemPerc: 85 }
      ]
    }
  };

  const isBarber = currentTenant?.type === 'BARBER' || currentTenant?.id === 'TenantA';
  const activeData = isBarber ? tenantFinancials.BARBER : tenantFinancials.CLINIC;
  const benchmarkData = isBarber ? tenantFinancials.CLINIC : tenantFinancials.BARBER;

  // Cálculos do DRE (Fórmulas Matemáticas de SE)
  const receitaLiquida = activeData.receitaBruta - activeData.deducoesImpostos;
  const custosVariaveis = activeData.custoInsumos + activeData.comissoesEquipe;
  const margemContribuicao = receitaLiquida - custosVariaveis;
  const margemContribuicaoPerc = (margemContribuicao / receitaLiquida) * 100;

  const custosFixosTotal = activeData.custosFixosBase + Number(extraFixedCost);
  const lucroOperacionalEBITDA = margemContribuicao - custosFixosTotal;
  const margemEBITDAPerc = (lucroOperacionalEBITDA / receitaLiquida) * 100;

  // Calculadora de Ponto de Equilíbrio (Break-Even): Custos Fixos / (Margem Contribuição / Receita Líquida)
  const indiceMargem = margemContribuicao / receitaLiquida;
  const breakEvenReais = custosFixosTotal / indiceMargem;
  const breakEvenAtendimentos = Math.ceil(breakEvenReais / activeData.ticketMedio);

  // Benchmark Cálculo
  const benchmarkReceitaLiquida = benchmarkData.receitaBruta - benchmarkData.deducoesImpostos;
  const benchmarkCustosVariaveis = benchmarkData.custoInsumos + benchmarkData.comissoesEquipe;
  const benchmarkMargem = benchmarkReceitaLiquida - benchmarkCustosVariaveis;
  const benchmarkEbitda = benchmarkMargem - benchmarkData.custosFixosBase;
  const benchmarkMargemEbitdaPerc = (benchmarkEbitda / benchmarkReceitaLiquida) * 100;

  const handleExportDRE = () => {
    setExported(true);
    setTimeout(() => setExported(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Ficha Técnica APF */}
      <div className="glass-card p-5 rounded-tenant border border-primary/30 bg-primary/5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-surface-border pb-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary text-primary-text">
              SE-04
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
              Alta • 7 PFs
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div>
            <strong className="text-tenantText-main block mb-1">ALIs Referenciados (4 ARs):</strong>
            <ul className="text-tenantText-muted space-y-0.5 list-disc list-inside">
              <li><code className="text-primary font-mono">ALI_TENANTS</code> (Configuração & Custos)</li>
              <li><code className="text-primary font-mono">ALI_AGENDAMENTOS</code> (Receita Operacional)</li>
              <li><code className="text-primary font-mono">ALI_SERVICOS</code> (Categorização e Margens)</li>
              <li><code className="text-primary font-mono">ALI_CLIENTES</code> (Base Ativa de Clientes)</li>
            </ul>
          </div>
          <div>
            <strong className="text-tenantText-main block mb-1">Itens de Dados (15 DERs):</strong>
            <p className="text-tenantText-muted leading-relaxed">
              Tenant ID, Receita Bruta, Deduções Impostos, Receita Líquida, Custo Insumos, Comissões, Margem Contribuição R$, Margem %, Custos Fixos, Lucro EBITDA, Margem EBITDA %, Break-Even R$, Break-Even Atend., Benchmark Comparativo, Indicador Saúde.
            </p>
          </div>
          <div>
            <strong className="text-tenantText-main block mb-1">Cálculo & Lógica Matemática:</strong>
            <p className="text-tenantText-muted leading-relaxed">
              Estruturação em cascata do DRE contábil, derivação de Margem de Contribuição, cálculo de EBITDA e fórmula matemática de Ponto de Equilíbrio Operacional.
            </p>
          </div>
        </div>
      </div>

      {/* Funcionalidade 1: DRE Estruturado em Cascata */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Painel do DRE */}
        <div className="lg:col-span-8 glass-card p-6 rounded-tenant border border-surface-border space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-surface-border pb-3">
            <div>
              <h3 className="text-base font-bold font-heading text-tenantText-main flex items-center gap-2">
                <PieChart className="w-4 h-4 text-primary" />
                1. Demonstrativo de Resultado do Exercício (DRE Operacional)
              </h3>
              <p className="text-xs text-tenantText-muted">Apuração contábil em cascata para {activeData.nome}</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center bg-surface-dim p-1 rounded-tenant border border-surface-border text-xs">
                <button
                  onClick={() => setViewMode('SYNTHETIC')}
                  className={`px-3 py-1 rounded-tenant-sm font-semibold transition-all ${
                    viewMode === 'SYNTHETIC'
                      ? 'bg-primary text-primary-text'
                      : 'text-tenantText-muted hover:text-tenantText-main'
                  }`}
                >
                  Sintético
                </button>
                <button
                  onClick={() => setViewMode('ANALYTIC')}
                  className={`px-3 py-1 rounded-tenant-sm font-semibold transition-all ${
                    viewMode === 'ANALYTIC'
                      ? 'bg-primary text-primary-text'
                      : 'text-tenantText-muted hover:text-tenantText-main'
                  }`}
                >
                  Analítico
                </button>
              </div>

              {/* Funcionalidade 5: Exportação Estruturada do DRE */}
              <button
                onClick={handleExportDRE}
                className="py-1.5 px-3 rounded-tenant bg-primary-light text-primary hover:bg-primary hover:text-primary-text font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                {exported ? 'DRE Exportado!' : 'Exportar DRE'}
              </button>
            </div>
          </div>

          {/* Tabela do DRE em Cascata Financeira */}
          <div className="space-y-2 font-mono text-xs">
            {/* Linha 1: Receita Bruta */}
            <div className="p-2.5 rounded bg-surface-dim/40 flex justify-between font-bold text-tenantText-main">
              <span>(+) RECEITA OPERACIONAL BRUTA</span>
              <span>R$ {activeData.receitaBruta.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>

            {/* Linha 2: Deduções */}
            <div className="p-2 flex justify-between text-red-400 pl-6 text-[11px]">
              <span>(-) Deduções de Impostos & Tributos Fiscais</span>
              <span>- R$ {activeData.deducoesImpostos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>

            {/* Linha 3: Receita Líquida */}
            <div className="p-2.5 rounded bg-surface-dim/70 flex justify-between font-bold text-tenantText-main">
              <span>(=) RECEITA OPERACIONAL LÍQUIDA</span>
              <span>R$ {receitaLiquida.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>

            {/* Linha 4: Custos Variáveis (Insumos + Comissões) */}
            {viewMode === 'ANALYTIC' && (
              <>
                <div className="p-2 flex justify-between text-amber-500 pl-6 text-[11px]">
                  <span>(-) Custos de Insumos & Produtos Consumidos</span>
                  <span>- R$ {activeData.custoInsumos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="p-2 flex justify-between text-amber-500 pl-6 text-[11px]">
                  <span>(-) Repasse de Comissões da Equipe</span>
                  <span>- R$ {activeData.comissoesEquipe.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
              </>
            )}

            {/* Linha 5: Margem de Contribuição */}
            <div className="p-2.5 rounded bg-primary/10 border border-primary/20 flex justify-between font-bold text-primary">
              <span>(=) MARGEM DE CONTRIBUIÇÃO (R$ e %)</span>
              <span>R$ {margemContribuicao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} ({margemContribuicaoPerc.toFixed(1)}%)</span>
            </div>

            {/* Linha 6: Custos Fixos */}
            <div className="p-2 flex justify-between text-red-400 pl-6 text-[11px]">
              <span>(-) Custos Fixos Operacionais (Aluguel, TI, Energia)</span>
              <span>- R$ {custosFixosTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>

            {/* Linha 7: Lucro Operacional EBITDA */}
            <div className="p-3 rounded bg-emerald-500/10 border border-emerald-500/30 flex justify-between font-bold text-emerald-500 text-sm">
              <span>(=) LUCRO OPERACIONAL EBITDA</span>
              <span>R$ {lucroOperacionalEBITDA.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} ({margemEBITDAPerc.toFixed(1)}%)</span>
            </div>
          </div>
        </div>

        {/* Coluna Lateral: Break-Even & Categorias (Funcionalidades 2 e 3) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Funcionalidade 3: Calculadora de Ponto de Equilíbrio */}
          <div className="glass-card p-5 rounded-tenant border border-surface-border space-y-3">
            <h4 className="font-bold text-xs font-heading text-tenantText-main flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-primary" />
              3. Ponto de Equilíbrio (Break-Even Point)
            </h4>
            <div className="p-3 rounded bg-surface-dim/60 space-y-1.5 text-xs">
              <div className="flex justify-between text-tenantText-muted">
                <span>Faturamento Mínimo Necessário:</span>
                <span className="font-bold font-mono text-tenantText-main">
                  R$ {breakEvenReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between text-tenantText-muted">
                <span>Atendimentos Mínimos no Mês:</span>
                <span className="font-bold font-mono text-primary">
                  {breakEvenAtendimentos} atendimentos
                </span>
              </div>
              <div className="flex justify-between text-tenantText-muted pt-1 border-t border-surface-border">
                <span>Margem de Segurança Atual:</span>
                <span className="font-bold text-emerald-500">
                  +{(((activeData.receitaBruta - breakEvenReais) / breakEvenReais) * 100).toFixed(0)}%
                </span>
              </div>
            </div>

            {/* Simulador de Custo Fixo Extra */}
            <div className="space-y-1 pt-1">
              <label className="text-[11px] text-tenantText-muted flex justify-between">
                <span>Simular Investimento Fixo Adicional:</span>
                <span className="font-mono text-primary">+ R$ {extraFixedCost}</span>
              </label>
              <input
                type="range"
                min="0"
                max="5000"
                step="500"
                value={extraFixedCost}
                onChange={(e) => setExtraFixedCost(Number(e.target.value))}
                className="w-full accent-primary cursor-pointer"
              />
            </div>
          </div>

          {/* Funcionalidade 2: Margem de Contribuição por Categoria */}
          <div className="glass-card p-5 rounded-tenant border border-surface-border space-y-3">
            <h4 className="font-bold text-xs font-heading text-tenantText-main flex items-center gap-1.5">
              <Percent className="w-4 h-4 text-primary" />
              2. Margem de Rentabilidade por Categoria
            </h4>

            <div className="space-y-2 text-xs">
              {activeData.categorias.map((cat, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="font-semibold text-tenantText-main">{cat.nome}</span>
                    <span className="text-primary font-mono">{cat.margemPerc}% margem</span>
                  </div>
                  <div className="w-full bg-surface-dim h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-primary h-full rounded-full" 
                      style={{ width: `${cat.margemPerc}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Funcionalidade 4: Comparativo Multi-Tenant (Benchmarking) */}
      <div className="glass-card p-6 rounded-tenant border border-surface-border space-y-4">
        <h3 className="text-base font-bold font-heading text-tenantText-main flex items-center gap-2 border-b border-surface-border pb-3">
          <Building2 className="w-4 h-4 text-primary" />
          4. Benchmarking Comparativo Multi-Tenant (Barbearia vs Clínica)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Tenant 1: Ativo */}
          <div className="p-4 rounded-tenant bg-primary/5 border border-primary/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-tenantText-main">{activeData.nome} (Ativo)</span>
              <span className="px-2 py-0.5 rounded bg-primary text-primary-text font-bold text-[10px]">
                Tenant Atual
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-tenantText-muted pt-1">
              <div>Receita Bruta: <span className="font-mono text-tenantText-main font-bold block">R$ {activeData.receitaBruta.toFixed(2)}</span></div>
              <div>Ticket Médio: <span className="font-mono text-tenantText-main font-bold block">R$ {activeData.ticketMedio.toFixed(2)}</span></div>
              <div>Margem EBITDA: <span className="font-mono text-emerald-500 font-bold block">{margemEBITDAPerc.toFixed(1)}%</span></div>
              <div>Lucro Operacional: <span className="font-mono text-emerald-500 font-bold block">R$ {lucroOperacionalEBITDA.toFixed(2)}</span></div>
            </div>
          </div>

          {/* Tenant 2: Benchmark */}
          <div className="p-4 rounded-tenant bg-surface-dim/40 border border-surface-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-tenantText-main">{benchmarkData.nome}</span>
              <span className="px-2 py-0.5 rounded bg-surface-dim text-tenantText-muted font-bold text-[10px] border border-surface-border">
                Tenant Comparativo
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-tenantText-muted pt-1">
              <div>Receita Bruta: <span className="font-mono text-tenantText-main font-bold block">R$ {benchmarkData.receitaBruta.toFixed(2)}</span></div>
              <div>Ticket Médio: <span className="font-mono text-tenantText-main font-bold block">R$ {benchmarkData.ticketMedio.toFixed(2)}</span></div>
              <div>Margem EBITDA: <span className="font-mono text-emerald-500 font-bold block">{benchmarkMargemEbitdaPerc.toFixed(1)}%</span></div>
              <div>Lucro Operacional: <span className="font-mono text-emerald-500 font-bold block">R$ {benchmarkEbitda.toFixed(2)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
