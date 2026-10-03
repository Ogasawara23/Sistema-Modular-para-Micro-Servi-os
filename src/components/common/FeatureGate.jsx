import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Lock, Sparkles, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * FeatureGate Component
 * High variability wrapper that conditionally mounts features or displays
 * an enterprise upgrade / flag disabled banner.
 */
export function FeatureGate({ flagName, title, description, children }) {
  const { features, tenantName } = useAuth();
  const isEnabled = Boolean(features?.[flagName]);

  if (isEnabled) {
    return <>{children}</>;
  }

  return (
    <div className="glass-card p-8 rounded-tenant text-center max-w-2xl mx-auto my-12 border border-surface-border">
      <div className="w-16 h-16 rounded-full bg-primary-light text-primary flex items-center justify-center mx-auto mb-4 animate-pulse">
        <Lock className="w-8 h-8" />
      </div>
      
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-500 mb-3">
        <Sparkles className="w-3.5 h-3.5" /> Feature Flag Inativa para {tenantName}
      </div>

      <h3 className="text-2xl font-bold font-heading mb-2 text-tenantText-main">
        {title || 'Módulo Não Habilitado'}
      </h3>

      <p className="text-tenantText-muted mb-6 text-sm leading-relaxed max-w-lg mx-auto">
        {description || `A funcionalidade '${flagName}' está desativada no contrato ou plano atual deste tenant. Você pode alternar o tenant no topo da tela ou ativar a flag nas Configurações.`}
      </p>

      <div className="flex items-center justify-center gap-4">
        <Link
          to="/settings"
          className="px-5 py-2.5 rounded-tenant font-semibold bg-primary text-primary-text hover:bg-primary-hover transition-colors shadow-tenant text-sm inline-flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" /> Gerenciar Feature Flags
        </Link>
      </div>
    </div>
  );
}
