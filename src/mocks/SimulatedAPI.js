/**
 * SimulatedAPI.js
 * Bridges the UI to the SQLite REST API (api.js) with fallback seed data and LocalStorage persistence.
 * Implements Multi-Tenant data isolation, Strategy Pattern calculations, and Feature Flags mapping.
 */
import { api } from '../services/api';
import { tenantConfigManager } from '../patterns/singletons/TenantConfigManager';

const STORAGE_KEYS = {
  CURRENT_TENANT: 'saas_current_tenant_id',
  TENANT_DATA: 'saas_tenants_db',
  APPOINTMENTS: 'saas_appointments_db',
  CLIENTS: 'saas_clients_db',
  ANAMNESIS: 'saas_anamnesis_db',
};

// Initial Seed Data for TenantA (Barbearia Vintage/Modern) & TenantB (Clínica Mente & Corpo)
const INITIAL_TENANTS = {
  TenantA: {
    id: 'TenantA',
    dbTenantId: 'BARBER',
    name: 'Barba & Navalha Club',
    tagline: 'Estilo, precisão e tradição masculina',
    type: 'salao',
    theme: 'TenantA',
    logo: '✂️',
    features: {
      hasProducts: true,
      hasCommission: true,
      hasAiAnamnesis: false, // Flag disabled for TenantA
      hasTelehealth: false, // Flag disabled for TenantA
      checkoutStrategy: 'deposit_20', // 20% Sinal
    },
    user: {
      id: 'user_barber_admin',
      name: 'Mestre Marcos Navalha',
      role: 'Owner & Barber Tech',
      email: 'marcos@barbaenavalha.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    }
  },
  TenantB: {
    id: 'TenantB',
    dbTenantId: 'CLINIC',
    name: 'Clínica Mente & Corpo',
    tagline: 'Saúde integrada, bem-estar e telemedicina',
    type: 'consultoria',
    theme: 'TenantB',
    logo: '🧠',
    features: {
      hasProducts: true,
      hasCommission: true,
      hasAiAnamnesis: true, // Flag enabled for TenantB
      hasTelehealth: true, // Flag enabled for TenantB
      checkoutStrategy: 'full_100', // 100% Prepayment
    },
    user: {
      id: 'user_clinic_admin',
      name: 'Dr. Roberto Silva',
      role: 'Diretor Clínico & Psiquiatra',
      email: 'roberto@mentecorpo.com.br',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
    }
  }
};

const INITIAL_CLIENTS = {
  TenantA: [
    {
      id: 'CLI-001',
      name: 'Gabriel Duarte Silva',
      email: 'gabriel.duarte@email.com',
      phone: '(11) 98765-4321',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      totalVisits: 14,
      lastVisit: '2026-08-20',
      status: 'Ativo',
      vip: true,
      privateNotes: 'Prefere corte militar bem disfarçado. Toma cerveja artesanal IPA na chegada.',
      history: [
        { date: '2026-08-20', service: 'Corte Degradê Premium & Barboterapia', professional: 'Carlos Eduardo', price: 95 },
        { date: '2026-07-28', service: 'Barba Tradicional', professional: 'Marcos Vinícius', price: 55 }
      ]
    },
    {
      id: 'CLI-003',
      name: 'Lucas Mendonça Ferreira',
      email: 'lucas.mendonca@email.com',
      phone: '(21) 99123-4567',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
      totalVisits: 8,
      lastVisit: '2026-08-15',
      status: 'Ativo',
      vip: false,
      privateNotes: 'Sensibilidade na lâmina no pescoço. Usar pós-barba para pele sensível.',
      history: [
        { date: '2026-08-15', service: 'Barba Tradicional com Toalha Quente', professional: 'Carlos Eduardo', price: 55 }
      ]
    },
    {
      id: 'CLI-005',
      name: 'Rafael Nogueira Santos',
      email: 'rafael.nogueira@email.com',
      phone: '(41) 99876-5432',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
      totalVisits: 22,
      lastVisit: '2026-08-25',
      status: 'VIP',
      vip: true,
      privateNotes: 'Cliente antigo. Faz tratamento capilar reconstrutor mensalmente.',
      history: [
        { date: '2026-08-25', service: 'Tratamento Capilar Reconstrutor', professional: 'Marcos Vinícius', price: 130 }
      ]
    }
  ],
  TenantB: [
    {
      id: 'CLI-002',
      name: 'Beatriz Almeida Costa',
      email: 'beatriz.costa@email.com',
      phone: '(11) 97654-3210',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      totalVisits: 6,
      lastVisit: '2026-08-22',
      status: 'Em Acompanhamento',
      vip: false,
      privateNotes: 'Pele sensível com histórico de rosácea leve. Evitar peelings agressivos.',
      history: [
        { date: '2026-08-22', service: 'Limpeza de Pele Facial Profunda', professional: 'Dra. Helena Moreira', price: 180 },
        { date: '2026-08-08', service: 'Consulta Dermatológica Clínica', professional: 'Dra. Helena Moreira', price: 250 }
      ]
    },
    {
      id: 'CLI-004',
      name: 'Mariana Ribeiro Ramos',
      email: 'mariana.ramos@email.com',
      phone: '(31) 98456-7890',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      totalVisits: 12,
      lastVisit: '2026-08-24',
      status: 'Em Acompanhamento',
      vip: true,
      privateNotes: 'Retorno de rotina dermatológico sem intercorrências.',
      history: [
        { date: '2026-08-24', service: 'Consulta Dermatológica Clínica', professional: 'Dra. Helena Moreira', price: 250 }
      ]
    }
  ]
};

const INITIAL_SERVICES = {
  TenantA: [
    { id: 'SRV-001', name: 'Corte Degradê Premium & Barboterapia', duration: '50 min', price: 95, category: 'Cabelo e Barba', description: 'Lavagem especial, corte com máquina/tesoura e alinhamento de contorno.' },
    { id: 'SRV-002', name: 'Barba Tradicional com Toalha Quente', duration: '35 min', price: 55, category: 'Barba', description: 'Modelagem com navalhete, oleoterapia e toalha a vapor relaxante.' },
    { id: 'SRV-005', name: 'Tratamento Capilar Reconstrutor', duration: '40 min', price: 130, category: 'Tratamento', description: 'Reconstrução de fios, hidratação profunda e massagem capilar revigorante.' }
  ],
  TenantB: [
    { id: 'SRV-003', name: 'Limpeza de Pele Facial Profunda', duration: '60 min', price: 180, category: 'Estética Facial', description: 'Extração de impurezas, vapor de ozônio, máscara calmante e fototerapia LED.' },
    { id: 'SRV-004', name: 'Consulta Dermatológica Clínica', duration: '45 min', price: 250, category: 'Consultas Médicas', description: 'Avaliação clínica minuciosa da derme, cabelos e emissão de condutas médicas.' },
    { id: 'SRV-006', name: 'Teleconsulta Dermatológica HD', duration: '45 min', price: 220, category: 'Telemedicina', description: 'Atendimento médico online por vídeo com prescrição digital certificada.' }
  ]
};

const INITIAL_PRODUCTS = {
  TenantA: [
    { id: 'prod_a1', name: 'Pomada Matte Barber Effect', stock: 34, price: 45, code: 'BARB-001', category: 'Modelador' },
    { id: 'prod_a2', name: 'Óleo Hidratante para Barba 30ml', stock: 19, price: 55, code: 'BARB-002', category: 'Cuidados' },
    { id: 'prod_a3', name: 'Shampoo Ice Refresh 250ml', stock: 12, price: 38, code: 'BARB-003', category: 'Higiene' },
  ],
  TenantB: [
    { id: 'prod_b1', name: 'Protetor Solar Facial FPS 50+', stock: 24, price: 98, code: 'CLIN-101', category: 'Dermocosméticos' },
    { id: 'prod_b2', name: 'Sérum Ácido Hialurônico Puro', stock: 18, price: 145, code: 'CLIN-102', category: 'Dermocosméticos' },
    { id: 'prod_b3', name: 'Espuma de Limpeza Suave 150ml', stock: 30, price: 72, code: 'CLIN-103', category: 'Higienização' },
  ]
};

const INITIAL_TEAM = {
  TenantA: [
    { id: 'tm_a1', name: 'Carlos Eduardo', role: 'Master Barber & Visagista', commissionRate: '40%', status: 'Disponível', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
    { id: 'tm_a2', name: 'Marcos Vinícius', role: 'Especialista em Navalha', commissionRate: '35%', status: 'Em Atendimento', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' }
  ],
  TenantB: [
    { id: 'tm_b1', name: 'Dra. Helena Moreira', role: 'Médica Dermatologista CRM-SP', commissionRate: '50%', status: 'Disponível', avatar: 'https://images.unsplash.com/photo-1594824813566-78a8716e6328?w=150&auto=format&fit=crop&q=80' },
    { id: 'tm_b2', name: 'Dr. Roberto Silva', role: 'Diretor Clínico & Psiquiatra', commissionRate: '50%', status: 'Teleconsulta', avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80' }
  ]
};

const delay = (ms = 150) => new Promise(resolve => setTimeout(resolve, ms));

export class SimulatedAPI {
  static getActiveTenantId() {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_TENANT) || 'TenantB';
  }

  static setActiveTenantId(tenantId) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_TENANT, tenantId);
    // Sync with Singleton
    const mapped = (tenantId === 'TenantA' || tenantId === 'BARBER') ? 'BARBER' : 'CLINIC';
    tenantConfigManager.switchTenant(mapped);
  }

  static async getTenantConfig(tenantId = this.getActiveTenantId()) {
    await delay();
    return INITIAL_TENANTS[tenantId] || INITIAL_TENANTS.TenantB;
  }

  static async getCurrentUser() {
    await delay(100);
    const tenantId = this.getActiveTenantId();
    const tenant = INITIAL_TENANTS[tenantId] || INITIAL_TENANTS.TenantB;
    return {
      ...tenant.user,
      tenantId: tenant.id,
      tenantName: tenant.name,
      tenantType: tenant.type,
      features: tenant.features,
    };
  }

  static async switchTenant(tenantId) {
    await delay(200);
    this.setActiveTenantId(tenantId);
    return this.getCurrentUser();
  }

  // --- 1. Dashboard Data (Sincronizado com o SQLite) ---
  static async getDashboardStats() {
    await delay(150);
    const tenantId = this.getActiveTenantId();
    const isTenantA = tenantId === 'TenantA' || tenantId === 'BARBER';
    const dbFilter = isTenantA ? 'BARBER' : 'CLINIC';

    let dbClientsCount = 0;
    let dbServicesCount = 0;
    let dbAppointmentsCount = 0;
    let isDbOnline = false;

    try {
      const health = await api.getHealth();
      if (health && health.status === 'ONLINE') isDbOnline = true;
      const [c, s, a] = await Promise.all([
        api.getClients(dbFilter).catch(() => []),
        api.getServices(dbFilter).catch(() => []),
        api.getAppointments(dbFilter).catch(() => [])
      ]);
      dbClientsCount = c.length;
      dbServicesCount = s.length;
      dbAppointmentsCount = a.length;
    } catch (e) {
      console.warn('Erro ao ler métricas do SQLite:', e.message);
    }

    return {
      tenantId,
      isDbOnline,
      dbClientsCount,
      dbServicesCount,
      dbAppointmentsCount,
      monthlyRevenue: isTenantA ? 'R$ 18.450,00' : 'R$ 42.800,00',
      revenueChange: isTenantA ? '+14.2% em relação ao mês anterior' : '+18.6% em relação ao mês anterior',
      totalAppointments: dbAppointmentsCount > 0 ? dbAppointmentsCount : (isTenantA ? 164 : 89),
      activeClients: dbClientsCount > 0 ? dbClientsCount : (isTenantA ? 128 : 74),
      occupancyRate: isTenantA ? '88%' : '94%',
      upcomingToday: isTenantA ? [
        { time: '14:30', client: 'Gabriel Duarte Silva', service: 'Corte Degradê Premium', professional: 'Carlos Eduardo', status: 'Confirmado', depositPaid: 'R$ 19,00 (20%)' },
        { time: '16:00', client: 'Lucas Mendonça Ferreira', service: 'Barba Tradicional', professional: 'Marcos Vinícius', status: 'Confirmado', depositPaid: 'R$ 11,00 (20%)' }
      ] : [
        { time: '14:30', client: 'Beatriz Almeida Costa', service: 'Limpeza de Pele Facial', professional: 'Dra. Helena Moreira', status: 'Confirmado', depositPaid: 'R$ 180,00 (100%)' },
        { time: '16:00', client: 'Mariana Ribeiro Ramos', service: 'Consulta Dermatológica', professional: 'Dra. Helena Moreira', status: 'Online Pronto', depositPaid: 'R$ 250,00 (100%)' }
      ]
    };
  }

  // --- 2. Calendar / Agenda (Conectado com o SQLite) ---
  static async getAppointments() {
    await delay(150);
    const tenantId = this.getActiveTenantId();
    const dbFilter = (tenantId === 'TenantA' || tenantId === 'BARBER') ? 'BARBER' : 'CLINIC';

    try {
      const data = await api.getAppointments(dbFilter);
      if (data && data.length > 0) {
        return data.map((a, idx) => {
          const parts = (a.dataHora || '').split('T');
          return {
            id: a.id,
            date: parts[0] || '2026-09-18',
            time: parts[1] || '14:30',
            client: a.cliente,
            service: a.servico,
            price: 95.00,
            status: a.status || 'Confirmado',
            observacoes: a.observacoes,
            tenant_id: a.tenant_id
          };
        });
      }
    } catch (e) {
      console.warn('Usando fallback para agendamentos:', e.message);
    }

    return [
      { id: 'AGD-201', date: '2026-09-18', time: '14:30', client: 'Gabriel Duarte Silva', service: 'Corte Degradê Premium', price: 95, status: 'Confirmado' },
      { id: 'AGD-202', date: '2026-09-18', time: '16:00', client: 'Beatriz Almeida Costa', service: 'Limpeza de Pele Facial', price: 180, status: 'Pendente' },
      { id: 'AGD-203', date: '2026-09-19', time: '10:00', client: 'Lucas Mendonça Ferreira', service: 'Barba Tradicional', price: 55, status: 'Confirmado' },
      { id: 'AGD-204', date: '2026-09-20', time: '11:15', client: 'Mariana Ribeiro Ramos', service: 'Consulta Dermatológica', price: 250, status: 'Concluído' }
    ];
  }

  static async createAppointment(apptData) {
    const tenantId = this.getActiveTenantId();
    const dbTenant = (tenantId === 'TenantA' || tenantId === 'BARBER') ? 'BARBER' : 'CLINIC';
    const payload = {
      id: apptData.id || `AGD-${Date.now().toString().slice(-4)}`,
      dataHora: apptData.dataHora || `${apptData.date || '2026-09-20'}T${apptData.time || '14:00'}`,
      status: apptData.status || 'Confirmado',
      cliente: apptData.client || apptData.cliente,
      servico: apptData.service || apptData.servico,
      observacoes: apptData.observacoes || '',
      tenant_id: dbTenant
    };
    try {
      await api.createAppointment(payload);
    } catch (e) {
      console.warn('Erro ao salvar agendamento no SQLite:', e.message);
    }
    return { success: true, appointment: payload };
  }

  static async deleteAppointment(id) {
    try {
      await api.deleteAppointment(id);
    } catch (e) {
      console.warn('Erro ao excluir agendamento no SQLite:', e.message);
    }
    return { success: true };
  }

  // --- 3. Clients (Conectado com o SQLite) ---
  static async getClients() {
    await delay(150);
    const tenantId = this.getActiveTenantId();
    const dbFilter = (tenantId === 'TenantA' || tenantId === 'BARBER') ? 'BARBER' : 'CLINIC';

    try {
      const dbClients = await api.getClients(dbFilter);
      if (dbClients && dbClients.length > 0) {
        return dbClients.map((c, idx) => ({
          id: c.id,
          name: c.nome,
          email: c.email,
          phone: c.telefone || '(11) 98765-4321',
          senha: c.senha,
          dataCadastro: c.dataCadastro,
          tenant_id: c.tenant_id,
          avatar: `https://images.unsplash.com/photo-${1500000000000 + ((idx + 1) * 2345678) % 50000000}?w=150&auto=format&fit=crop&q=80`,
          totalVisits: 6 + idx * 4,
          lastVisit: c.dataCadastro || '2026-08-20',
          status: 'Ativo',
          vip: idx % 2 === 0,
          privateNotes: `Cliente verificado no banco SQLite. Cadastro em ${c.dataCadastro}.`,
          history: [
            { date: c.dataCadastro || '2026-08-20', service: 'Atendimento Concluído', professional: 'Equipe Especialista', price: 95 }
          ]
        }));
      }
    } catch (e) {
      console.warn('Usando fallback para clientes:', e.message);
    }

    return INITIAL_CLIENTS[tenantId] || [];
  }

  static async getClientById(id) {
    await delay(100);
    const clients = await this.getClients();
    return clients.find(c => c.id === id) || clients[0];
  }

  static async createClient(clientData) {
    const tenantId = this.getActiveTenantId();
    const dbTenant = (tenantId === 'TenantA' || tenantId === 'BARBER') ? 'BARBER' : 'CLINIC';
    const payload = {
      id: clientData.id || `CLI-${Date.now().toString().slice(-4)}`,
      nome: clientData.name || clientData.nome,
      email: clientData.email,
      telefone: clientData.phone || clientData.telefone || '',
      senha: clientData.senha || 'hash_seguro_sqlite',
      dataCadastro: clientData.dataCadastro || new Date().toISOString().split('T')[0],
      tenant_id: dbTenant
    };

    try {
      await api.createClient(payload);
    } catch (e) {
      console.warn('Erro ao salvar cliente no SQLite:', e.message);
    }
    return { success: true, client: payload };
  }

  static async deleteClient(id) {
    try {
      await api.deleteClient(id);
    } catch (e) {
      console.warn('Erro ao excluir cliente no SQLite:', e.message);
    }
    return { success: true };
  }

  static async saveClientNotes(clientId, notes) {
    await delay(200);
    return { success: true, notes };
  }

  // --- 4. Services (Conectado com o SQLite) ---
  static async getServices() {
    await delay(150);
    const tenantId = this.getActiveTenantId();
    const dbFilter = (tenantId === 'TenantA' || tenantId === 'BARBER') ? 'BARBER' : 'CLINIC';

    try {
      const dbServices = await api.getServices(dbFilter);
      if (dbServices && dbServices.length > 0) {
        return dbServices.map(s => ({
          id: s.id,
          name: s.nomeServico,
          price: Number(s.preco),
          duration: `${s.duracaoMinutos} min`,
          duracaoMinutos: s.duracaoMinutos,
          category: s.categoria || 'Geral',
          description: `Serviço ${s.nomeServico} sincronizado com o banco de dados SQLite.`,
          tenant_id: s.tenant_id
        }));
      }
    } catch (e) {
      console.warn('Usando fallback para serviços:', e.message);
    }

    return INITIAL_SERVICES[tenantId] || [];
  }

  static async createService(serviceData) {
    const tenantId = this.getActiveTenantId();
    const dbTenant = (tenantId === 'TenantA' || tenantId === 'BARBER') ? 'BARBER' : 'CLINIC';
    const payload = {
      id: serviceData.id || `SRV-${Date.now().toString().slice(-4)}`,
      nomeServico: serviceData.name || serviceData.nomeServico,
      preco: parseFloat(serviceData.price || serviceData.preco),
      duracaoMinutos: parseInt(serviceData.duracaoMinutos || parseInt(serviceData.duration) || 45, 10),
      categoria: serviceData.category || serviceData.categoria || 'Geral',
      tenant_id: dbTenant
    };

    try {
      await api.createService(payload);
    } catch (e) {
      console.warn('Erro ao criar serviço no SQLite:', e.message);
    }
    return { success: true, service: payload };
  }

  static async deleteService(id) {
    try {
      await api.deleteService(id);
    } catch (e) {
      console.warn('Erro ao excluir serviço no SQLite:', e.message);
    }
    return { success: true };
  }

  // --- 5. Team & Availability (Conectado com SQLite) ---
  static async getTeam() {
    await delay(150);
    const tenantId = this.getActiveTenantId();
    return INITIAL_TEAM[tenantId] || [];
  }

  static async getAvailability() {
    const tenantId = this.getActiveTenantId();
    const dbFilter = (tenantId === 'TenantA' || tenantId === 'BARBER') ? 'BARBER' : 'CLINIC';
    try {
      const data = await api.getAvailability(dbFilter);
      if (data && data.length > 0) return data;
    } catch (e) {
      console.warn('Erro ao obter disponibilidade:', e.message);
    }
    return [];
  }

  // --- 6. Products ---
  static async getProducts() {
    await delay(150);
    const tenantId = this.getActiveTenantId();
    return INITIAL_PRODUCTS[tenantId] || [];
  }

  // --- 7. Reports & Commissions ---
  static async getReports() {
    await delay(200);
    const tenantId = this.getActiveTenantId();
    const isTenantA = tenantId === 'TenantA' || tenantId === 'BARBER';
    return {
      monthlyTotal: isTenantA ? 18450 : 42800,
      totalCommissionsPaid: isTenantA ? 6450 : 18200,
      netRevenue: isTenantA ? 12000 : 24600,
      commissionsBreakdown: isTenantA ? [
        { name: 'Carlos Eduardo', role: 'Master Barber', rate: '40%', amount: 'R$ 3.800,00' },
        { name: 'Marcos Vinícius', role: 'Visagista', rate: '35%', amount: 'R$ 2.650,00' },
      ] : [
        { name: 'Dra. Helena Moreira', role: 'Dermatologista', rate: '50%', amount: 'R$ 11.400,00' },
        { name: 'Dr. Roberto Silva', role: 'Psiquiatra', rate: '50%', amount: 'R$ 6.800,00' },
      ]
    };
  }

  // --- 8. Telehealth ---
  static async getTelehealthSessions() {
    await delay(150);
    return [
      { id: 'tele_1', patientName: 'Beatriz Almeida Costa', time: '14:30 Hoje', roomUrl: 'https://telehealth.saas.app/room/meet-b1-992', status: 'Pronta para iniciar', doctor: 'Dra. Helena Moreira' },
      { id: 'tele_2', patientName: 'Mariana Ribeiro Ramos', time: '16:00 Hoje', roomUrl: 'https://telehealth.saas.app/room/meet-b1-408', status: 'Agendada', doctor: 'Dra. Helena Moreira' },
    ];
  }

  // --- 9. AI Anamnesis ---
  static async generateAiAnamnesis(clientName, symptomsOrGoal) {
    await delay(500);
    return {
      timestamp: new Date().toISOString(),
      clientName,
      riskLevel: 'Baixo/Moderado',
      summary: `Análise preditiva por IA para ${clientName}. O histórico no banco indica boa receptividade a intervenções clínicas estruturadas.`,
      recommendedActions: [
        'Agendar sessão de retorno em 15 dias',
        'Avaliar rotina de cuidados faciais e sensibilidade dérmica',
        'Registrar anotações confidenciais no prontuário seguro'
      ],
      aiQuestionsGenerated: [
        'Qual a regularidade de exposição solar e uso de dermocosméticos?',
        'Em uma escala de 1 a 10, qual o nível de desconforto recente?',
        'Existe histórico prévio de sensibilidade a formulações tópicas?'
      ]
    };
  }

  // --- 10. Checkout Strategy Process ---
  static async processPaymentWithStrategy(paymentPayload) {
    await delay(300);
    return {
      success: true,
      transactionId: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp: new Date().toISOString(),
      ...paymentPayload
    };
  }

  // --- 11. Settings ---
  static async updateTenantSettings(newFeatures) {
    await delay(200);
    const tenantId = this.getActiveTenantId();
    if (INITIAL_TENANTS[tenantId]) {
      INITIAL_TENANTS[tenantId].features = {
        ...INITIAL_TENANTS[tenantId].features,
        ...newFeatures
      };
      return INITIAL_TENANTS[tenantId];
    }
    return null;
  }
}
