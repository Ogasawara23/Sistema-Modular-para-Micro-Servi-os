/**
 * Strategy 1: ProfessionalSelectionStrategy
 * Responsabilidade: Encapsular os diferentes métodos/algoritmos de seleção do profissional.
 */

// Estratégia 1: Escolha Manual Direta
export class ManualProfessionalStrategy {
  constructor(selectedName) {
    this.selectedName = selectedName;
  }

  select(list) {
    return {
      name: this.selectedName || list[0],
      method: 'Manual'
    };
  }
}

// Estratégia 2: Fila Equilibrada (Round Robin)
export class RoundRobinStrategy {
  select(list) {
    const randomIndex = Math.floor(Math.random() * list.length);
    return {
      name: list[randomIndex],
      method: 'Fila Equilibrada (Round Robin)'
    };
  }
}

// Estratégia 3: Primeiro Disponível no Horário
export class FastestAvailableStrategy {
  select(list) {
    return {
      name: list[0],
      method: 'Próximo Livre no Horário'
    };
  }
}

// Contexto da Estratégia
export class ProfessionalSelectionContext {
  constructor(strategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }

  execute(professionalsList) {
    return this.strategy.select(professionalsList);
  }
}
