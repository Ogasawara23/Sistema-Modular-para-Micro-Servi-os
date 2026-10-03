import React, { useState } from 'react';
import { 
  MessageSquare, 
  Lock, 
  Check, 
  CheckCheck, 
  AlertCircle, 
  Search, 
  Clock, 
  Smartphone,
  Info
} from 'lucide-react';
import { mockWhatsAppLogs } from '../../data/mockData';

export function WhatsAppLogs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedMessage, setSelectedMessage] = useState(mockWhatsAppLogs[0]);

  const filteredLogs = mockWhatsAppLogs.filter(log => {
    const matchesSearch = log.mensagemId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.destinatario.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.statusEnvio.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.conteudo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || log.statusEnvio === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Lido':
        return (
          <span className="wa-status-pill read" title="Mensagem lida pelo destinatário">
            <CheckCheck size={14} className="text-wa-blue" />
            <span>Lido</span>
          </span>
        );
      case 'Entregue':
        return (
          <span className="wa-status-pill delivered" title="Mensagem entregue no dispositivo">
            <CheckCheck size={14} className="text-sub" />
            <span>Entregue</span>
          </span>
        );
      case 'Enviado':
        return (
          <span className="wa-status-pill sent" title="Enviado aos servidores do WhatsApp">
            <Check size={14} className="text-sub" />
            <span>Enviado</span>
          </span>
        );
      case 'Falha':
        return (
          <span className="wa-status-pill failed" title="Falha no disparo ou número inválido">
            <AlertCircle size={14} className="text-danger" />
            <span>Falha</span>
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  // =========================================================================
  // --- [INÍCIO DO PRINT: Log de Notificações WhatsApp] ---
  // =========================================================================
  return (
    <div className="crud-container">
      {/* Cabeçalho */}
      <div className="crud-header">
        <div>
          <div className="crud-title-group">
            <span className="readonly-badge">
              <Lock size={12} /> Histórico de Disparos de API Externa (WhatsApp Cloud API)
            </span>
            <h2 className="crud-title">
              <MessageSquare className="icon-highlight" size={24} />
              Log de Notificações (WhatsApp)
            </h2>
          </div>
          <p className="crud-subtitle">
            Histórico de envios automatizados com: 
            <strong> Mensagem ID, Status de Envio, Data de Entrega, Destinatário</strong>.
          </p>
        </div>

        <div className="gateway-pill whatsapp">
          <Smartphone size={14} /> Meta Graph API v20.0 Conectada
        </div>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="search-bar-row">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Buscar por Mensagem ID, Destinatário ou Conteúdo..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-select-wrapper">
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-select"
          >
            <option value="ALL">Todos os Status de Envio</option>
            <option value="Lido">Lido (Double Blue Check)</option>
            <option value="Entregue">Entregue (Double Grey Check)</option>
            <option value="Enviado">Enviado (Single Check)</option>
            <option value="Falha">Falha no Disparo</option>
          </select>
        </div>

        <div className="counter-pill">
          Disparos: <strong>{filteredLogs.length}</strong> registrados
        </div>
      </div>

      <div className="logs-layout-grid">
        {/* Lista Principal de Disparos (Tabela / Feed) */}
        <div className="logs-table-container">
          <div className="table-responsive">
            <table className="crud-table read-only-table">
              <thead>
                <tr>
                  <th>Mensagem ID</th>
                  <th>Status de Envio</th>
                  <th>Data de Entrega</th>
                  <th>Destinatário</th>
                  <th style={{ textAlign: 'center' }}>Detalhes</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="table-empty">
                      Nenhum registro de notificação encontrado.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr 
                      key={log.mensagemId} 
                      className={`selectable-row ${selectedMessage?.mensagemId === log.mensagemId ? 'active-row' : ''}`}
                      onClick={() => setSelectedMessage(log)}
                    >
                      <td>
                        <div className="cell-flex font-mono">
                          <span className="badge-id">{log.mensagemId}</span>
                        </div>
                      </td>
                      <td>
                        {getStatusIcon(log.statusEnvio)}
                      </td>
                      <td>
                        <div className="cell-flex text-sub-cell font-mono">
                          <Clock size={14} className="cell-icon" />
                          <span>{log.dataEntrega}</span>
                        </div>
                      </td>
                      <td>
                        <div className="cell-flex">
                          <Smartphone size={14} className="cell-icon text-wa-green" />
                          <span className="font-semibold text-main">{log.destinatario}</span>
                        </div>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button 
                          className="btn-inspect-pill"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedMessage(log);
                          }}
                        >
                          Visualizar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Painel Lateral: Balão de Pré-visualização do WhatsApp */}
        {selectedMessage && (
          <div className="wa-preview-card">
            <div className="wa-preview-header">
              <div className="wa-avatar-small">
                <MessageSquare size={16} />
              </div>
              <div>
                <h4 className="wa-preview-title">SaaS Bot • Notificador</h4>
                <span className="wa-preview-sub">Disparo Automatizado</span>
              </div>
            </div>

            <div className="wa-chat-bubble-container">
              <div className="wa-bubble">
                <p className="wa-message-text">{selectedMessage.conteudo}</p>
                <div className="wa-message-meta">
                  <span className="wa-time">{selectedMessage.dataEntrega.split(' ')[1]}</span>
                  {selectedMessage.statusEnvio === 'Lido' && <CheckCheck size={14} className="text-wa-blue" />}
                  {selectedMessage.statusEnvio === 'Entregue' && <CheckCheck size={14} className="text-sub" />}
                  {selectedMessage.statusEnvio === 'Enviado' && <Check size={14} className="text-sub" />}
                </div>
              </div>
            </div>

            <div className="wa-metadata-box">
              <div className="wa-meta-row">
                <span>Template Utilizado:</span>
                <code>{selectedMessage.template}</code>
              </div>
              <div className="wa-meta-row">
                <span>ID da Mensagem:</span>
                <span className="font-mono text-xs">{selectedMessage.mensagemId}</span>
              </div>
              <div className="wa-meta-row">
                <span>Destino:</span>
                <span className="font-semibold">{selectedMessage.destinatario}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="read-only-notice">
        <Info size={15} />
        <span>
          <strong>Auditoria de Comunicações:</strong> As notificações via WhatsApp são processadas pelo Template Method <code>NotificationPipeline</code> e sincronizadas com a API Oficial do WhatsApp Business. Sem suporte para edição pós-disparo.
        </span>
      </div>
    </div>
  );
  // =========================================================================
  // --- [FIM DO PRINT] ---
  // =========================================================================
}
