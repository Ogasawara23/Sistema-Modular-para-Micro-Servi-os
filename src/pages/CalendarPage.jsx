import React, { useState, useEffect } from 'react';
import { SimulatedAPI } from '../mocks/SimulatedAPI';
import { useAuth } from '../context/AuthContext';
import { Calendar as CalendarIcon, Clock, Plus, Filter, User, CheckCircle2, Database, Trash2, X, AlertCircle } from 'lucide-react';

export function CalendarPage() {
  const { tenantId, tenantName } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('timeline'); // 'timeline' | 'crud' | 'availability'
  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    cliente: '',
    servico: '',
    dataHora: '2026-09-25T14:30',
    status: 'Confirmado',
    observacoes: ''
  });

  const loadData = () => {
    setLoading(true);
    Promise.all([
      SimulatedAPI.getAppointments(),
      SimulatedAPI.getAvailability()
    ]).then(([apts, avails]) => {
      setAppointments(apts);
      setAvailability(avails);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, [tenantId]);

  const handleCreateAppointment = async (e) => {
    e.preventDefault();
    if (!formData.cliente || !formData.servico || !formData.dataHora) return;

    setIsSaving(true);
    try {
      await SimulatedAPI.createAppointment({
        cliente: formData.cliente,
        servico: formData.servico,
        dataHora: formData.dataHora,
        status: formData.status,
        observacoes: formData.observacoes
      });
      setShowModal(false);
      setFormData({
        cliente: '',
        servico: '',
        dataHora: '2026-09-25T14:30',
        status: 'Confirmado',
        observacoes: ''
      });
      setSuccessMsg('Agendamento salvo com sucesso no banco de dados SQLite!');
      setTimeout(() => setSuccessMsg(''), 3000);
      loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAppointment = async (id, e) => {
    e.preventDefault();
    if (!window.confirm('Deseja realmente cancelar e excluir este agendamento do SQLite?')) return;
    await SimulatedAPI.deleteAppointment(id);
    setSuccessMsg('Agendamento removido do SQLite.');
    setTimeout(() => setSuccessMsg(''), 3000);
    loadData();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-tenantText-main flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-primary" /> Agenda & Calendário Multi-Profissional
          </h1>
          <p className="text-xs text-tenantText-muted mt-0.5 flex items-center gap-2">
            <span>Gerencie os horários e atendimentos cadastrados no banco ({tenantName}).</span>
            <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-semibold border border-emerald-500/20">
              <Database className="w-2.5 h-2.5" /> SQLite Integrado
            </span>
          </p>
        </div>

        <button 
          onClick={() => setShowModal(true)}
          className="px-4 py-2 rounded-tenant bg-primary text-primary-text font-bold hover:bg-primary-hover transition-colors shadow-tenant text-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Novo Agendamento
        </button>
      </div>

      {successMsg && (
        <div className="p-3 rounded-tenant bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> {successMsg}
        </div>
      )}

      {/* Sub-tabs View Selection */}
      <div className="flex items-center gap-2 border-b border-surface-border pb-2">
        <button
          onClick={() => setActiveTab('timeline')}
          className={`px-3.5 py-1.5 rounded-tenant text-xs font-semibold transition-all ${
            activeTab === 'timeline'
              ? 'bg-primary text-primary-text shadow-sm'
              : 'text-tenantText-muted hover:text-tenantText-main hover:bg-surface-dim/40'
          }`}
        >
          Timeline Visual do Dia
        </button>
        <button
          onClick={() => setActiveTab('crud')}
          className={`px-3.5 py-1.5 rounded-tenant text-xs font-semibold transition-all flex items-center gap-1.5 ${
            activeTab === 'crud'
              ? 'bg-primary text-primary-text shadow-sm'
              : 'text-tenantText-muted hover:text-tenantText-main hover:bg-surface-dim/40'
          }`}
        >
          <Database className="w-3.5 h-3.5" /> Tabela de Agendamentos (SQLite)
        </button>
        <button
          onClick={() => setActiveTab('availability')}
          className={`px-3.5 py-1.5 rounded-tenant text-xs font-semibold transition-all flex items-center gap-1.5 ${
            activeTab === 'availability'
              ? 'bg-primary text-primary-text shadow-sm'
              : 'text-tenantText-muted hover:text-tenantText-main hover:bg-surface-dim/40'
          }`}
        >
          <Clock className="w-3.5 h-3.5" /> Escala de Disponibilidade
        </button>
      </div>

      {activeTab === 'timeline' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Date Selector Mini Box */}
          <div className="lg:col-span-4 glass-card p-5 rounded-tenant border border-surface-border space-y-4">
            <h3 className="font-bold font-heading text-sm text-tenantText-main flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" /> Seleção de Data
            </h3>
            <div className="p-4 rounded-tenant bg-surface-dim/40 border border-surface-border text-center space-y-2">
              <span className="text-xs font-semibold text-tenantText-muted uppercase tracking-wider block">Hoje</span>
              <span className="text-3xl font-bold font-heading text-primary block">28 AGO 2026</span>
              <span className="text-xs text-emerald-500 font-medium block">
                {appointments.length} Atendimentos Cadastrados
              </span>
            </div>

            <div className="p-3 rounded-tenant bg-surface-dim/30 border border-surface-border text-xs space-y-1 text-tenantText-muted">
              <span className="font-semibold text-tenantText-main block">Filtro Ativo:</span>
              <p>Exibindo agendamentos do tenant <strong>{tenantName}</strong>.</p>
            </div>
          </div>

          {/* Timeline View */}
          <div className="lg:col-span-8 glass-card p-6 rounded-tenant border border-surface-border space-y-4">
            <h3 className="font-bold font-heading text-base text-tenantText-main flex items-center justify-between">
              <span>Grade de Horários</span>
              <span className="text-xs text-tenantText-muted font-normal">Filtro: Todos os Profissionais</span>
            </h3>

            {loading ? (
              <div className="py-12 text-center text-tenantText-muted">Carregando horários...</div>
            ) : appointments.length === 0 ? (
              <div className="py-12 text-center text-tenantText-muted">Nenhum horário agendado.</div>
            ) : (
              <div className="space-y-3">
                {appointments.map((apt) => (
                  <div key={apt.id} className="p-4 rounded-tenant bg-surface-dim/30 border border-surface-border flex items-center justify-between hover:border-primary transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="text-center px-3 py-1.5 rounded-tenant bg-primary-light text-primary font-bold text-xs shrink-0 font-mono">
                        {apt.time}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-tenantText-main">{apt.client}</h4>
                        <p className="text-xs text-tenantText-muted">{apt.service} • R$ {Number(apt.price).toFixed(2)}</p>
                        {apt.observacoes && (
                          <span className="text-[11px] text-tenantText-muted italic block mt-0.5">{apt.observacoes}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-500 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {apt.status}
                      </span>
                      <button
                        onClick={(e) => handleDeleteAppointment(apt.id, e)}
                        title="Cancelar e Excluir"
                        className="opacity-0 group-hover:opacity-100 p-1 text-tenantText-muted hover:text-red-500 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'crud' && (
        <div className="glass-card p-6 rounded-tenant border border-surface-border space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold font-heading text-base text-tenantText-main">
              Gerenciamento Direto de Agendamentos (SQLite)
            </h3>
            <span className="text-xs text-tenantText-muted font-mono">{appointments.length} registros</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-surface-border text-tenantText-muted font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-3">ID</th>
                  <th className="py-3 px-3">Data e Hora</th>
                  <th className="py-3 px-3">Cliente</th>
                  <th className="py-3 px-3">Serviço</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Observações</th>
                  <th className="py-3 px-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {appointments.map((a) => (
                  <tr key={a.id} className="hover:bg-surface-dim/20 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-primary">{a.id}</td>
                    <td className="py-3 px-3 font-mono">{a.date} {a.time}</td>
                    <td className="py-3 px-3 font-medium text-tenantText-main">{a.client}</td>
                    <td className="py-3 px-3 text-tenantText-muted">{a.service}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-500">
                        {a.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-tenantText-muted truncate max-w-xs">{a.observacoes || '-'}</td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={(e) => handleDeleteAppointment(a.id, e)}
                        className="text-tenantText-muted hover:text-red-500 p-1"
                        title="Excluir"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'availability' && (
        <div className="glass-card p-6 rounded-tenant border border-surface-border space-y-4">
          <h3 className="font-bold font-heading text-base text-tenantText-main flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" /> Grade de Disponibilidade & Escala de Trabalho
          </h3>
          <p className="text-xs text-tenantText-muted">
            Horários de atendimento configurados por profissional cadastrados no banco de dados SQLite.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {availability.map((avail) => (
              <div key={avail.id} className="p-4 rounded-tenant bg-surface-dim/30 border border-surface-border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-primary">{avail.id}</span>
                  <span className="text-xs font-semibold text-tenantText-main">{avail.diaSemana}</span>
                </div>
                <h4 className="font-bold text-sm text-tenantText-main">{avail.profissional}</h4>
                <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-semibold font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{avail.horaInicio} às {avail.horaFim}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Novo Agendamento SQLite */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-md p-6 rounded-tenant border border-surface-border shadow-2xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <h3 className="font-bold font-heading text-lg text-tenantText-main flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-primary" /> Novo Agendamento (SQLite)
              </h3>
              <button onClick={() => setShowModal(false)} className="text-tenantText-muted hover:text-tenantText-main">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAppointment} className="space-y-3.5 text-sm">
              <div>
                <label className="block text-xs font-semibold text-tenantText-muted mb-1">Nome do Cliente *</label>
                <input
                  type="text"
                  required
                  value={formData.cliente}
                  onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
                  placeholder="Ex: Gabriel Duarte Silva"
                  className="w-full px-3.5 py-2 rounded-tenant bg-surface-dim/40 border border-surface-border text-tenantText-main focus:outline-none focus:ring-2 focus:ring-primary text-sm font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-tenantText-muted mb-1">Serviço Solicitado *</label>
                <input
                  type="text"
                  required
                  value={formData.servico}
                  onChange={(e) => setFormData({ ...formData, servico: e.target.value })}
                  placeholder="Ex: Corte Degradê Premium"
                  className="w-full px-3.5 py-2 rounded-tenant bg-surface-dim/40 border border-surface-border text-tenantText-main focus:outline-none focus:ring-2 focus:ring-primary text-sm font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-tenantText-muted mb-1">Data e Horário *</label>
                <input
                  type="datetime-local"
                  required
                  value={formData.dataHora}
                  onChange={(e) => setFormData({ ...formData, dataHora: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-tenant bg-surface-dim/40 border border-surface-border text-tenantText-main focus:outline-none focus:ring-2 focus:ring-primary text-sm font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-tenantText-muted mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-tenant bg-surface-dim/40 border border-surface-border text-tenantText-main focus:outline-none focus:ring-2 focus:ring-primary text-sm font-sans"
                >
                  <option value="Confirmado">Confirmado</option>
                  <option value="Pendente">Pendente</option>
                  <option value="Concluído">Concluído</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-tenantText-muted mb-1">Observações</label>
                <textarea
                  rows={2}
                  value={formData.observacoes}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  placeholder="Observações do atendimento..."
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
                  {isSaving ? 'Salvando...' : 'Salvar Agendamento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
