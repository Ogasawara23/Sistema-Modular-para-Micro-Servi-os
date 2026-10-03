/**
 * Template Method 1: BaseBookingProcessor
 * Responsabilidade: Definir a estrutura do algoritmo de processamento do agendamento.
 */
export class BaseBookingProcessor {
  // O Método Template principal que coordena o algoritmo
  processBooking(data) {
    this.validateAvailability(data);
    const price = this.calculatePrice(data);
    const finalPrice = this.applySpecialRules(data, price);
    const confirmation = this.confirmBooking(data, finalPrice);

    return {
      success: true,
      originalPrice: price,
      finalPrice: finalPrice,
      confirmationCode: confirmation
    };
  }

  // Passo concreto comum
  validateAvailability(data) {
    if (!data.date || !data.time) {
      throw new Error('Data e horário são obrigatórios.');
    }
  }

  // Passo customizável (Subclasses devem implementar)
  calculatePrice(_data) {
    throw new Error('O método calculatePrice() deve ser implementado.');
  }

  // Passo customizável (Subclasses podem sobrescrever)
  applySpecialRules(data, price) {
    return price;
  }

  // Passo concreto comum
  confirmBooking(_data, _finalPrice) {
    return `AGD-${Math.floor(100000 + Math.random() * 900000)}`;
  }
}

// Subclasse 1: Agendamento em Barbearia
export class BarberBookingProcessor extends BaseBookingProcessor {
  calculatePrice(data) {
    return data.service.price;
  }

  applySpecialRules(data, price) {
    // 10% de desconto em dias de promoção da barbearia
    return data.isPromoDay ? price * 0.9 : price;
  }
}

// Subclasse 2: Agendamento em Clínica
export class ClinicBookingProcessor extends BaseBookingProcessor {
  calculatePrice(data) {
    // Inclui taxa adicional de higienização/insumos clínicos
    const basePrice = data.service.price;
    const clinicalTax = 20.0;
    return basePrice + clinicalTax;
  }

  applySpecialRules(data, price) {
    // Regra de retorno/convênio se aplicável
    return data.hasInsurance ? price * 0.7 : price;
  }
}
