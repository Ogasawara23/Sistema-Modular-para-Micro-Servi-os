import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { SimulatedAPI } from '../mocks/SimulatedAPI';
import { getCheckoutStrategy, processCheckout } from '../strategies/checkoutStrategies';
import { ShoppingCart, Layers, Plus, Trash2, CheckCircle2, ShieldCheck, CreditCard, QrCode, Sparkles } from 'lucide-react';
import { BookingFlow } from '../components/BookingFlow';
import { tenantConfigManager } from '../patterns/singletons/TenantConfigManager';
import { sessionManager } from '../patterns/singletons/SessionManager';

export function CheckoutPage() {
  const { user, tenantType, tenantName, features, tenantId } = useAuth();
  const [activeTab, setActiveTab] = useState('pdv'); // 'pdv' | 'gof'
  const [availableServices, setAvailableServices] = useState([]);
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('Pix');
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutResult, setCheckoutResult] = useState(null);

  // Strategy Pattern Calculation
  const activeStrategy = getCheckoutStrategy(tenantType, features?.checkoutStrategy);

  useEffect(() => {
    SimulatedAPI.getServices().then((services) => {
      setAvailableServices(services);
      if (services.length > 0) {
        setCart([{ ...services[0], quantity: 1 }]);
      }
    });
  }, [tenantType, tenantId]);

  const addToCart = (service) => {
    const existing = cart.find(i => i.id === service.id);
    if (existing) {
      setCart(cart.map(i => i.id === service.id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      setCart([...cart, { ...service, quantity: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(i => i.id !== id));
  };

  const subtotal = cart.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);
  const paymentBreakdown = activeStrategy.calculatePayment(subtotal);

  const handleExecuteCheckout = async () => {
    if (cart.length === 0) return;
    setIsProcessing(true);
    try {
      const result = await processCheckout({
        items: cart,
        userTenant: { tenantId: user?.tenantId || tenantId, tenantType, features },
        paymentMethod,
        simulatedApi: SimulatedAPI
      });
      setCheckoutResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="glass-card p-6 rounded-tenant border border-surface-border flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 inline-flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" /> Strategy Pattern Actively Binding
          </span>
          <h1 className="text-2xl font-bold font-heading text-tenantText-main mt-1">
            Checkout & PDV — {tenantName}
          </h1>
          <p className="text-xs text-tenantText-muted mt-0.5">
            Estratégia Atual: <strong>{activeStrategy.label}</strong>
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-surface-dim/40 p-1 rounded-tenant border border-surface-border text-xs">
          <button
            onClick={() => setActiveTab('pdv')}
            className={`px-3 py-1.5 rounded-tenant-sm font-semibold transition-all ${
              activeTab === 'pdv'
                ? 'bg-primary text-primary-text shadow-sm'
                : 'text-tenantText-muted hover:text-tenantText-main'
            }`}
          >
            Checkout PDV Rápido
          </button>
          <button
            onClick={() => setActiveTab('gof')}
            className={`px-3 py-1.5 rounded-tenant-sm font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'gof'
                ? 'bg-primary text-primary-text shadow-sm'
                : 'text-tenantText-muted hover:text-tenantText-main'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Fluxo GoF (8 Padrões)
          </button>
        </div>
      </div>

      {activeTab === 'gof' ? (
        <div className="space-y-4">
          <BookingFlow 
            key={tenantId}
            currentTenant={tenantConfigManager.getTenant()} 
            currentUser={user || sessionManager.getUser()} 
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Available Items Column */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="font-bold font-heading text-base text-tenantText-main flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-primary" /> Adicionar Serviços ao Carrinho
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {availableServices.map((srv) => (
                <div key={srv.id} className="glass-card p-4 rounded-tenant border border-surface-border flex flex-col justify-between hover:border-primary transition-all">
                  <div>
                    <h4 className="font-bold text-sm text-tenantText-main">{srv.name}</h4>
                    <p className="text-xs text-tenantText-muted mt-1">Duração: {srv.duration}</p>
                    <span className="text-base font-bold text-primary block mt-2">R$ {Number(srv.price).toFixed(2)}</span>
                  </div>
                  <button
                    onClick={() => addToCart(srv)}
                    className="mt-3 py-1.5 px-3 rounded-tenant bg-primary-light text-primary hover:bg-primary hover:text-primary-text font-semibold text-xs transition-colors flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Adicionar
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Cart & Strategy Payment Summary Column */}
          <div className="lg:col-span-5 glass-card p-6 rounded-tenant border border-surface-border space-y-5">
            <h3 className="font-bold font-heading text-base text-tenantText-main flex items-center justify-between border-b border-surface-border pb-3">
              <span>Resumo do Pedido</span>
              <span className="text-xs font-normal text-tenantText-muted">{cart.length} itens</span>
            </h3>

            {/* Cart List */}
            <div className="divide-y divide-surface-border max-h-48 overflow-y-auto">
              {cart.length === 0 ? (
                <p className="text-xs text-tenantText-muted py-6 text-center">Carrinho vazio.</p>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-tenantText-main">{item.name}</span>
                      <span className="block text-tenantText-muted">qtd: {item.quantity} × R$ {Number(item.price).toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-tenantText-main">R$ {(Number(item.price) * item.quantity).toFixed(2)}</span>
                      <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2 pt-2 border-t border-surface-border">
              <label className="text-xs font-semibold text-tenantText-muted block">Forma de Pagamento Online</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setPaymentMethod('Pix')}
                  className={`py-2 rounded-tenant text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                    paymentMethod === 'Pix'
                      ? 'bg-primary text-primary-text border-primary'
                      : 'bg-surface-dim/40 border-surface-border text-tenantText-main'
                  }`}
                >
                  <QrCode className="w-4 h-4" /> Pix Instantâneo
                </button>
                <button
                  onClick={() => setPaymentMethod('Cartão de Crédito')}
                  className={`py-2 rounded-tenant text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                    paymentMethod === 'Cartão de Crédito'
                      ? 'bg-primary text-primary-text border-primary'
                      : 'bg-surface-dim/40 border-surface-border text-tenantText-main'
                  }`}
                >
                  <CreditCard className="w-4 h-4" /> Cartão Crédito
                </button>
              </div>
            </div>

            {/* Strategy Breakdown Card */}
            <div className="p-4 rounded-tenant bg-surface-dim/50 border border-surface-border space-y-2 text-xs">
              <div className="flex items-center justify-between text-tenantText-muted">
                <span>Subtotal dos Serviços:</span>
                <span>R$ {subtotal.toFixed(2)}</span>
              </div>
              
              <div className="p-2.5 rounded bg-primary-light/40 border border-primary/20 space-y-1">
                <div className="flex items-center justify-between font-bold text-tenantText-main text-sm">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" /> A Cobrar Agora:
                  </span>
                  <span className="text-emerald-500 font-heading text-lg">
                    R$ {paymentBreakdown.nowPayable.toFixed(2)}
                  </span>
                </div>
                <p className="text-[11px] text-tenantText-muted">{paymentBreakdown.summary}</p>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleExecuteCheckout}
              disabled={isProcessing || cart.length === 0}
              className="w-full py-3.5 rounded-tenant bg-primary text-primary-text font-bold hover:bg-primary-hover transition-colors shadow-tenant text-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <CheckCircle2 className="w-5 h-5" />
              )}
              {isProcessing ? 'Processando Estratégia...' : `Confirmar R$ ${paymentBreakdown.nowPayable.toFixed(2)} (${activeStrategy.badgeText})`}
            </button>

            {/* Success Modal / Result */}
            {checkoutResult && (
              <div className="p-4 rounded-tenant bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-2 text-emerald-600 dark:text-emerald-400 animate-fadeIn">
                <div className="flex items-center justify-between font-bold text-sm">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Pagamento Processado!
                  </span>
                  <span>{checkoutResult.transactionId}</span>
                </div>
                <p className="text-[11px]">Estratégia Executada: <strong>{checkoutResult.strategyUsed}</strong></p>
                <p className="text-[11px]">Forma: {checkoutResult.paymentMethod} • Tenant: {checkoutResult.tenantId}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
