/**
 * Strategy 3: PaymentStrategy
 * Responsabilidade: Encapsular os diferentes comportamentos e métodos de cobrança.
 */

// Pagamento PIX
export class PixPaymentStrategy {
  process(_amount) {
    return {
      method: 'Pix',
      status: 'Aprovado Instantaneamente',
      details: 'Chave Pix Copia e Cola gerada'
    };
  }
}

// Pagamento Cartão de Crédito
export class CreditCardPaymentStrategy {
  process(_amount) {
    return {
      method: 'Cartão de Crédito',
      status: 'Aprovado pela Operadora',
      details: 'Transação autorizada em 1x'
    };
  }
}

// Sinal Antecipado (30%)
export class DepositAdvancePaymentStrategy {
  process(amount) {
    const deposit = amount * 0.3;
    const remaining = amount * 0.7;
    return {
      method: 'Sinal Antecipado (30%)',
      status: 'Sinal Pago',
      details: `R$ ${deposit.toFixed(2)} pago online. Restam R$ ${remaining.toFixed(2)} no local.`
    };
  }
}

// Contexto
export class PaymentContext {
  constructor(strategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }

  execute(amount) {
    return this.strategy.process(amount);
  }
}
