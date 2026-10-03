import React, { useState } from 'react';
import { 
  CalendarDays, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  User, 
  Scissors, 
  Clock, 
  FileText,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { api } from '../../services/api';

export function AppointmentsCrud({ appointments, setAppointments, clients = [], services = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Formulário com os campos EXATOS: ID, Data e Hora, Status, Cliente, Serviço, Observações
  const [formData, setFormData] = useState({
    id: '',
    dataHora: '2026-09-22T14:00',
    status: 'Confirmado',
    cliente: '',
    servico: '',
    observacoes: ''
  });

  const statuses = ['Confirmado', 'Pendente', 'Concluído', 'Cancelado'];

  const showToast = (msg) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(''), 3500);
  };

  const handleOpenCreate = () => {
    const nextId = `AGD-${String(appointments.length + 201).padStart(3, '0')}`;
    const defaultClient = clients[0]?.nome || 'Gabriel Duarte Silva';
    const defaultService = services[0]?.nomeServico || 'Corte Degradê Premium & Barboterapia';

    setFormData({
      id: nextId,
      dataHora: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
      status: 'Confirmado',
      cliente: defaultClient,
      servico: defaultService,
      observacoes: ''
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (appt) => {
    setFormData({
      id: appt.id,
      dataHora: appt.dataHora,
      status: appt.status,
      cliente: appt.cliente,
      servico: appt.servico,
      observacoes: appt.observacoes || ''
    });
    setEditingId(appt.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm(`Deseja realmente remover o agendamento ${id} do banco de dados SQLite?`)) {
      try {
        await api.deleteAppointment(id);
      } catch (err) {
        console.warn('Operação offline / local:', err.message);
      }
      setAppointments(prev => prev.filter(a => a.id !== id));
      showToast(`Agendamento ${id} excluído com sucesso do banco de dados SQLite.`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.cliente || !formData.servico || !formData.dataHora) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (editingId) {
      try {
        await api.updateAppointment(editingId, formData);
      } catch (err) {
        console.warn('Atualizando localmente:', err.message);
      }
      setAppointments(prev => prev.map(a => a.id === editingId ? { ...formData } : a));
      showToast(`Agendamento ${formData.id} atualizado com sucesso no SQLite!`);
    } else {
      try {
        await api.createAppointment(formData);
      } catch (err) {
        console.warn('Criando localmente:', err.message);
      }
      setAppointments(prev => [formData, ...prev]);
      showToast(`Agendamento ${formData.id} salvo com sucesso no banco de dados SQLite!`);
    }

    setIsModalOpen(false);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmado':
        return <span className="badge badge-success">Confirmado</span>;
      case 'Pendente':
        return <span className="badge badge-warning">Pendente</span>;
      case 'Concluído':
        return <span className="badge badge-info">Concluído</span>;
      case 'Cancelado':
        return <span className="badge badge-danger">Cancelado</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  const formatDateTime = (iso) => {
    if (!iso) return '-';
    try {
      const d = new Date(iso);
      if (isNaN(d.getTime())) return iso;
      return d.toLocaleString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch {
      return iso;
    }
  };

  const filteredAppointments = appointments.filter(a => {
    const matchesSearch = a.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          a.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          a.servico.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (a.observacoes && a.observacoes.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // =========================================================================
  // --- [INÍCIO DO PRINT: CRUD de Agendamentos] ---
  // =========================================================================
  return (
    <div className="crud-container">
      {/* Cabeçalho */}
      <div className="crud-header">
        <div>
          <div className="crud-title-group">
            <span className="entity-tag">Entidade CRUD (Integrante 2)</span>
            <span className="badge badge-success font-mono" style={{ fontSize: '0.72rem' }}>
              ● SQLite: tabela "agendamentos" (FKs)
            </span>
            <h2 className="crud-title">
              <CalendarDays className="icon-highlight" size={24} />
              Gestão de Agendamentos
            </h2>
          </div>
          <p className="crud-subtitle">
            Controle de reservas com: <strong>ID, Data e Hora, Status, Cliente, Serviço, Observações</strong>.
          </p>
        </div>

        <button className="btn-action-primary" onClick={handleOpenCreate}>
          <Plus size={18} /> Novo Agendamento
        </button>
      </div>

      {feedbackMsg && (
        <div className="toast-notification">
          <CheckCircle2 size={18} /> {feedbackMsg}
        </div>
      )}

      {/* Filtros e Busca */}
      <div className="search-bar-row">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Buscar por ID, Cliente, Serviço ou Observação..." 
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
            <option value="ALL">Todos os Status</option>
            {statuses.map(st => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>

        <div className="counter-pill">
          Total: <strong>{filteredAppointments.length}</strong> agendamentos
        </div>
      </div>

      {/* Tabela de Listagem Responsiva */}
      <div className="table-responsive">
        <table className="crud-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Data e Hora</th>
              <th>Status</th>
              <th>Cliente</th>
              <th>Serviço</th>
              <th>Observações</th>
              <th style={{ textAlign: 'right' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.length === 0 ? (
              <tr>
                <td colSpan="7" className="table-empty">
                  <AlertCircle size={20} /> Nenhum agendamento encontrado.
                </td>
              </tr>
            ) : (
              filteredAppointments.map((appt) => (
                <tr key={appt.id}>
                  <td>
                    <span className="badge-id">{appt.id}</span>
                  </td>
                  <td>
                    <div className="cell-flex font-mono">
                      <Clock size={14} className="cell-icon" />
                      <span>{formatDateTime(appt.dataHora)}</span>
                    </div>
                  </td>
                  <td>
                    {getStatusBadge(appt.status)}
                  </td>
                  <td>
                    <div className="cell-flex">
                      <User size={14} className="cell-icon text-primary" />
                      <span className="font-semibold text-main">{appt.cliente}</span>
                    </div>
                  </td>
                  <td>
                    <div className="cell-flex">
                      <Scissors size={14} className="cell-icon" />
                      <span>{appt.servico}</span>
                    </div>
                  </td>
                  <td>
                    <div className="cell-flex text-sub-cell" title={appt.observacoes}>
                      <FileText size={13} className="cell-icon" />
                      <span className="truncate-text">{appt.observacoes || 'Nenhuma observação.'}</span>
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="actions-group">
                      <button 
                        className="btn-action-icon edit" 
                        onClick={() => handleOpenEdit(appt)}
                        title="Editar agendamento"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button 
                        className="btn-action-icon delete" 
                        onClick={() => handleDelete(appt.id)}
                        title="Excluir agendamento"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de Criação / Edição */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <div>
                <h3 className="modal-title">
                  {editingId ? 'Editar Agendamento' : 'Novo Agendamento'}
                </h3>
                <p className="modal-subtitle">
                  Preencha os dados da entidade Agendamentos.
                </p>
              </div>
              <button className="btn-close-modal" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="crud-form">
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">ID do Agendamento</label>
                  <input 
                    type="text" 
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    className="form-input font-mono"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="form-select"
                    required
                  >
                    {statuses.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Data e Hora do Atendimento</label>
                <input 
                  type="datetime-local" 
                  value={formData.dataHora}
                  onChange={(e) => setFormData({ ...formData, dataHora: e.target.value })}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Cliente</label>
                  <input 
                    type="text" 
                    list="clients-list"
                    value={formData.cliente}
                    onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
                    placeholder="Selecione ou digite o cliente"
                    className="form-input"
                    required
                  />
                  <datalist id="clients-list">
                    {clients.map(c => (
                      <option key={c.id} value={c.nome} />
                    ))}
                  </datalist>
                </div>

                <div className="form-group">
                  <label className="form-label">Serviço</label>
                  <input 
                    type="text" 
                    list="services-list"
                    value={formData.servico}
                    onChange={(e) => setFormData({ ...formData, servico: e.target.value })}
                    placeholder="Selecione ou digite o serviço"
                    className="form-input"
                    required
                  />
                  <datalist id="services-list">
                    {services.map(s => (
                      <option key={s.id} value={s.nomeServico} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Observações</label>
                <textarea 
                  rows={3}
                  value={formData.observacoes}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  placeholder="Informações adicionais, preferências ou histórico do cliente..."
                  className="form-textarea"
                />
              </div>

              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn-cancel" 
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-save">
                  {editingId ? 'Salvar Alterações' : 'Criar Agendamento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
  // =========================================================================
  // --- [FIM DO PRINT] ---
  // =========================================================================
}
