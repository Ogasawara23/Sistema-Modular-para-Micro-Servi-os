/**
 * checkoutStrategies.js
 * Implementation of the Strategy Design Pattern for multi-tenant checkout payments.
 * 
 * Tenants of type 'salao' (Barbearia/Salon) apply a 20% Deposit strategy.
 * Tenants of type 'consultoria' (Clínica/Healthcare) apply a 100% Prepayment strategy.
 */

// Abstract Strategy Contract Interface simulation
class CheckoutStrategy {
  calculatePayment(totalAmount) {
    throw new Error('calculatePayment method must be implemented by strategy');
  }
}

/**
 * Strategy 1: Deposit Payment (20% online deposit now, 80% due at venue/service time)
 * Preferred for Salão / Barbearia
 */
export class Deposit20Strategy extends CheckoutStrategy {
  constructor() {
    super();
    this.key = 'deposit_20';
    this.label = 'Sinal de 20% Online (80% Restante no Local)';
    this.badgeText = '20% Sinal';
  }

  calculatePayment(totalAmount) {
    const depositPercent = 0.20;
    const nowPayable = Math.round(totalAmount * depositPercent * 100) / 100;
    const remainingPayable = Math.round((totalAmount - nowPayable) * 100) / 100;

    return {
      strategyKey: this.key,
      strategyLabel: this.label,
      totalAmount,
      nowPayable,
      remainingPayable,
      percentagePaid: '20%',
      summary: `Cobrando R$ ${nowPayable.toFixed(2).replace('.', ',')} (20% de sinal) agora. Restam R$ ${remainingPayable.toFixed(2).replace('.', ',')} a pagar presencialmente.`,
      requiresInPersonBalance: true
    };
  }
}

/**
 * Strategy 2: Full Prepayment (100% online prepayment required)
 * Preferred for Clínica / Consultoria / Telemedicina
 */
export class FullPayStrategy extends CheckoutStrategy {
  constructor() {
    super();
    this.key = 'full_100';
    this.label = 'Pagamento Integral (100% Antecipado)';
    this.badgeText = '100% Antecipado';
  }

  calculatePayment(totalAmount) {
    const nowPayable = Math.round(totalAmount * 100) / 100;
    const remainingPayable = 0;

    return {
      strategyKey: this.key,
      strategyLabel: this.label,
      totalAmount,
      nowPayable,
      remainingPayable,
      percentagePaid: '100%',
      summary: `Cobrando R$ ${nowPayable.toFixed(2).replace('.', ',')} (100% do valor) antecipadamente. Atendimento liberado sem saldo pendente.`,
      requiresInPersonBalance: false
    };
  }
}

/**
 * Strategy Factory / Resolver Context
 */
export function getCheckoutStrategy(tenantType, strategyOverride = null) {
  if (strategyOverride === 'deposit_20' || tenantType === 'salao') {
    return new Deposit20Strategy();
  }
  if (strategyOverride === 'full_100' || tenantType === 'consultoria') {
    return new FullPayStrategy();
  }
  // Fallback default based on tenantType
  return tenantType === 'salao' ? new Deposit20Strategy() : new FullPayStrategy();
}

/**
 * Main Checkout Function executing the Strategy Pattern
 */
export async function processCheckout({ items, userTenant, paymentMethod = 'Pix', simulatedApi }) {
  const subtotal = items.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);
  
  // Resolve strategy based on tenant type or feature flag
  const strategy = getCheckoutStrategy(
    userTenant?.tenantType, 
    userTenant?.features?.checkoutStrategy
  );

  // Execute strategy calculation
  const paymentBreakdown = strategy.calculatePayment(subtotal);

  const payload = {
    items,
    tenantId: userTenant?.tenantId || 'TenantB',
    tenantType: userTenant?.tenantType || 'consultoria',
    paymentMethod,
    paymentBreakdown
  };

  // Delegate processing to Mocked API
  const apiResult = await simulatedApi.processPaymentWithStrategy(payload);

  return {
    ...apiResult,
    strategyUsed: strategy.label
  };
}
