/**
 * Strategy 2: DiscountStrategy
 * Responsabilidade: Encapsular os algoritmos permutáveis de cálculo de desconto.
 */

// Sem Desconto
export class NoDiscountStrategy {
  calculate(price) {
    return {
      discount: 0,
      finalPrice: price,
      label: 'Nenhum desconto'
    };
  }
}

// Cupom Primeira Visita (15% OFF)
export class FirstVisitDiscountStrategy {
  calculate(price) {
    const discount = price * 0.15;
    return {
      discount,
      finalPrice: price - discount,
      label: 'Cupom Primeira Visita (-15%)'
    };
  }
}

// Assinatura VIP (30% OFF)
export class VipSubscriptionDiscountStrategy {
  calculate(price) {
    const discount = price * 0.30;
    return {
      discount,
      finalPrice: price - discount,
      label: 'Assinatura VIP (-30%)'
    };
  }
}

// Contexto
export class DiscountContext {
  constructor(strategy = new NoDiscountStrategy()) {
    this.strategy = strategy;
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }

  apply(price) {
    return this.strategy.calculate(price);
  }
}
