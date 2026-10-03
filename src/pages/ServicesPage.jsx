import React, { useState, useEffect } from 'react';
import { SimulatedAPI } from '../mocks/SimulatedAPI';
import { useAuth } from '../context/AuthContext';
import { getCheckoutStrategy } from '../strategies/checkoutStrategies';
import { Briefcase, Clock, Plus, Layers, Trash2, X, CheckCircle2, Database } from 'lucide-react';

export function ServicesPage() {
  const { tenantId, tenantName, tenantType, features } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    nomeServico: '',
    preco: '',
    duracaoMinutos: 45,
    categoria: 'Geral'
  });

  const activeStrategy = getCheckoutStrategy(tenantType, features?.checkoutStrategy);

  const loadServices = () => {
    setLoading(true);
    SimulatedAPI.getServices().then((data) => {
      setServices(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadServices();
  }, [tenantId]);

  const handleCreateService = async (e) => {
    e.preventDefault();
    if (!formData.nomeServico || !formData.preco) return;

    setIsSaving(true);
    try {
      await SimulatedAPI.createService({
        name: formData.nomeServico,
        price: parseFloat(formData.preco),
        duracaoMinutos: parseInt(formData.duracaoMinutos, 10),
        duration: `${formData.duracaoMinutos} min`,
        category: formData.categoria
      });
      setShowModal(false);
      setFormData({
        nomeServico: '',
        preco: '',
        duracaoMinutos: 45,
        categoria: 'Geral'
      });
      setSuccessMsg('Serviço cadastrado com sucesso no banco de dados SQLite!');
      setTimeout(() => setSuccessMsg(''), 3000);
      loadServices();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteService = async (id, e) => {
    e.preventDefault();
    if (!window.confirm('Deseja realmente excluir este serviço do SQLite?')) return;
    await SimulatedAPI.deleteService(id);
    setSuccessMsg('Serviço excluído do banco de dados SQLite.');
    setTimeout(() => setSuccessMsg(''), 3000);
    loadServices();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-tenantText-main flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-primary" /> Catálogo de Serviços & Procedimentos
          </h1>
          <p className="text-xs text-tenantText-muted mt-0.5 flex items-center gap-2">
            <span>Configuração de duração, valores e regras de cobrança ({tenantName}).</span>
            <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-semibold border border-emerald-500/20">
              <Database className="w-2.5 h-2.5" /> SQLite Integrado
            </span>
          </p>
        </div>

        <button 
          onClick={() => setShowModal(true)}
          className="px-4 py-2 rounded-tenant bg-primary text-primary-text font-bold hover:bg-primary-hover transition-colors shadow-tenant text-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Novo Serviço
        </button>
      </div>

      {successMsg && (
        <div className="p-3 rounded-tenant bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> {successMsg}
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-tenantText-muted">Carregando serviços do SQLite...</div>
      ) : services.length === 0 ? (
        <div className="glass-card p-12 rounded-tenant text-center text-tenantText-muted">
          Nenhum serviço cadastrado. Clique em "Novo Serviço" para adicionar ao SQLite.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {services.map((srv) => {
            const breakdown = activeStrategy.calculatePayment(srv.price);

            return (
              <div key={srv.id} className="glass-card p-6 rounded-tenant border border-surface-border space-y-4 hover:border-primary transition-all relative group">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary-light text-primary">
                      {srv.category}
                    </span>
                    <h3 className="font-bold font-heading text-lg text-tenantText-main mt-1">{srv.name}</h3>
                  </div>
                  <div className="text-right flex items-start gap-3">
                    <div>
                      <span className="text-xl font-bold font-heading text-primary block">
                        R$ {Number(srv.price).toFixed(2)}
                      </span>
                      <span className="text-xs text-tenantText-muted flex items-center justify-end gap-1">
                        <Clock className="w-3 h-3" /> {srv.duration}
                      </span>
                    </div>
                    <button
                      onClick={(e) => handleDeleteService(srv.id, e)}
                      title="Excluir do SQLite"
                      className="opacity-0 group-hover:opacity-100 p-1 text-tenantText-muted hover:text-red-500 transition-all mt-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-tenantText-muted leading-relaxed">
                  {srv.description}
                </p>

                <div className="p-3 rounded-tenant bg-surface-dim/40 border border-surface-border text-xs flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-tenantText-muted font-medium">
                    <Layers className="w-3.5 h-3.5 text-emerald-500" />
                    Estratégia {activeStrategy.badgeText}:
                  </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    R$ {breakdown.nowPayable.toFixed(2)} no agendamento
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Criação de Serviço SQLite */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-md p-6 rounded-tenant border border-surface-border shadow-2xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <h3 className="font-bold font-heading text-lg text-tenantText-main flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" /> Novo Serviço (SQLite)
              </h3>
              <button onClick={() => setShowModal(false)} className="text-tenantText-muted hover:text-tenantText-main">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateService} className="space-y-3.5 text-sm">
              <div>
                <label className="block text-xs font-semibold text-tenantText-muted mb-1">Nome do Serviço *</label>
                <input
                  type="text"
                  required
                  value={formData.nomeServico}
                  onChange={(e) => setFormData({ ...formData, nomeServico: e.target.value })}
                  placeholder="Ex: Corte Degradê Premium"
                  className="w-full px-3.5 py-2 rounded-tenant bg-surface-dim/40 border border-surface-border text-tenantText-main focus:outline-none focus:ring-2 focus:ring-primary text-sm font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-tenantText-muted mb-1">Preço (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.preco}
                    onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
                    placeholder="95.00"
                    className="w-full px-3.5 py-2 rounded-tenant bg-surface-dim/40 border border-surface-border text-tenantText-main focus:outline-none focus:ring-2 focus:ring-primary text-sm font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-tenantText-muted mb-1">Duração (Minutos) *</label>
                  <input
                    type="number"
                    required
                    value={formData.duracaoMinutos}
                    onChange={(e) => setFormData({ ...formData, duracaoMinutos: e.target.value })}
                    placeholder="45"
                    className="w-full px-3.5 py-2 rounded-tenant bg-surface-dim/40 border border-surface-border text-tenantText-main focus:outline-none focus:ring-2 focus:ring-primary text-sm font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-tenantText-muted mb-1">Categoria</label>
                <input
                  type="text"
                  value={formData.categoria}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                  placeholder="Ex: Cabelo e Barba / Estética"
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
                  {isSaving ? 'Salvando no SQLite...' : 'Cadastrar no Banco'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
