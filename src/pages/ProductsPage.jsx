import React, { useState, useEffect } from 'react';
import { SimulatedAPI } from '../mocks/SimulatedAPI';
import { useAuth } from '../context/AuthContext';
import { FeatureGate } from '../components/common/FeatureGate';
import { Package, Plus, AlertTriangle, Layers } from 'lucide-react';

export function ProductsPage() {
  const { tenantId, tenantName } = useAuth();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    SimulatedAPI.getProducts().then(setProducts);
  }, [tenantId]);

  return (
    <FeatureGate
      flagName="hasProducts"
      title="Módulo de Produtos & Controle de Estoque"
      description="Este tenant não tem autorização para venda de produtos físicos ou controle de inventário."
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-heading text-tenantText-main flex items-center gap-2">
              <Package className="w-6 h-6 text-primary" /> Inventário de Produtos — {tenantName}
            </h1>
            <p className="text-xs text-tenantText-muted mt-0.5">
              Controle de itens em estoque, preços e reabastecimento.
            </p>
          </div>

          <button className="px-4 py-2 rounded-tenant bg-primary text-primary-text font-bold hover:bg-primary-hover transition-colors shadow-tenant text-sm flex items-center gap-2">
            <Plus className="w-4 h-4" /> Novo Produto
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {products.map((prod) => (
            <div key={prod.id} className="glass-card p-5 rounded-tenant border border-surface-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary-light text-primary">
                  {prod.code}
                </span>
                <span className="text-xs text-tenantText-muted">{prod.category}</span>
              </div>

              <h3 className="font-bold font-heading text-base text-tenantText-main">{prod.name}</h3>

              <div className="flex items-center justify-between pt-2 border-t border-surface-border text-xs">
                <span className="text-tenantText-muted">Estoque: <strong className="text-tenantText-main">{prod.stock} un.</strong></span>
                <span className="text-base font-bold text-primary">R$ {prod.price.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </FeatureGate>
  );
}
