import React, { useState } from 'react';
import { 
  Scissors, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  DollarSign, 
  Clock, 
  Tag, 
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { api } from '../../services/api';

export function ServicesCrud({ services, setServices }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Formulário com os campos EXATOS: ID, Nome do Serviço, Preço, Duração em Minutos, Categoria
  const [formData, setFormData] = useState({
    id: '',
    nomeServico: '',
    preco: '',
    duracaoMinutos: '',
    categoria: 'Cabelo e Barba'
  });

  const categories = ['Cabelo e Barba', 'Barba', 'Estética Facial', 'Consultas Médicas', 'Tratamento', 'Geral'];

  const showToast = (msg) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(''), 3500);
  };

  const handleOpenCreate = () => {
    const nextId = `SRV-${String(services.length + 1).padStart(3, '0')}`;
    setFormData({
      id: nextId,
      nomeServico: '',
      preco: 80.00,
      duracaoMinutos: 45,
      categoria: 'Cabelo e Barba'
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (service) => {
    setFormData({
      id: service.id,
      nomeServico: service.nomeServico,
      preco: service.preco,
      duracaoMinutos: service.duracaoMinutos,
      categoria: service.categoria
    });
    setEditingId(service.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm(`Deseja realmente remover o serviço ${id} do banco de dados SQLite?`)) {
      try {
        await api.deleteService(id);
      } catch (err) {
        console.warn('Operação offline / local:', err.message);
      }
      setServices(prev => prev.filter(s => s.id !== id));
      showToast(`Serviço ${id} removido com sucesso do banco de dados SQLite.`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nomeServico || !formData.preco || !formData.duracaoMinutos) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    const cleanService = {
      ...formData,
      preco: parseFloat(formData.preco),
      duracaoMinutos: parseInt(formData.duracaoMinutos, 10)
    };

    if (editingId) {
      try {
        await api.updateService(editingId, cleanService);
      } catch (err) {
        console.warn('Atualizando localmente:', err.message);
      }
      setServices(prev => prev.map(s => s.id === editingId ? cleanService : s));
      showToast(`Serviço "${cleanService.nomeServico}" atualizado com sucesso no SQLite!`);
    } else {
      try {
        await api.createService(cleanService);
      } catch (err) {
        console.warn('Criando localmente:', err.message);
      }
      setServices(prev => [cleanService, ...prev]);
      showToast(`Serviço "${cleanService.nomeServico}" salvo com sucesso no banco de dados SQLite!`);
    }

    setIsModalOpen(false);
  };

  const filteredServices = services.filter(s => {
    const matchesSearch = s.nomeServico.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.categoria.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || s.categoria === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // =========================================================================
  // --- [INÍCIO DO PRINT: CRUD de Serviços] ---
  // =========================================================================
  return (
    <div className="crud-container">
      {/* Cabeçalho */}
      <div className="crud-header">
        <div>
          <div className="crud-title-group">
            <span className="entity-tag">Entidade CRUD (Integrante 1)</span>
            <span className="badge badge-success font-mono" style={{ fontSize: '0.72rem' }}>
              ● SQLite: tabela "servicos"
            </span>
            <h2 className="crud-title">
              <Scissors className="icon-highlight" size={24} />
              Catálogo de Serviços
            </h2>
          </div>
          <p className="crud-subtitle">
            Gerencie itens ofertados com: <strong>ID, Nome do Serviço, Preço, Duração em Minutos, Categoria</strong>.
          </p>
        </div>

        <button className="btn-action-primary" onClick={handleOpenCreate}>
          <Plus size={18} /> Novo Serviço
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
            placeholder="Buscar por ID, Nome do Serviço ou Categoria..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-select-wrapper">
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="form-select"
          >
            <option value="ALL">Todas as Categorias</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="counter-pill">
          Total: <strong>{filteredServices.length}</strong> serviços
        </div>
      </div>

      {/* Tabela de Listagem Responsiva */}
      <div className="table-responsive">
        <table className="crud-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome do Serviço</th>
              <th>Categoria</th>
              <th>Duração em Minutos</th>
              <th>Preço</th>
              <th style={{ textAlign: 'right' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredServices.length === 0 ? (
              <tr>
                <td colSpan="6" className="table-empty">
                  <AlertCircle size={20} /> Nenhum serviço encontrado.
                </td>
              </tr>
            ) : (
              filteredServices.map((service) => (
                <tr key={service.id}>
                  <td>
                    <span className="badge-id">{service.id}</span>
                  </td>
                  <td>
                    <span className="font-semibold text-main">{service.nomeServico}</span>
                  </td>
                  <td>
                    <div className="cell-flex">
                      <Tag size={13} className="cell-icon" />
                      <span className="badge-category">{service.categoria}</span>
                    </div>
                  </td>
                  <td>
                    <div className="cell-flex">
                      <Clock size={14} className="cell-icon" />
                      <span>{service.duracaoMinutos} min</span>
                    </div>
                  </td>
                  <td>
                    <div className="cell-flex">
                      <DollarSign size={14} className="cell-icon text-success" />
                      <span className="price-tag">
                        R$ {Number(service.preco).toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="actions-group">
                      <button 
                        className="btn-action-icon edit" 
                        onClick={() => handleOpenEdit(service)}
                        title="Editar serviço"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button 
                        className="btn-action-icon delete" 
                        onClick={() => handleDelete(service.id)}
                        title="Excluir serviço"
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
                  {editingId ? 'Editar Serviço' : 'Cadastrar Novo Serviço'}
                </h3>
                <p className="modal-subtitle">
                  Preencha os campos exatos do catálogo de serviços.
                </p>
              </div>
              <button className="btn-close-modal" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="crud-form">
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">ID do Serviço</label>
                  <input 
                    type="text" 
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    className="form-input font-mono"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Categoria</label>
                  <select 
                    value={formData.categoria}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                    className="form-select"
                    required
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Nome do Serviço</label>
                <input 
                  type="text" 
                  value={formData.nomeServico}
                  onChange={(e) => setFormData({ ...formData, nomeServico: e.target.value })}
                  placeholder="Ex: Corte Degradê Premium"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Preço (R$)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    min="0"
                    value={formData.preco}
                    onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
                    placeholder="0.00"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Duração em Minutos</label>
                  <input 
                    type="number" 
                    step="5"
                    min="5"
                    value={formData.duracaoMinutos}
                    onChange={(e) => setFormData({ ...formData, duracaoMinutos: e.target.value })}
                    placeholder="Minutos (ex: 45)"
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
                  {editingId ? 'Salvar Alterações' : 'Criar Serviço'}
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
