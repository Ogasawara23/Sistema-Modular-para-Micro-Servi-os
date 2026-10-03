import React, { Suspense, lazy } from 'react';
import { useAuth } from '../context/AuthContext';
import { FeatureGate } from '../components/common/FeatureGate';

// Requirement: Dynamically import AiAnamnesisModule via React.lazy
const AiAnamnesisModuleLazy = lazy(() => import('../components/anamnesis/AiAnamnesisModule'));

export function AnamnesisPage() {
  const { features } = useAuth();

  return (
    <FeatureGate
      flagName="hasAiAnamnesis"
      title="Anamnese Inteligente por IA Generativa"
      description="Este módulo de inteligência preditiva e anamnese automatizada está desativado para o tenant ativo. Ative a flag 'hasAiAnamnesis' nas configurações para visualizar este recurso."
    >
      <Suspense
        fallback={
          <div className="glass-card p-12 rounded-tenant text-center space-y-3">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-semibold text-tenantText-main">
              Carregando Módulo IA Dinamicamente (React.lazy)...
            </p>
          </div>
        }
      >
        <AiAnamnesisModuleLazy />
      </Suspense>
    </FeatureGate>
  );
}
