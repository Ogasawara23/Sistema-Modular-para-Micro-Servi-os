/**
 * Singleton 1: TenantConfigManager
 * Responsabilidade: Garantir uma única instância global de configurações da empresa (Barbearia vs Clínica).
 */
class TenantConfigManager {
  constructor() {
    if (TenantConfigManager.instance) {
      return TenantConfigManager.instance;
    }

    // Configuração inicial do tenant ativo
    this.activeTenant = {
      id: 'barbearia_style',
      name: 'Barbearia Vintage & Style',
      type: 'BARBER',
      primaryColor: '#2563eb',
      accentColor: '#3b82f6',
      services: [
        { id: 's1', name: 'Corte de Cabelo & Barba', price: 70, duration: '45 min' },
        { id: 's2', name: 'Barba Modelada', price: 40, duration: '30 min' },
        { id: 's3', name: 'Acabamento & Pezinho', price: 25, duration: '15 min' }
      ],
      professionals: ['Carlos Silva', 'Lucas Santos', 'Mateus Lima']
    };

    TenantConfigManager.instance = this;
  }

  // Ponto de acesso global da instância Singleton
  static getInstance() {
    if (!TenantConfigManager.instance) {
      TenantConfigManager.instance = new TenantConfigManager();
    }
    return TenantConfigManager.instance;
  }

  // Retorna os dados do tenant ativo
  getTenant() {
    return this.activeTenant;
  }

  // Alterna o perfil do tenant entre Barbearia e Clínica
  switchTenant(type) {
    if (type === 'CLINIC') {
      this.activeTenant = {
        id: 'clinica_saude',
        name: 'Clínica Saúde & Estética',
        type: 'CLINIC',
        primaryColor: '#0d9488',
        accentColor: '#14b8a6',
        services: [
          { id: 's10', name: 'Consulta Dermatológica', price: 220, duration: '50 min' },
          { id: 's11', name: 'Limpeza de Pele Profunda', price: 160, duration: '60 min' },
          { id: 's12', name: 'Avaliação Estética Facial', price: 100, duration: '30 min' }
        ],
        professionals: ['Dra. Elena Vance', 'Dr. Marcos Paulo', 'Dra. Beatriz Luz']
      };
    } else {
      this.activeTenant = {
        id: 'barbearia_style',
        name: 'Barbearia Vintage & Style',
        type: 'BARBER',
        primaryColor: '#2563eb',
        accentColor: '#3b82f6',
        services: [
          { id: 's1', name: 'Corte de Cabelo & Barba', price: 70, duration: '45 min' },
          { id: 's2', name: 'Barba Modelada', price: 40, duration: '30 min' },
          { id: 's3', name: 'Acabamento & Pezinho', price: 25, duration: '15 min' }
        ],
        professionals: ['Carlos Silva', 'Lucas Santos', 'Mateus Lima']
      };
    }
    return this.activeTenant;
  }
}

export const tenantConfigManager = TenantConfigManager.getInstance();
export default TenantConfigManager;
