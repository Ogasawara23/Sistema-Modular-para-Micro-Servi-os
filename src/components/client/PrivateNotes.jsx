import React, { useState } from 'react';
import { Lock, Save, Sparkles, CheckCircle2, Eye, ShieldAlert } from 'lucide-react';
import { SimulatedAPI } from '../../mocks/SimulatedAPI';

export function PrivateNotes({ client, onSaveSuccess }) {
  const [notes, setNotes] = useState(client?.privateNotes || '');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await SimulatedAPI.saveClientNotes(client.id, notes);
    setIsSaving(false);
    setSavedSuccess(true);
    if (onSaveSuccess) onSaveSuccess(notes);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="glass-card p-6 rounded-tenant border border-surface-border space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-tenant bg-amber-500/10 text-amber-500">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold font-heading text-lg text-tenantText-main flex items-center gap-2">
              Notas Privadas & Alertas Confidenciais
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500 font-normal">
                Exclusivo Tenant
              </span>
            </h4>
            <p className="text-xs text-tenantText-muted">
              Visível apenas para profissionais autorizados deste estabelecimento.
            </p>
          </div>
        </div>
        
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-4 py-2 rounded-tenant bg-primary text-primary-text hover:bg-primary-hover transition-colors font-medium text-sm flex items-center gap-2 shadow-tenant disabled:opacity-50"
        >
          {isSaving ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : savedSuccess ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {savedSuccess ? 'Salvo!' : 'Salvar Notas'}
        </button>
      </div>

      <div className="relative">
        <textarea
          rows={5}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Digite aqui observações sigilosas do cliente, sensibilidade a produtos, preferências ou histórico médico de segurança..."
          className="w-full p-4 rounded-tenant bg-surface-dim/30 border border-surface-border text-tenantText-main placeholder-tenantText-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm font-sans"
        />
      </div>

      <div className="flex items-center justify-between text-xs text-tenantText-muted pt-1">
        <span className="flex items-center gap-1">
          <ShieldAlert className="w-3.5 h-3.5 text-primary" /> Proteção de dados ativos (LGPD & Privacy Compliant)
        </span>
        <span>Última atualização: Hoje</span>
      </div>
    </div>
  );
}
