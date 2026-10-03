/**
 * Template Method 2: BaseReceiptGenerator
 * Responsabilidade: Padronizar o algoritmo de geração e formatação do comprovante/recibo.
 */
export class BaseReceiptGenerator {
  // O Método Template que monta o comprovante estruturado
  generate(data) {
    const header = this.buildHeader(data);
    const body = this.buildBody(data);
    const footer = this.buildFooter(data);

    return {
      header,
      body,
      footer,
      fullText: `${header}\n\n${body}\n\n${footer}`
    };
  }

  // Passo comum do cabeçalho
  buildHeader(data) {
    return `========================================\n        ${data.tenantName.toUpperCase()}\n========================================`;
  }

  // Passo customizável (obrigatório para subclasses)
  buildBody(_data) {
    throw new Error('O método buildBody() deve ser implementado.');
  }

  // Passo customizável com implementação padrão
  buildFooter(data) {
    return `Obrigado por agendar conosco!\nCódigo: ${data.confirmationCode}`;
  }
}

// Subclasse 1: Recibo Simples de Barbearia
export class SimpleReceiptGenerator extends BaseReceiptGenerator {
  buildBody(data) {
    return `Cliente: ${data.clientName}\nServiço: ${data.serviceName}\nProfissional: ${data.professional}\nData: ${data.date} às ${data.time}\nTotal Pago: R$ ${data.totalPrice.toFixed(2)}`;
  }
}

// Subclasse 2: Recibo Detalhado da Clínica
export class DetailedClinicalReceiptGenerator extends BaseReceiptGenerator {
  buildBody(data) {
    return `Paciente: ${data.clientName}\nProcedimento: ${data.serviceName}\nEspecialista: ${data.professional}\nData: ${data.date} às ${data.time}\nValor Procedimento: R$ ${data.totalPrice.toFixed(2)}\nInstruções: Comparecer com 10 min de antecedência.`;
  }

  buildFooter(data) {
    return `----------------------------------------\nDocumento emitido para fins de agendamento de saúde/estética.\nCódigo de Validação: ${data.confirmationCode}\n========================================`;
  }
}
