import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Scissors, Stethoscope, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { GoogleLoginScreen } from '../components/readonly/GoogleLoginScreen';

export function LoginPage() {
  const { tenantId, switchTenantUser } = useAuth();
  const navigate = useNavigate();

  const handleSelect = async (selectedTenant) => {
    await switchTenantUser(selectedTenant);
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-10">
      <div className="text-center space-y-3">
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary-light text-primary border border-primary/20">
          SaaS Multi-Tenant Authentication Simulator
        </span>
        <h1 className="text-3xl font-bold font-heading text-tenantText-main">
          Selecione o Tenant para Autenticação
        </h1>
        <p className="text-sm text-tenantText-muted max-w-xl mx-auto">
          Escolha um ambiente simulado para visualizar como a arquitetura adapta as variáveis CSS de tema, rotas e regras de negócio.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tenant A Box */}
        <div
          onClick={() => handleSelect('TenantA')}
          className={`glass-card p-8 rounded-tenant border cursor-pointer transition-all hover:scale-[1.02] space-y-5 ${
            tenantId === 'TenantA' || tenantId === 'BARBER' ? 'border-amber-500 ring-2 ring-amber-500/30' : 'border-surface-border hover:border-amber-500'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-tenant bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold text-2xl">
              <Scissors className="w-6 h-6" />
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-500">
              Tenant A
            </span>
          </div>

          <div>
            <h3 className="text-xl font-bold font-heading text-tenantText-main">Barba & Navalha Club</h3>
            <p className="text-xs text-tenantText-muted mt-1">
              Segmento: Barbearia & Salão Studio (Tipo: salao)
            </p>
          </div>

          <div className="space-y-2 text-xs text-tenantText-muted border-t border-surface-border pt-4">
            <div>• Tema: <strong className="text-amber-500">Dark Vintage / Amber Gold</strong></div>
            <div>• Estratégia PDV: <strong>Deposit20Strategy (20% Sinal)</strong></div>
            <div>• Feature Anamnese IA: <strong className="text-red-400">Desativada</strong></div>
            <div>• Feature Teleconsulta: <strong className="text-red-400">Desativada</strong></div>
          </div>

          <button className="w-full py-2.5 rounded-tenant bg-amber-500 text-white font-bold hover:bg-amber-600 transition-colors text-sm flex items-center justify-center gap-2">
            Entrar como Barbearia <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Tenant B Box */}
        <div
          onClick={() => handleSelect('TenantB')}
          className={`glass-card p-8 rounded-tenant border cursor-pointer transition-all hover:scale-[1.02] space-y-5 ${
            tenantId === 'TenantB' || tenantId === 'CLINIC' ? 'border-blue-500 ring-2 ring-blue-500/30' : 'border-surface-border hover:border-blue-500'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-tenant bg-blue-500/20 text-blue-500 flex items-center justify-center font-bold text-2xl">
              <Stethoscope className="w-6 h-6" />
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-500">
              Tenant B
            </span>
          </div>

          <div>
            <h3 className="text-xl font-bold font-heading text-tenantText-main">Clínica Mente & Corpo</h3>
            <p className="text-xs text-tenantText-muted mt-1">
              Segmento: Saúde Integrada & Psicologia (Tipo: consultoria)
            </p>
          </div>

          <div className="space-y-2 text-xs text-tenantText-muted border-t border-surface-border pt-4">
            <div>• Tema: <strong className="text-blue-500">Clinical Blue (DESIGN.md)</strong></div>
            <div>• Estratégia PDV: <strong>FullPayStrategy (100% Prepay)</strong></div>
            <div>• Feature Anamnese IA: <strong className="text-emerald-500">Ativa (React.lazy)</strong></div>
            <div>• Feature Teleconsulta: <strong className="text-emerald-500">Ativa</strong></div>
          </div>

          <button className="w-full py-2.5 rounded-tenant bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors text-sm flex items-center justify-center gap-2">
            Entrar como Clínica <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Google SSO Login Integration Component */}
      <div className="pt-6 border-t border-surface-border">
        <GoogleLoginScreen />
      </div>
    </div>
  );
}
