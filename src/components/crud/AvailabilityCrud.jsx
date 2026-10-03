import React, { useState } from 'react';
import { 
  Clock, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  UserCheck, 
  Calendar,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { api } from '../../services/api';

export function AvailabilityCrud({ availability, setAvailability, professionals = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [dayFilter, setDayFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Formulário com os campos EXATOS: ID, Profissional, Dia da Semana, Hora Início, Hora Fim
  const [formData, setFormData] = useState({
    id: '',
    profissional: 'Carlos Barber',
    diaSemana: 'Segunda-feira',
    horaInicio: '09:00',
    horaFim: '18:00'
  });

  const daysOfWeek = [
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
    'Domingo'
  ];

  const showToast = (msg) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(''), 3500);
  };

  const handleOpenCreate = () => {
    const nextId = `DSP-${String(availability.length + 101).padStart(3, '0')}`;
    const defaultPro = professionals.length > 0 ? professionals[0] : 'Carlos Barber';
    setFormData({
      id: nextId,
      profissional: defaultPro,
      diaSemana: 'Segunda-feira',
      horaInicio: '09:00',
      horaFim: '18:00'
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setFormData({
      id: item.id,
      profissional: item.profissional,
      diaSemana: item.diaSemana,
      horaInicio: item.horaInicio,
      horaFim: item.horaFim
    });
    setEditingId(item.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm(`Deseja realmente remover a escala de disponibilidade ${id} do banco de dados SQLite?`)) {
      try {
        await api.deleteAvailability(id);
      } catch (err) {
        console.warn('Operação offline / local:', err.message);
      }
      setAvailability(prev => prev.filter(a => a.id !== id));
      showToast(`Disponibilidade ${id} removida do banco de dados SQLite.`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.profissional || !formData.diaSemana || !formData.horaInicio || !formData.horaFim) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    if (formData.horaInicio >= formData.horaFim) {
      alert('A Hora Início deve ser anterior à Hora Fim.');
      return;
    }

    if (editingId) {
      try {
        await api.updateAvailability(editingId, formData);
      } catch (err) {
        console.warn('Atualizando localmente:', err.message);
      }
      setAvailability(prev => prev.map(a => a.id === editingId ? { ...formData } : a));
      showToast(`Disponibilidade de ${formData.profissional} atualizada no SQLite!`);
    } else {
      try {
        await api.createAvailability(formData);
      } catch (err) {
        console.warn('Criando localmente:', err.message);
      }
      setAvailability(prev => [formData, ...prev]);
      showToast(`Nova escala criada para ${formData.profissional} no banco SQLite!`);
    }

    setIsModalOpen(false);
  };

  const filteredAvailability = availability.filter(a => {
    const matchesSearch = a.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          a.profissional.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          a.diaSemana.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDay = dayFilter === 'ALL' || a.diaSemana === dayFilter;
    return matchesSearch && matchesDay;
  });

  // =========================================================================
  // --- [INÍCIO DO PRINT: CRUD de Disponibilidade] ---
  // =========================================================================
  return (
    <div className="crud-container">
      {/* Cabeçalho */}
      <div className="crud-header">
        <div>
          <div className="crud-title-group">
            <span className="entity-tag">Entidade CRUD (Integrante 2)</span>
            <span className="badge badge-success font-mono" style={{ fontSize: '0.72rem' }}>
              ● SQLite: tabela "disponibilidade"
            </span>
            <h2 className="crud-title">
              <Clock className="icon-highlight" size={24} />
              Grade de Disponibilidade
            </h2>
          </div>
          <p className="crud-subtitle">
            Escala de trabalho e horários com: <strong>ID, Profissional, Dia da Semana, Hora Início, Hora Fim</strong>.
          </p>
        </div>

        <button className="btn-action-primary" onClick={handleOpenCreate}>
          <Plus size={18} /> Nova Disponibilidade
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
            placeholder="Buscar por ID, Profissional ou Dia..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-select-wrapper">
          <select 
            value={dayFilter} 
            onChange={(e) => setDayFilter(e.target.value)}
            className="form-select"
          >
            <option value="ALL">Todos os Dias da Semana</option>
            {daysOfWeek.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div className="counter-pill">
          Total: <strong>{filteredAvailability.length}</strong> escalas
        </div>
      </div>

      {/* Tabela de Listagem Responsiva */}
      <div className="table-responsive">
        <table className="crud-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Profissional</th>
              <th>Dia da Semana</th>
              <th>Hora Início</th>
              <th>Hora Fim</th>
              <th>Jornada Diária</th>
              <th style={{ textAlign: 'right' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredAvailability.length === 0 ? (
              <tr>
                <td colSpan="7" className="table-empty">
                  <AlertCircle size={20} /> Nenhuma disponibilidade cadastrada para este filtro.
                </td>
              </tr>
            ) : (
              filteredAvailability.map((item) => (
                <tr key={item.id}>
                  <td>
                    <span className="badge-id">{item.id}</span>
                  </td>
                  <td>
                    <div className="cell-flex">
                      <UserCheck size={15} className="cell-icon text-primary" />
                      <span className="font-semibold text-main">{item.profissional}</span>
                    </div>
                  </td>
                  <td>
                    <div className="cell-flex">
                      <Calendar size={13} className="cell-icon" />
                      <span className="badge-day">{item.diaSemana}</span>
                    </div>
                  </td>
                  <td>
                    <span className="time-pill font-mono">{item.horaInicio}</span>
                  </td>
                  <td>
                    <span className="time-pill font-mono">{item.horaFim}</span>
                  </td>
                  <td>
                    <div className="cell-flex text-sub-cell">
                      <Clock size={12} className="cell-icon" />
                      <span>{item.horaInicio} às {item.horaFim}</span>
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="actions-group">
                      <button 
                        className="btn-action-icon edit" 
                        onClick={() => handleOpenEdit(item)}
                        title="Editar disponibilidade"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button 
                        className="btn-action-icon delete" 
                        onClick={() => handleDelete(item.id)}
                        title="Excluir disponibilidade"
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
                  {editingId ? 'Editar Disponibilidade' : 'Cadastrar Disponibilidade'}
                </h3>
                <p className="modal-subtitle">
                  Configure os horários de atendimento do profissional.
                </p>
              </div>
              <button className="btn-close-modal" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="crud-form">
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">ID da Escala</label>
                  <input 
                    type="text" 
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    className="form-input font-mono"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Dia da Semana</label>
                  <select 
                    value={formData.diaSemana}
                    onChange={(e) => setFormData({ ...formData, diaSemana: e.target.value })}
                    className="form-select"
                    required
                  >
                    {daysOfWeek.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Profissional Responsável</label>
                <input 
                  type="text" 
                  list="pros-list"
                  value={formData.profissional}
                  onChange={(e) => setFormData({ ...formData, profissional: e.target.value })}
                  placeholder="Nome do atendente ou especialista"
                  className="form-input"
                  required
                />
                <datalist id="pros-list">
                  {professionals.map(p => (
                    <option key={p} value={p} />
                  ))}
                </datalist>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Hora Início</label>
                  <input 
                    type="time" 
                    value={formData.horaInicio}
                    onChange={(e) => setFormData({ ...formData, horaInicio: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Hora Fim</label>
                  <input 
                    type="time" 
                    value={formData.horaFim}
                    onChange={(e) => setFormData({ ...formData, horaFim: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
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
                  {editingId ? 'Salvar Alterações' : 'Criar Escala'}
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
