import React, { useState, useEffect } from 'react';
import { SimulatedAPI } from '../mocks/SimulatedAPI';
import { useAuth } from '../context/AuthContext';
import { Users, Search, UserPlus, ArrowRight, Shield, Sparkles, Trash2, X, CheckCircle2, Database } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ClientsPage() {
  const { tenantId, tenantName, features } = useAuth();
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    senha: '',
    dataCadastro: new Date().toISOString().split('T')[0]
  });

  const loadClients = () => {
    setLoading(true);
    SimulatedAPI.getClients().then((data) => {
      setClients(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadClients();
  }, [tenantId]);

  const handleCreateClient = async (e) => {
    e.preventDefault();
    if (!formData.nome || !formData.email) return;

    setIsSaving(true);
    try {
      await SimulatedAPI.createClient({
        name: formData.nome,
        email: formData.email,
        phone: formData.telefone,
        senha: formData.senha || 'senha123',
        dataCadastro: formData.dataCadastro
      });
      setShowModal(false);
      setFormData({
        nome: '',
        email: '',
        telefone: '',
        senha: '',
        dataCadastro: new Date().toISOString().split('T')[0]
      });
      setSuccessMsg('Cliente salvo com sucesso no banco de dados SQLite!');
      setTimeout(() => setSuccessMsg(''), 3000);
      loadClients();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClient = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm('Deseja realmente remover este cliente do SQLite?')) return;
    await SimulatedAPI.deleteClient(id);
    setSuccessMsg('Cliente removido do banco de dados SQLite.');
    setTimeout(() => setSuccessMsg(''), 3000);
    loadClients();
  };

  const filteredClients = clients.filter(c => 
    (c.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-tenantText-main flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" /> Base de Clientes — {tenantName}
          </h1>
          <p className="text-xs text-tenantText-muted mt-0.5 flex items-center gap-2">
            <span>Gerencie perfis, histórico de atendimentos e dados cadastrais.</span>
            <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-semibold border border-emerald-500/20">
              <Database className="w-2.5 h-2.5" /> SQLite Integrado
            </span>
          </p>
        </div>

        <button 
          onClick={() => setShowModal(true)}
          className="px-4 py-2 rounded-tenant bg-primary text-primary-text font-bold hover:bg-primary-hover transition-colors shadow-tenant text-sm flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" /> Cadastrar Cliente
        </button>
      </div>

      {successMsg && (
        <div className="p-3 rounded-tenant bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> {successMsg}
        </div>
      )}

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-3 text-tenantText-muted" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nome ou e-mail..."
          className="w-full pl-10 pr-4 py-2.5 rounded-tenant bg-surface-card border border-surface-border text-tenantText-main focus:outline-none focus:ring-2 focus:ring-primary text-sm font-sans"
        />
      </div>

      {/* Clients Grid */}
      {loading ? (
        <div className="py-12 text-center text-tenantText-muted">Carregando clientes do SQLite...</div>
      ) : filteredClients.length === 0 ? (
        <div className="glass-card p-12 rounded-tenant text-center text-tenantText-muted">
          Nenhum cliente encontrado. Clique em "Cadastrar Cliente" para registrar no SQLite.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredClients.map((cli) => (
            <div key={cli.id} className="glass-card p-5 rounded-tenant border border-surface-border space-y-4 hover:border-primary transition-all relative group">
              <div className="flex items-center gap-4">
                <img
                  src={cli.avatar}
                  alt={cli.name}
                  className="w-14 h-14 rounded-full object-cover border border-primary shrink-0"
                />
                <div className="overflow-hidden flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold font-heading text-base text-tenantText-main truncate">{cli.name}</h3>
                    <button
                      onClick={(e) => handleDeleteClient(cli.id, e)}
                      title="Excluir do SQLite"
                      className="opacity-0 group-hover:opacity-100 p-1 text-tenantText-muted hover:text-red-500 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-tenantText-muted truncate">{cli.email}</p>
                  <span className="text-[11px] text-tenantText-muted block mt-0.5">{cli.phone}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-surface-border">
                <span className="text-tenantText-muted">
                  ID: <strong className="font-mono text-tenantText-main">{cli.id}</strong>
                </span>
                <Link
                  to={`/clients/${cli.id}`}
                  className="px-3 py-1.5 rounded-tenant bg-primary-light text-primary font-semibold hover:bg-primary hover:text-primary-text transition-colors flex items-center gap-1"
                >
                  Ver Perfil <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Cadastro de Cliente conectado ao SQLite */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-md p-6 rounded-tenant border border-surface-border shadow-2xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <h3 className="font-bold font-heading text-lg text-tenantText-main flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-primary" /> Novo Cliente (SQLite)
              </h3>
              <button onClick={() => setShowModal(false)} className="text-tenantText-muted hover:text-tenantText-main">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateClient} className="space-y-3.5 text-sm">
              <div>
                <label className="block text-xs font-semibold text-tenantText-muted mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Ex: João da Silva"
                  className="w-full px-3.5 py-2 rounded-tenant bg-surface-dim/40 border border-surface-border text-tenantText-main focus:outline-none focus:ring-2 focus:ring-primary text-sm font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-tenantText-muted mb-1">E-mail *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="joao@exemplo.com"
                  className="w-full px-3.5 py-2 rounded-tenant bg-surface-dim/40 border border-surface-border text-tenantText-main focus:outline-none focus:ring-2 focus:ring-primary text-sm font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-tenantText-muted mb-1">Telefone</label>
                <input
                  type="text"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  placeholder="(11) 99999-8888"
                  className="w-full px-3.5 py-2 rounded-tenant bg-surface-dim/40 border border-surface-border text-tenantText-main focus:outline-none focus:ring-2 focus:ring-primary text-sm font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-tenantText-muted mb-1">Senha de Acesso</label>
                <input
                  type="password"
                  value={formData.senha}
                  onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2 rounded-tenant bg-surface-dim/40 border border-surface-border text-tenantText-main focus:outline-none focus:ring-2 focus:ring-primary text-sm font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-tenantText-muted mb-1">Data de Cadastro</label>
                <input
                  type="date"
                  value={formData.dataCadastro}
                  onChange={(e) => setFormData({ ...formData, dataCadastro: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-tenant bg-surface-dim/40 border border-surface-border text-tenantText-main focus:outline-none focus:ring-2 focus:ring-primary text-sm font-sans"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-border">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-tenant border border-surface-border text-tenantText-muted hover:bg-surface-dim/40 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 rounded-tenant bg-primary text-primary-text font-bold hover:bg-primary-hover transition-colors shadow-tenant text-xs flex items-center gap-1.5 disabled:opacity-60"
                >
                  {isSaving ? 'Salvando no SQLite...' : 'Salvar no Banco'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
