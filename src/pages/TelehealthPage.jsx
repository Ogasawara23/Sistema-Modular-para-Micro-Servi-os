import React, { useState, useEffect } from 'react';
import { SimulatedAPI } from '../mocks/SimulatedAPI';
import { useAuth } from '../context/AuthContext';
import { FeatureGate } from '../components/common/FeatureGate';
import { Video, ExternalLink, ShieldCheck, Play } from 'lucide-react';

export function TelehealthPage() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    SimulatedAPI.getTelehealthSessions().then(setSessions);
  }, []);

  return (
    <FeatureGate
      flagName="hasTelehealth"
      title="Portal de Teleconsulta & Vídeo Encriptado"
      description="Esta funcionalidade de telemedicina/consultas remotas está desativada no plano deste tenant."
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-heading text-tenantText-main flex items-center gap-2">
              <Video className="w-6 h-6 text-primary" /> Sala Virtual de Teleconsulta (Telehealth)
            </h1>
            <p className="text-xs text-tenantText-muted mt-0.5">
              Atendimentos remotos com vídeo HD, chat e prontuário integrado.
            </p>
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> Criptografia Ponta-a-Ponta Ativa
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {sessions.map((session) => (
            <div key={session.id} className="glass-card p-6 rounded-tenant border border-surface-border space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary-light text-primary">
                  {session.time}
                </span>
                <span className="text-xs text-emerald-500 font-semibold">{session.status}</span>
              </div>

              <div>
                <h3 className="font-bold font-heading text-lg text-tenantText-main">{session.patientName}</h3>
                <p className="text-xs text-tenantText-muted mt-0.5">Profissional: {session.doctor}</p>
              </div>

              <a
                href={session.roomUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 rounded-tenant bg-primary text-primary-text font-bold hover:bg-primary-hover transition-colors text-xs flex items-center justify-center gap-2 shadow-tenant"
              >
                <Play className="w-4 h-4 fill-current" /> Entrar na Sala de Vídeo
              </a>
            </div>
          ))}
        </div>
      </div>
    </FeatureGate>
  );
}
