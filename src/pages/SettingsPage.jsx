import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Settings, Sparkles, Shield, Palette, Layers, RefreshCw, CheckCircle2 } from 'lucide-react';

export function SettingsPage() {
  const { user, tenantId, features, updateFeatures, tenantName } = useAuth();
  const { changeTenantTheme } = useTheme();

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const toggleFlag = async (flagKey) => {
    setSaving(true);
    const updated = { ...features, [flagKey]: !features[flagKey] };
    await updateFeatures(updated);
    setSaving(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2500);
  };

  const changeStrategy = async (strategyKey) => {
    setSaving(true);
    const updated = { ...features, checkoutStrategy: strategyKey };
    await updateFeatures(updated);
    setSaving(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading text-tenantText-main flex items-center gap-2">
            <Settings className="w-6 h-6 text-primary" /> Configurações de Tenant & Feature Flags
          </h1>
          <p className="text-xs text-tenantText-muted mt-0.5">
            Altere variáveis de design tokens e altere o comportamento da plataforma em tempo real ({tenantName}).
          </p>
        </div>

        {success && (
          <span className="px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-500 text-xs font-semibold flex items-center gap-1.5 border border-emerald-500/30 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4" /> Configurações atualizadas com sucesso!
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Feature Flags Section */}
        <div className="lg:col-span-7 glass-card p-6 rounded-tenant border border-surface-border space-y-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-tenant bg-primary-light text-primary">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold font-heading text-base text-tenantText-main">
                Mapa de Feature Flags do Tenant
              </h3>
              <p className="text-xs text-tenantText-muted">
                Ligue ou desligue módulos para simular variabilidade arquitetural.
              </p>
            </div>
          </div>

          <div className="divide-y divide-surface-border">
            {/* Flag 1: Products */}
            <div className="py-3.5 flex items-center justify-between">
              <div>
                <span className="font-bold text-sm text-tenantText-main block">hasProducts (Produtos & Estoque)</span>
                <span className="text-xs text-tenantText-muted">Permite inventário físico e catálogo de vendas</span>
              </div>
              <button
                onClick={() => toggleFlag('hasProducts')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  features?.hasProducts ? 'bg-primary' : 'bg-surface-dim border border-surface-border'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  features?.hasProducts ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            {/* Flag 2: Commission */}
            <div className="py-3.5 flex items-center justify-between">
              <div>
                <span className="font-bold text-sm text-tenantText-main block">hasCommission (Comissões & Relatórios)</span>
                <span className="text-xs text-tenantText-muted">Permite repasse por taxa de profissional e relatórios</span>
              </div>
              <button
                onClick={() => toggleFlag('hasCommission')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  features?.hasCommission ? 'bg-primary' : 'bg-surface-dim border border-surface-border'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  features?.hasCommission ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            {/* Flag 3: AiAnamnesis */}
            <div className="py-3.5 flex items-center justify-between">
              <div>
                <span className="font-bold text-sm text-tenantText-main block">hasAiAnamnesis (Anamnese IA - React.lazy)</span>
                <span className="text-xs text-tenantText-muted">Habilita importação dinâmica do módulo de IA</span>
              </div>
              <button
                onClick={() => toggleFlag('hasAiAnamnesis')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  features?.hasAiAnamnesis ? 'bg-primary' : 'bg-surface-dim border border-surface-border'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  features?.hasAiAnamnesis ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            {/* Flag 4: Telehealth */}
            <div className="py-3.5 flex items-center justify-between">
              <div>
                <span className="font-bold text-sm text-tenantText-main block">hasTelehealth (Portal Teleconsulta)</span>
                <span className="text-xs text-tenantText-muted">Habilita salas virtuais de vídeo encriptado</span>
              </div>
              <button
                onClick={() => toggleFlag('hasTelehealth')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  features?.hasTelehealth ? 'bg-primary' : 'bg-surface-dim border border-surface-border'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  features?.hasTelehealth ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>

          {/* Strategy Selection */}
          <div className="pt-4 border-t border-surface-border space-y-3">
            <h4 className="font-bold font-heading text-sm text-tenantText-main flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-500" /> Estratégia de Processamento de Cobrança (Strategy Pattern)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => changeStrategy('deposit_20')}
                className={`p-3.5 rounded-tenant text-left border transition-all ${
                  features?.checkoutStrategy === 'deposit_20'
                    ? 'border-primary bg-primary-light/40'
                    : 'border-surface-border bg-surface-dim/30 hover:bg-surface-dim/50'
                }`}
              >
                <span className="font-bold text-xs text-tenantText-main block">Estratégia: Deposit20Strategy</span>
                <span className="text-[11px] text-tenantText-muted block mt-1">20% Sinal Online + 80% Restante Presencial</span>
              </button>

              <button
                onClick={() => changeStrategy('full_100')}
                className={`p-3.5 rounded-tenant text-left border transition-all ${
                  features?.checkoutStrategy === 'full_100'
                    ? 'border-primary bg-primary-light/40'
                    : 'border-surface-border bg-surface-dim/30 hover:bg-surface-dim/50'
                }`}
              >
                <span className="font-bold text-xs text-tenantText-main block">Estratégia: FullPayStrategy</span>
                <span className="text-[11px] text-tenantText-muted block mt-1">100% Pagamento Prepay Antecipado</span>
              </button>
            </div>
          </div>
        </div>

        {/* Theme Design Tokens Inspector */}
        <div className="lg:col-span-5 glass-card p-6 rounded-tenant border border-surface-border space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-tenant bg-amber-500/10 text-amber-500">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold font-heading text-base text-tenantText-main">
                Design Tokens & Variáveis CSS
              </h3>
              <p className="text-xs text-tenantText-muted">
                Valores injetados no elemento raíz :root / [data-tenant]
              </p>
            </div>
          </div>

          <div className="p-4 rounded-tenant bg-surface-dim/60 font-mono text-xs text-tenantText-main border border-surface-border space-y-2">
            <div><span className="text-primary font-bold">--color-primary:</span> {tenantId === 'TenantA' ? '#d97706 (Amber/Gold)' : '#005d90 (Clinical Blue)'}</div>
            <div><span className="text-primary font-bold">--font-family-heading:</span> {tenantId === 'TenantA' ? "'Cinzel', serif" : "'Inter', sans-serif"}</div>
            <div><span className="text-primary font-bold">--font-family-sans:</span> {tenantId === 'TenantA' ? "'Outfit', sans-serif" : "'Inter', sans-serif"}</div>
            <div><span className="text-primary font-bold">--radius-tenant:</span> {tenantId === 'TenantA' ? '0.5rem' : '0.75rem'}</div>
            <div><span className="text-primary font-bold">--color-bg-main:</span> {tenantId === 'TenantA' ? '#0f1013 (Dark Vintage)' : '#f8f9fa (Clean Gray)'}</div>
          </div>

          <div className="space-y-2 pt-2">
            <label className="text-xs font-semibold text-tenantText-muted block">Simular Troca Rápida de Tema</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => changeTenantTheme('TenantA')}
                className={`py-2 rounded-tenant text-xs font-semibold transition-all border ${
                  tenantId === 'TenantA' ? 'bg-amber-600 text-white border-amber-500' : 'bg-surface-dim border-surface-border text-tenantText-main'
                }`}
              >
                Barbearia (Dark Gold)
              </button>
              <button
                onClick={() => changeTenantTheme('TenantB')}
                className={`py-2 rounded-tenant text-xs font-semibold transition-all border ${
                  tenantId === 'TenantB' ? 'bg-blue-600 text-white border-blue-500' : 'bg-surface-dim border-surface-border text-tenantText-main'
                }`}
              >
                Clínica (Clinical Blue)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
