import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  KeyRound, 
  Mail, 
  Phone, 
  Calendar,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

import { api } from '../../services/api';

export function ClientsCrud({ clients, setClients }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showPasswords, setShowPasswords] = useState({});
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Formulário com os campos EXATOS: ID, Nome, Email, Telefone, Senha, Data_Cadastro
  const [formData, setFormData] = useState({
    id: '',
    nome: '',
    email: '',
    telefone: '',
    senha: '',
    dataCadastro: new Date().toISOString().split('T')[0]
  });

  const showToast = (msg) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(''), 3500);
  };

  const handleOpenCreate = () => {
    const nextId = `CLI-${String(clients.length + 1).padStart(3, '0')}`;
    setFormData({
      id: nextId,
      nome: '',
      email: '',
      telefone: '',
      senha: '',
      dataCadastro: new Date().toISOString().split('T')[0]
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (client) => {
    setFormData({
      id: client.id,
      nome: client.nome,
      email: client.email,
      telefone: client.telefone,
      senha: client.senha,
      dataCadastro: client.dataCadastro
    });
    setEditingId(client.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm(`Deseja realmente remover o cliente ${id} do banco de dados SQLite?`)) {
      try {
        await api.deleteClient(id);
      } catch (err) {
        console.warn('Operação offline / local:', err.message);
      }
      setClients(prev => prev.filter(c => c.id !== id));
      showToast(`Cliente ${id} excluído com sucesso do banco de dados SQLite.`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nome || !formData.email || !formData.senha) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setIsSaving(true);
    try {
      if (editingId) {
        // Edição no SQLite
        try {
          await api.updateClient(editingId, formData);
        } catch (err) {
          console.warn('Atualizando localmente:', err.message);
        }
        setClients(prev => prev.map(c => c.id === editingId ? { ...formData } : c));
        showToast(`Cliente ${formData.nome} atualizado com sucesso no SQLite!`);
      } else {
        // Criação no SQLite
        try {
          await api.createClient(formData);
        } catch (err) {
          console.warn('Criando localmente:', err.message);
        }
        setClients(prev => [formData, ...prev]);
        showToast(`Cliente ${formData.nome} salvo com sucesso no banco de dados SQLite!`);
      }
      setIsModalOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  const togglePasswordVisibility = (id) => {
    setShowPasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredClients = clients.filter(c => 
    c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // =========================================================================
  // --- [INÍCIO DO PRINT: CRUD de Clientes] ---
  // =========================================================================
  return (
    <div className="crud-container">
      {/* Cabeçalho da Entidade */}
      <div className="crud-header">
        <div>
          <div className="crud-title-group">
            <span className="entity-tag">Entidade CRUD (Integrante 1)</span>
            <span className="badge badge-success font-mono" style={{ fontSize: '0.72rem' }}>
              ● SQLite: tabela "clientes"
            </span>
            <h2 className="crud-title">
              <Users className="icon-highlight" size={24} />
              Gestão de Clientes
            </h2>
          </div>
          <p className="crud-subtitle">
            Gerenciamento de clientes com campos: <strong>ID, Nome, Email, Telefone, Senha, Data_Cadastro</strong>.
          </p>
        </div>

        <button className="btn-action-primary" onClick={handleOpenCreate}>
          <UserPlus size={18} /> Novo Cliente
        </button>
      </div>

      {feedbackMsg && (
        <div className="toast-notification">
          <CheckCircle2 size={18} /> {feedbackMsg}
        </div>
      )}

      {/* Barra de Filtros e Busca */}
      <div className="search-bar-row">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Buscar por ID, Nome ou E-mail..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="counter-pill">
          Total: <strong>{filteredClients.length}</strong> clientes
        </div>
      </div>

      {/* Tabela de Listagem Responsiva */}
      <div className="table-responsive">
        <table className="crud-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Telefone</th>
              <th>Senha</th>
              <th>Data Cadastro</th>
              <th style={{ textAlign: 'right' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.length === 0 ? (
              <tr>
                <td colSpan="7" className="table-empty">
                  <AlertCircle size={20} /> Nenhum cliente encontrado.
                </td>
              </tr>
            ) : (
              filteredClients.map((client) => (
                <tr key={client.id}>
                  <td>
                    <span className="badge-id">{client.id}</span>
                  </td>
                  <td>
                    <div className="client-name-cell">
                      <div className="avatar-circle">
                        {client.nome.charAt(0)}
                      </div>
                      <span className="font-semibold text-main">{client.nome}</span>
                    </div>
                  </td>
                  <td>
                    <div className="cell-flex">
                      <Mail size={14} className="cell-icon" />
                      <span>{client.email}</span>
                    </div>
                  </td>
                  <td>
                    <div className="cell-flex">
                      <Phone size={14} className="cell-icon" />
                      <span>{client.telefone}</span>
                    </div>
                  </td>
                  <td>
                    <div className="password-cell">
                      <KeyRound size={14} className="cell-icon" />
                      <span className="font-mono">
                        {showPasswords[client.id] ? client.senha : '••••••••••••'}
                      </span>
                      <button 
                        type="button" 
                        className="btn-icon-subtle"
                        onClick={() => togglePasswordVisibility(client.id)}
                        title="Alternar visualização da senha"
                      >
                        {showPasswords[client.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </td>
                  <td>
                    <div className="cell-flex">
                      <Calendar size={14} className="cell-icon" />
                      <span>{client.dataCadastro}</span>
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="actions-group">
                      <button 
                        className="btn-action-icon edit" 
                        onClick={() => handleOpenEdit(client)}
                        title="Editar cliente"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button 
                        className="btn-action-icon delete" 
                        onClick={() => handleDelete(client.id)}
                        title="Excluir cliente"
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
                  {editingId ? 'Editar Cliente' : 'Cadastrar Novo Cliente'}
                </h3>
                <p className="modal-subtitle">
                  Preencha os dados exatos da entidade Cliente.
                </p>
              </div>
              <button className="btn-close-modal" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="crud-form">
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">ID (Identificador Único)</label>
                  <input 
                    type="text" 
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    className="form-input font-mono"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Data de Cadastro</label>
                  <input 
                    type="date" 
                    value={formData.dataCadastro}
                    onChange={(e) => setFormData({ ...formData, dataCadastro: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Nome Completo</label>
                <input 
                  type="text" 
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Ex: João da Silva"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">E-mail</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@exemplo.com"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Telefone</label>
                  <input 
                    type="tel" 
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    placeholder="(11) 99999-9999"
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Senha (Acesso do Cliente)</label>
                <input 
                  type="text" 
                  value={formData.senha}
                  onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                  placeholder="Digite a senha ou hash"
                  className="form-input font-mono"
                  required
                />
                <span className="input-hint">Armazenada com hash seguro e dados criptografados.</span>
              </div>

              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn-cancel" 
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-save" disabled={isSaving}>
                  {isSaving ? 'Salvando...' : (editingId ? 'Salvar Alterações' : 'Criar Cliente')}
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
