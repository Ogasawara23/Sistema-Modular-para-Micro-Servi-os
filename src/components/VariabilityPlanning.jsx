import React, { useState, useEffect } from 'react';
import { 
  GitBranch, 
  Layers, 
  Code2, 
  CheckCircle2, 
  Database, 
  Sliders, 
  Settings2, 
  Calendar,
  Sparkles,
  RefreshCw,
  Scissors,
  Stethoscope
} from 'lucide-react';
import { api } from '../services/api';

const DEFAULT_VARIABILITY = {
  sistema: 'Plataforma SaaS Multi-Tenant de Agendamento e Gestão',
  pontosVariacao: [
    {
      id: 'VP-01',
      nome: 'Segmento de Atuação (Tenant)',
      tipo: 'XOR (Alternativa)',
      variantes: ['Barbearia Vintage', 'Clínica Saúde & Estética'],
      mecanismoReuso: 'Multi-tenant no BD (tenant_id) + CSS Variables + Singleton TenantConfigManager',
      bindingTime: 'Runtime (Execução)'
    },
    {
      id: 'VP-02',
      nome: 'Algoritmo de Alocação de Profissional',
      tipo: 'OR (Múltipla Escolha)',
      variantes: ['Escolha Manual', 'Fila Equilibrada (Round-Robin)', 'Mais Rápido Disponível'],
      mecanismoReuso: 'Padrão GoF Strategy (ProfessionalSelectionStrategy)',
      bindingTime: 'Runtime (Execução)'
    },
    {
      id: 'VP-03',
      nome: 'Cálculo de Desconto & Políticas Comerciais',
      tipo: 'XOR (Alternativa)',
      variantes: ['Sem Desconto', 'Primeira Visita (-15%)', 'Assinatura VIP (-30%)'],
      mecanismoReuso: 'Padrão GoF Strategy (DiscountStrategy)',
      bindingTime: 'Runtime (Execução)'
    },
    {
      id: 'VP-04',
      nome: 'Processamento de Reserva & Recibo',
      tipo: 'XOR (Específico por Domínio)',
      variantes: ['BarberBookingProcessor + SimpleReceipt', 'ClinicBookingProcessor + DetailedClinicalReceipt'],
      mecanismoReuso: 'Padrão GoF Template Method (BookingProcessor e ReceiptGenerator)',
      bindingTime: 'Runtime (Execução)'
    },
    {
      id: 'VP-05',
      nome: 'Canal de Notificação Externa',
      tipo: 'OR (Múltiplo)',
      variantes: ['WhatsApp Business API', 'E-mail SMTP'],
      mecanismoReuso: 'Padrão GoF Template Method (NotificationPipeline)',
      bindingTime: 'Runtime (Execução)'
    }
  ],
  estatisticasBanco: {
    tenants: 2,
    clientes: 5,
    servicos: 5,
    agendamentos: 5,
    disponibilidade: 6
  }
};

