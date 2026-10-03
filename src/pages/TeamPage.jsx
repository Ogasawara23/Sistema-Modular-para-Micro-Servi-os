import React, { useState, useEffect } from 'react';
import { SimulatedAPI } from '../mocks/SimulatedAPI';
import { useAuth } from '../context/AuthContext';
import { UserCog, Plus, Percent, CheckCircle2 } from 'lucide-react';

export function TeamPage() {
  const { tenantId, tenantName } = useAuth();
  const [team, setTeam] = useState([]);

  useEffect(() => {
    SimulatedAPI.getTeam().then(setTeam);
  }, [tenantId]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-tenantText-main flex items-center gap-2">
            <UserCog className="w-6 h-6 text-primary" /> Equipe & Profissionais
          </h1>
          <p className="text-xs text-tenantText-muted mt-0.5">
            Membros da equipe, comissões configuradas e status de disponibilidade ({tenantName}).
          </p>
        </div>

        <button className="px-4 py-2 rounded-tenant bg-primary text-primary-text font-bold hover:bg-primary-hover transition-colors shadow-tenant text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Adicionar Profissional
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {team.map((member) => (
          <div key={member.id} className="glass-card p-5 rounded-tenant border border-surface-border space-y-4">
            <div className="flex items-center gap-4">
              <img
                src={member.avatar}
                alt={member.name}
                className="w-14 h-14 rounded-full object-cover border border-primary shrink-0"
              />
              <div>
                <h3 className="font-bold font-heading text-base text-tenantText-main">{member.name}</h3>
                <p className="text-xs text-tenantText-muted">{member.role}</p>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500 font-semibold inline-block mt-1">
                  {member.status}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-surface-border flex items-center justify-between text-xs">
              <span className="text-tenantText-muted flex items-center gap-1">
                <Percent className="w-3.5 h-3.5 text-primary" /> Taxa de Comissão:
              </span>
              <span className="font-bold text-primary font-heading text-sm">{member.commissionRate}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
