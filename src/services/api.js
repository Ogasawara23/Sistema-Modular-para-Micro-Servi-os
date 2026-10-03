/**
 * Camada de Comunicação com a API REST conectada ao Banco SQLite
 */

const BASE_URL = '/api';

export const api = {
  // Health
  async getHealth() {
    const res = await fetch(`${BASE_URL}/health`);
    return res.json();
  },

  // 1. Clientes (ALI 1 - Integrante 1)
  async getClients(tenantId) {
    const url = tenantId ? `${BASE_URL}/clientes?tenant_id=${tenantId}` : `${BASE_URL}/clientes`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Falha ao carregar clientes do banco de dados');
    return res.json();
  },

  async createClient(client) {
    const res = await fetch(`${BASE_URL}/clientes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(client)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Erro ao cadastrar cliente');
    }
    return res.json();
  },

  async updateClient(id, client) {
    const res = await fetch(`${BASE_URL}/clientes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(client)
    });
    if (!res.ok) throw new Error('Erro ao atualizar cliente');
    return res.json();
  },

  async deleteClient(id) {
    const res = await fetch(`${BASE_URL}/clientes/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Erro ao excluir cliente');
    return res.json();
  },

  // 2. Serviços (ALI 2 - Integrante 1)
  async getServices(tenantId) {
    const url = tenantId ? `${BASE_URL}/servicos?tenant_id=${tenantId}` : `${BASE_URL}/servicos`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Falha ao carregar serviços do banco de dados');
    return res.json();
  },

  async createService(service) {
    const res = await fetch(`${BASE_URL}/servicos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(service)
    });
    if (!res.ok) throw new Error('Erro ao cadastrar serviço');
    return res.json();
  },

  async updateService(id, service) {
    const res = await fetch(`${BASE_URL}/servicos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(service)
    });
    if (!res.ok) throw new Error('Erro ao atualizar serviço');
    return res.json();
  },

  async deleteService(id) {
    const res = await fetch(`${BASE_URL}/servicos/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Erro ao excluir serviço');
    return res.json();
  },

  // 3. Agendamentos (ALI 3 - Integrante 2)
  async getAppointments(tenantId) {
    const url = tenantId ? `${BASE_URL}/agendamentos?tenant_id=${tenantId}` : `${BASE_URL}/agendamentos`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Falha ao carregar agendamentos do banco de dados');
    return res.json();
  },

  async createAppointment(appt) {
    const res = await fetch(`${BASE_URL}/agendamentos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appt)
    });
    if (!res.ok) throw new Error('Erro ao cadastrar agendamento');
    return res.json();
  },

  async updateAppointment(id, appt) {
    const res = await fetch(`${BASE_URL}/agendamentos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appt)
    });
    if (!res.ok) throw new Error('Erro ao atualizar agendamento');
    return res.json();
  },

  async deleteAppointment(id) {
    const res = await fetch(`${BASE_URL}/agendamentos/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Erro ao excluir agendamento');
    return res.json();
  },

  // 4. Disponibilidade (ALI 4 - Integrante 2)
  async getAvailability(tenantId) {
    const url = tenantId ? `${BASE_URL}/disponibilidade?tenant_id=${tenantId}` : `${BASE_URL}/disponibilidade`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Falha ao carregar disponibilidade do banco de dados');
    return res.json();
  },

  async createAvailability(avail) {
    const res = await fetch(`${BASE_URL}/disponibilidade`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(avail)
    });
    if (!res.ok) throw new Error('Erro ao cadastrar disponibilidade');
    return res.json();
  },

  async updateAvailability(id, avail) {
    const res = await fetch(`${BASE_URL}/disponibilidade/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(avail)
    });
    if (!res.ok) throw new Error('Erro ao atualizar disponibilidade');
    return res.json();
  },

  async deleteAvailability(id) {
    const res = await fetch(`${BASE_URL}/disponibilidade/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Erro ao excluir disponibilidade');
    return res.json();
  },

  // 5. Variabilidade
  async getVariability() {
    const res = await fetch(`${BASE_URL}/variabilidade`);
    if (!res.ok) throw new Error('Erro ao buscar dados de variabilidade');
    return res.json();
  },

  async getTenants() {
    const res = await fetch(`${BASE_URL}/tenants`);
    if (!res.ok) throw new Error('Erro ao buscar tenants');
    return res.json();
  }
};
