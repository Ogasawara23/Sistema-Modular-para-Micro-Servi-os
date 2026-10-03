import React, { useState } from 'react';
import { 
  CreditCard, 
  Lock, 
  QrCode, 
  Search, 
  CheckCircle2, 
  RotateCcw, 
  Clock, 
  DollarSign,
  Filter,
  ShieldCheck
} from 'lucide-react';

export function PaymentsPanel({ payments }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState('ALL');

  const totalConfirmed = payments
    .filter(p => p.statusPagamento !== 'Estornado')
    .reduce((sum, p) => sum + p.valorConfirmado, 0);

  const totalTransactions = payments.length;
  const pixCount = payments.filter(p => p.metodo.includes('Pix')).length;
  const stripeCount = payments.filter(p => p.metodo.includes('Stripe')).length;

  const filteredPayments = payments.filter(p => {
    const matchesSearch = p.transacaoId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.statusPagamento.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (p.cliente && p.cliente.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesMethod = methodFilter === 'ALL' ||
                          (methodFilter === 'PIX' && p.metodo.includes('Pix')) ||
                          (methodFilter === 'STRIPE' && p.metodo.includes('Stripe'));
    return matchesSearch && matchesMethod;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Liquidado':
        return (
          <span className="badge badge-success">
            <CheckCircle2 size={12} /> Liquidado
          </span>
        );
      case 'Aprovado':
        return (
          <span className="badge badge-success">
            <CheckCircle2 size={12} /> Aprovado
          </span>
        );
      case 'Processando':
        return (
          <span className="badge badge-warning">
            <Clock size={12} /> Processando
          </span>
        );
      case 'Estornado':
        return (
          <span className="badge badge-danger">
            <RotateCcw size={12} /> Estornado
          </span>
        );
      default:
        return <span className="badge">{status}</span>;
    }
  };

  // =========================================================================
  // --- [INÍCIO DO PRINT: Painel de Pagamentos] ---
  // =========================================================================
  return (
    <div className="crud-container">
      {/* Cabeçalho com indicativo READ-ONLY */}
      <div className="crud-header">
        <div>
          <div className="crud-title-group">
            <span className="readonly-badge">
              <Lock size={12} /> Componente Read-Only (Somente Leitura)
            </span>
            <h2 className="crud-title">
              <CreditCard className="icon-highlight" size={24} />
              Painel de Pagamentos (Stripe / Pix)
            </h2>
          </div>
          <p className="crud-subtitle">
            Visualização de integração bancária externa. Exibe exatamente: 
            <strong> Transação ID, Status do Pagamento, Valor Confirmado, Data do Pagamento</strong>. Sem botões de edição.
          </p>
        </div>

        <div className="gateway-badges">
          <div className="gateway-pill stripe">
            <CreditCard size={14} /> Stripe Webhooks Conectados
          </div>
          <div className="gateway-pill pix">
            <QrCode size={14} /> Pix Instantâneo Ativo
          </div>
        </div>
      </div>

      {/* Cards de Métricas Read-Only */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon-wrap bg-emerald">
            <DollarSign size={20} />
          </div>
          <div>
            <span className="metric-label">Valor Total Confirmado</span>
            <h3 className="metric-value">
              R$ {totalConfirmed.toFixed(2).replace('.', ',')}
            </h3>
            <span className="metric-sub">Soma de recebimentos liquidados</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap bg-blue">
            <CreditCard size={20} />
          </div>
          <div>
            <span className="metric-label">Transações Stripe</span>
            <h3 className="metric-value">{stripeCount}</h3>
            <span className="metric-sub">Cartão de Crédito / Apple Pay</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap bg-teal">
            <QrCode size={20} />
          </div>
          <div>
            <span className="metric-label">Transações Pix</span>
            <h3 className="metric-value">{pixCount}</h3>
            <span className="metric-sub">Liquidação instantânea BACEN</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap bg-purple">
            <ShieldCheck size={20} />
          </div>
          <div>
            <span className="metric-label">Total de Registros</span>
            <h3 className="metric-value">{totalTransactions}</h3>
            <span className="metric-sub">Sincronizado via Webhooks</span>
          </div>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="search-bar-row">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Buscar por Transação ID ou Status..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-select-wrapper">
          <Filter size={15} className="select-icon" />
          <select 
            value={methodFilter} 
            onChange={(e) => setMethodFilter(e.target.value)}
            className="form-select"
          >
            <option value="ALL">Todos os Meios (Stripe & Pix)</option>
            <option value="STRIPE">Apenas Stripe</option>
            <option value="PIX">Apenas Pix</option>
          </select>
        </div>

        <div className="counter-pill">
          Exibindo: <strong>{filteredPayments.length}</strong> transações
        </div>
      </div>

      {/* Tabela Read-Only (SEM BOTÕES DE EDIÇÃO) */}
      <div className="table-responsive">
        <table className="crud-table read-only-table">
          <thead>
            <tr>
              <th>Transação ID</th>
              <th>Integração Externa</th>
              <th>Status do Pagamento</th>
              <th>Valor Confirmado</th>
              <th>Data do Pagamento</th>
              <th>Origem / Pagador</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.length === 0 ? (
              <tr>
                <td colSpan="6" className="table-empty">
                  Nenhuma transação correspondente aos filtros.
                </td>
              </tr>
            ) : (
              filteredPayments.map((pay) => (
                <tr key={pay.transacaoId}>
                  <td>
                    <div className="cell-flex font-mono">
                      <span className="badge-id-alt">{pay.transacaoId}</span>
                    </div>
                  </td>
                  <td>
                    <div className="cell-flex">
                      {pay.metodo.includes('Pix') ? (
                        <span className="gateway-tag pix">
                          <QrCode size={13} /> Pix BACEN
                        </span>
                      ) : (
                        <span className="gateway-tag stripe">
                          <CreditCard size={13} /> Stripe API
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    {getStatusBadge(pay.statusPagamento)}
                  </td>
                  <td>
                    <span className="price-tag-confirmed font-mono">
                      R$ {pay.valorConfirmado.toFixed(2).replace('.', ',')}
                    </span>
                  </td>
                  <td>
                    <div className="cell-flex text-sub-cell font-mono">
                      <Clock size={14} className="cell-icon" />
                      <span>{pay.dataPagamento}</span>
                    </div>
                  </td>
                  <td>
                    <span className="text-sub-cell">{pay.cliente || 'Consumidor Final'}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="read-only-notice">
        <Lock size={15} />
        <span>
          <strong>Aviso de Auditoria:</strong> Os dados de pagamento são protegidos e gerados diretamente pelos webhooks da Stripe e do Banco Central (Pix). Alterações manuais são bloqueadas pelo protocolo PCI-DSS.
        </span>
      </div>
    </div>
  );
  // =========================================================================
  // --- [FIM DO PRINT] ---
  // =========================================================================
}