export function VariabilityPlanning({ currentTenant, onTenantSwitch }) {
  const [variabilityData, setVariabilityData] = useState(DEFAULT_VARIABILITY);
  const [loading, setLoading] = useState(false);
  const [selectedVP, setSelectedVP] = useState('VP-01');

  // Simulador de Variantes Ativas em Tempo Real
  const [simulatedDiscount, setSimulatedDiscount] = useState('FIRST');
  const [simulatedProStrategy, setSimulatedProStrategy] = useState('ROUND_ROBIN');

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const data = await api.getVariability();
      if (data) setVariabilityData(data);
    } catch {
      // Mantém os dados existentes
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    api.getVariability()
      .then((data) => {
        if (active && data) {
          setVariabilityData(data);
        }
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="crud-container">
      {/* Cabeçalho */}
      <div className="crud-header">
        <div>
          <div className="crud-title-group">
            <span className="entity-tag" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', borderColor: '#c084fc' }}>
              Engenharia de Reuso de Software
            </span>
            <h2 className="crud-title">
              <GitBranch className="icon-highlight" size={24} />
              Planejamento da Variabilidade (Linha de Produto de Software)
            </h2>
          </div>
          <p className="crud-subtitle">
            Especificação formal do <strong>Feature Model</strong>, <strong>Pontos de Variação (VP)</strong>, mecanismos de reuso (Design Patterns GoF) e resolução em tempo de execução no Banco de Dados SQLite.
          </p>
        </div>

        <button className="btn-action-primary" onClick={loadVariability} disabled={loading}>
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> {loading ? 'Atualizando...' : 'Atualizar Métricas do BD'}
        </button>
      </div>

      {/* Cards de Métricas das Tabelas do Banco de Dados */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon-wrap bg-blue">
            <Database size={20} />
          </div>
          <div>
            <span className="metric-label">Banco SQLite Relacional</span>
            <h3 className="metric-value">5 Tabelas Ativas</h3>
            <span className="metric-sub">database.sqlite (node:sqlite nativo)</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap bg-emerald">
            <Layers size={20} />
          </div>
          <div>
            <span className="metric-label">Tabelas de CRUD (Dupla)</span>
            <h3 className="metric-value">4 Entidades</h3>
            <span className="metric-sub">Clientes, Serviços, Agendamentos, Disponibilidade</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap bg-purple">
            <GitBranch size={20} />
          </div>
          <div>
            <span className="metric-label">Pontos de Variação (VP)</span>
            <h3 className="metric-value">5 Pontos Mapeados</h3>
            <span className="metric-sub">Multi-Tenant, Strategies & Template Methods</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap bg-teal">
            <Code2 size={20} />
          </div>
          <div>
            <span className="metric-label">Binding Time</span>
            <h3 className="metric-value">Runtime</h3>
            <span className="metric-sub">Troca dinâmica sem recompilação</span>
          </div>
        </div>
      </div>

      {/* Seção 1: Modelo de Features (Feature Model) */}
      <div className="table-responsive" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Layers size={20} className="text-primary" />
          Modelo de Features (Feature Model Hierárquico)
        </h3>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-sub)', marginBottom: '1.5rem' }}>
          Hierarquia de funcionalidades da Linha de Produto de Software: features obrigatórias (*mandatory*), pontos de variação e variantes.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {/* Raiz Obrigatória */}
          <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1.25rem' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#34d399', textTransform: 'uppercase' }}>[MANDATORY] Core do Sistema</span>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: '0.4rem 0' }}>Núcleo de Agendamento SaaS</h4>
            <ul style={{ fontSize: '0.8rem', color: 'var(--text-sub)', paddingLeft: '1.2rem', lineHeight: '1.6' }}>
              <li>Persistência Relacional SQLite</li>
              <li>Autenticação de Sessão (Singleton)</li>
              <li>Catálogo Central de Serviços</li>
              <li>Controle de Escala e Disponibilidade</li>
            </ul>
          </div>

          {/* VP1: Tenant Segment */}
          <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid var(--tenant-primary)', borderRadius: '16px', padding: '1.25rem' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase' }}>[XOR] Ponto de Variação 1</span>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: '0.4rem 0' }}>Segmento do Negócio</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-sub)', marginBottom: '0.5rem' }}>
              Define cores, formulários, catálogo do banco e regras clínicas vs barbearia:
            </p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <span className="badge badge-info">Barbearia Vintage</span>
              <span className="badge badge-success">Clínica Saúde</span>
            </div>
          </div>

          {/* VP2: Strategies */}
          <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1.25rem' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#c084fc', textTransform: 'uppercase' }}>[STRATEGIES] Pontos de Variação 2 & 3</span>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: '0.4rem 0' }}>Algoritmos de Negócio</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-sub)', marginBottom: '0.5rem' }}>
              Variações comportamentais intercambiáveis:
            </p>
            <ul style={{ fontSize: '0.8rem', color: 'var(--text-sub)', paddingLeft: '1.2rem', lineHeight: '1.6' }}>
              <li>Alocação: Manual | Round-Robin | Fastest</li>
              <li>Descontos: Nenhum | 1ª Visita (-15%) | VIP (-30%)</li>
              <li>Pagamento: Pix | Cartão | Sinal Antecipado</li>
            </ul>
          </div>

          {/* VP3: Template Methods */}
          <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1.25rem' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#fbbf24', textTransform: 'uppercase' }}>[TEMPLATE METHOD] Pontos 4 & 5</span>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: '0.4rem 0' }}>Pipelines Estruturados</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-sub)', marginBottom: '0.5rem' }}>
              Algoritmos com esqueleto fixo e passos customizados:
            </p>
            <ul style={{ fontSize: '0.8rem', color: 'var(--text-sub)', paddingLeft: '1.2rem', lineHeight: '1.6' }}>
              <li>BookingProcessor (Barber vs Clinic)</li>
              <li>ReceiptGenerator (Simples vs Clínico Anamnese)</li>
              <li>NotificationPipeline (WhatsApp vs Email)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Seção 2: Matriz de Rastreabilidade de Variabilidade */}
      <div className="table-responsive" style={{ marginBottom: '2rem' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>
            Matriz de Rastreabilidade da Variabilidade
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-sub)', marginTop: '0.2rem' }}>
            Mapeamento formal de cada Ponto de Variação, variantes, mecanismos de reuso de software e momento de ligação.
          </p>
        </div>

        <table className="crud-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Ponto de Variação</th>
              <th>Tipo</th>
              <th>Variantes Disponíveis</th>
              <th>Mecanismo de Implementação (Reuso)</th>
              <th>Binding Time</th>
            </tr>
          </thead>
          <tbody>
            {variabilityData?.pontosVariacao?.map((vp) => (
              <tr 
                key={vp.id}
                className={selectedVP === vp.id ? 'active-row' : ''}
                style={{ cursor: 'pointer' }}
                onClick={() => setSelectedVP(vp.id)}
              >
                <td>
                  <span className="badge-id font-mono">{vp.id}</span>
                </td>
                <td>
                  <strong className="text-main">{vp.nome}</strong>
                </td>
                <td>
                  <span className="badge badge-info">{vp.tipo}</span>
                </td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    {vp.variantes.map((v, i) => (
                      <span key={i} style={{ fontSize: '0.78rem', color: '#e2e8f0' }}>• {v}</span>
                    ))}
                  </div>
                </td>
                <td>
                  <span style={{ fontSize: '0.8rem', color: '#93c5fd' }}>{vp.mecanismoReuso}</span>
                </td>
                <td>
                  <span className="badge badge-success font-mono">{vp.bindingTime}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Seção 3: Simulador de Resolução da Variabilidade em Tempo Real */}
      <div className="table-responsive" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sliders size={20} className="text-primary" />
          Simulador Interativo de Resolução de Variabilidade (Runtime)
        </h3>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-sub)', marginBottom: '1.5rem' }}>
          Altere as variantes abaixo para ver como o isolamento de dados no banco de dados SQLite, os Padrões GoF e as variáveis CSS são resolvidos dinamicamente.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {/* Controle 1: Tenant Ativo */}
          <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1.25rem' }}>
            <label className="form-label">Variante de Domínio (Tenant Ativo):</label>
            <div className="option-selector" style={{ margin: '0.75rem 0' }}>
              <button 
                className={`option-btn ${currentTenant.type === 'BARBER' ? 'active' : ''}`}
                onClick={() => onTenantSwitch('BARBER')}
              >
                <Scissors size={14} /> Barbearia
              </button>
              <button 
                className={`option-btn ${currentTenant.type === 'CLINIC' ? 'active' : ''}`}
                onClick={() => onTenantSwitch('CLINIC')}
              >
                <Stethoscope size={14} /> Clínica
              </button>
            </div>
            <span className="input-hint">
              <strong>Query no BD:</strong> <code>SELECT * FROM servicos WHERE tenant_id = '{currentTenant.type}'</code>
            </span>
          </div>

          {/* Controle 2: Estratégia de Desconto */}
          <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1.25rem' }}>
            <label className="form-label">Variante de Strategy (Política de Desconto):</label>
            <select 
              value={simulatedDiscount}
              onChange={(e) => setSimulatedDiscount(e.target.value)}
              className="form-select"
              style={{ margin: '0.75rem 0' }}
            >
              <option value="NONE">Sem Desconto (NoDiscountStrategy)</option>
              <option value="FIRST">Primeira Visita -15% (FirstVisitDiscountStrategy)</option>
              <option value="VIP">Assinatura VIP -30% (VipSubscriptionDiscountStrategy)</option>
            </select>
            <span className="input-hint">
              <strong>Padrão GoF:</strong> Instancia <code>DiscountContext(new {simulatedDiscount === 'FIRST' ? 'FirstVisitDiscountStrategy' : simulatedDiscount === 'VIP' ? 'VipSubscriptionDiscountStrategy' : 'NoDiscountStrategy'}())</code>
            </span>
          </div>

          {/* Controle 3: Estratégia de Profissional */}
          <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1.25rem' }}>
            <label className="form-label">Variante de Strategy (Alocação de Profissional):</label>
            <select 
              value={simulatedProStrategy}
              onChange={(e) => setSimulatedProStrategy(e.target.value)}
              className="form-select"
              style={{ margin: '0.75rem 0' }}
            >
              <option value="MANUAL">Manual (ManualProfessionalStrategy)</option>
              <option value="ROUND_ROBIN">Equilibrada (RoundRobinStrategy)</option>
              <option value="FASTEST">Mais Rápido (FastestAvailableStrategy)</option>
            </select>
            <span className="input-hint">
              <strong>Algoritmo:</strong> <code>{simulatedProStrategy === 'ROUND_ROBIN' ? 'Fila circular round-robin' : simulatedProStrategy === 'FASTEST' ? 'Busca primeiro slot vago' : 'Seleção direta do cliente'}</code>
            </span>
          </div>
        </div>

        {/* Resolução de Variabilidade Gerada */}
        <div style={{ marginTop: '1.5rem', background: '#0b0f19', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1.25rem' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#34d399', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <CheckCircle2 size={16} /> Resolução da Configuração em Tempo de Execução:
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
            <div>• Tenant ID: <strong style={{ color: 'var(--tenant-primary)' }}>{currentTenant.type}</strong> ({currentTenant.name})</div>
            <div>• Template Recibo: <strong style={{ color: '#38bdf8' }}>{currentTenant.type === 'BARBER' ? 'SimpleReceiptGenerator' : 'DetailedClinicalReceiptGenerator'}</strong></div>
            <div>• Processador: <strong style={{ color: '#fbbf24' }}>{currentTenant.type === 'BARBER' ? 'BarberBookingProcessor' : 'ClinicBookingProcessor'}</strong></div>
            <div>• Desconto Aplicado: <strong style={{ color: '#34d399' }}>{simulatedDiscount === 'FIRST' ? '15%' : simulatedDiscount === 'VIP' ? '30%' : '0%'}</strong></div>
            <div>• Filtro no Banco: <strong style={{ color: '#c084fc' }}>tenant_id = '{currentTenant.type}'</strong></div>
            <div>• Estilo Visual: <strong style={{ color: currentTenant.primaryColor }}>--tenant-primary: {currentTenant.primaryColor}</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
}
