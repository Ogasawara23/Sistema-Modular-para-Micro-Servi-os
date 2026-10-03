/**
 * Template Method 3: BaseNotificationPipeline
 * Responsabilidade: Definir a sequência padronizada do pipeline de notificação.
 */
export class BaseNotificationPipeline {
  // Método Template principal
  send(user, bookingDetails) {
    this.validateRecipient(user);
    const message = this.formatMessage(user, bookingDetails);
    const status = this.dispatch(user, message);

    return {
      channel: this.getChannelName(),
      status,
      message
    };
  }

  validateRecipient(user) {
    if (!user || !user.name) {
      throw new Error('Destinatário inválido para notificação.');
    }
  }

  // Passos customizáveis
  formatMessage(_user, _details) {
    throw new Error('O método formatMessage() deve ser implementado.');
  }

  dispatch(_user, _message) {
    throw new Error('O método dispatch() deve ser implementado.');
  }

  getChannelName() {
    return 'Geral';
  }
}

// Subclasse 1: Canal de E-mail
export class EmailNotificationPipeline extends BaseNotificationPipeline {
  formatMessage(user, details) {
    return `Olá ${user.name}, seu agendamento de ${details.serviceName} está confirmado para ${details.date} às ${details.time}.`;
  }

  dispatch(user, _message) {
    return `E-mail enviado para ${user.email}`;
  }

  getChannelName() {
    return 'E-mail';
  }
}

// Subclasse 2: Canal de WhatsApp
export class WhatsAppNotificationPipeline extends BaseNotificationPipeline {
  formatMessage(user, details) {
    return `📲 *Confirmação*: Olá ${user.name}! Seu agendamento de ${details.serviceName} foi reservado para ${details.date} às ${details.time}. Código: ${details.confirmationCode}`;
  }

  dispatch(user, _message) {
    return `Mensagem WhatsApp enviada para ${user.phone}`;
  }

  getChannelName() {
    return 'WhatsApp';
  }
}
