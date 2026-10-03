import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SimulatedAPI } from '../mocks/SimulatedAPI';
import { ClientProfile } from '../components/client/ClientProfile';
import { ArrowLeft } from 'lucide-react';

export function ClientDetailPage() {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    SimulatedAPI.getClientById(id || 'cli_b1').then((data) => {
      setClient(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        to="/clients"
        className="inline-flex items-center gap-2 text-xs font-semibold text-tenantText-muted hover:text-tenantText-main transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar para Lista de Clientes
      </Link>

      <ClientProfile client={client} />
    </div>
  );
}
