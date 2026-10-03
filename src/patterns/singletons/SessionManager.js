/**
 * Singleton 2: SessionManager
 * Responsabilidade: Gerenciar a instância única do usuário atualmente autenticado na sessão.
 */
class SessionManager {
  constructor() {
    if (SessionManager.instance) {
      return SessionManager.instance;
    }

    // Dados da sessão ativa do usuário
    this.user = {
      id: 'usr_882',
      name: 'Gabriel Mendonça',
      email: 'gabriel@email.com',
      phone: '41998877665',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    };

    SessionManager.instance = this;
  }

  // Ponto de acesso global da instância Singleton
  static getInstance() {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  // Retorna os dados do usuário autenticado
  getUser() {
    return this.user;
  }
}

export const sessionManager = SessionManager.getInstance();
export default SessionManager;
