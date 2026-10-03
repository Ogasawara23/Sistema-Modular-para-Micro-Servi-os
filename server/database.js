import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Garante que o arquivo do banco fique na pasta server/database.sqlite
const dbPath = path.resolve(__dirname, 'database.sqlite');
export const db = new DatabaseSync(dbPath);

// Ativa chaves estrangeiras
db.exec('PRAGMA foreign_keys = ON;');

/**
 * Inicialização e Criação das Tabelas Relacionais do Banco de Dados
 * Tabelas criadas:
 * 1. tenants (Configuração e Variabilidade Multi-Tenant)
 * 2. clientes (Entidade CRUD 1 - Integrante 1)
 * 3. servicos (Entidade CRUD 2 - Integrante 1)
 * 4. agendamentos (Entidade CRUD 3 - Integrante 2, com FKs)
 * 5. disponibilidade (Entidade CRUD 4 - Integrante 2)
 */
export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS tenants (
      id TEXT PRIMARY KEY,
      nome TEXT NOT NULL,
      segmento TEXT NOT NULL,
      cor_primaria TEXT NOT NULL,
      features_json TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS clientes (
      id TEXT PRIMARY KEY,
      nome TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      telefone TEXT NOT NULL,
      senha TEXT NOT NULL,
      data_cadastro TEXT NOT NULL,
      tenant_id TEXT NOT NULL,
      FOREIGN KEY (tenant_id) REFERENCES tenants(id)
    );

    CREATE TABLE IF NOT EXISTS servicos (
      id TEXT PRIMARY KEY,
      nome_servico TEXT NOT NULL,
      preco REAL NOT NULL,
      duracao_minutos INTEGER NOT NULL,
      categoria TEXT NOT NULL,
      tenant_id TEXT NOT NULL,
      FOREIGN KEY (tenant_id) REFERENCES tenants(id)
    );

    CREATE TABLE IF NOT EXISTS agendamentos (
      id TEXT PRIMARY KEY,
      data_hora TEXT NOT NULL,
      status TEXT NOT NULL,
      cliente_id TEXT NOT NULL,
      servico_id TEXT NOT NULL,
      observacoes TEXT,
      tenant_id TEXT NOT NULL,
      FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
      FOREIGN KEY (servico_id) REFERENCES servicos(id) ON DELETE CASCADE,
      FOREIGN KEY (tenant_id) REFERENCES tenants(id)
    );

    CREATE TABLE IF NOT EXISTS disponibilidade (
      id TEXT PRIMARY KEY,
      profissional TEXT NOT NULL,
      dia_semana TEXT NOT NULL,
      hora_inicio TEXT NOT NULL,
      hora_fim TEXT NOT NULL,
      tenant_id TEXT NOT NULL,
      FOREIGN KEY (tenant_id) REFERENCES tenants(id)
    );
  `);

  seedInitialData();
  console.log('✅ Banco de dados SQLite inicializado com sucesso em:', dbPath);
}

/**
 * Carga inicial de dados mockados (Seed)
 */
function seedInitialData() {
  const tenantsCount = db.prepare('SELECT COUNT(*) as count FROM tenants').get().count;

  if (tenantsCount === 0) {
    console.log('🌱 Populando banco de dados com dados iniciais (Seed)...');

    // 1. Tenants (Variabilidade de Domínio)
    const insertTenant = db.prepare(`
      INSERT INTO tenants (id, nome, segmento, cor_primaria, features_json)
      VALUES (?, ?, ?, ?, ?)
    `);

    insertTenant.run(
      'BARBER',
      'Barbearia Vintage & Style',
      'Barbearia',
      '#2563eb',
      JSON.stringify({
        hasInsurance: false,
        receiptTemplate: 'SimpleReceipt',
        bookingProcessor: 'BarberBookingProcessor',
        defaultDiscount: 'FirstVisit',
        theme: 'dark-blue'
      })
    );

    insertTenant.run(
      'CLINIC',
      'Clínica Saúde & Estética',
      'Clínica',
      '#0d9488',
      JSON.stringify({
        hasInsurance: true,
        receiptTemplate: 'DetailedClinicalReceipt',
        bookingProcessor: 'ClinicBookingProcessor',
        defaultDiscount: 'VipSubscription',
        theme: 'teal-emerald'
      })
    );

    // 2. Clientes (ALI 1 - Integrante 1)
    const insertCliente = db.prepare(`
      INSERT INTO clientes (id, nome, email, telefone, senha, data_cadastro, tenant_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const clientes = [
      ['CLI-001', 'Gabriel Duarte Silva', 'gabriel.duarte@email.com', '(11) 98765-4321', 'hash_pbkdf2_918237198', '2026-01-15', 'BARBER'],
      ['CLI-002', 'Beatriz Almeida Costa', 'beatriz.costa@email.com', '(11) 97654-3210', 'hash_pbkdf2_827163821', '2026-02-20', 'CLINIC'],
      ['CLI-003', 'Lucas Mendonça Ferreira', 'lucas.mendonca@email.com', '(21) 99123-4567', 'hash_pbkdf2_716253412', '2026-03-10', 'BARBER'],
      ['CLI-004', 'Mariana Ribeiro Ramos', 'mariana.ramos@email.com', '(31) 98456-7890', 'hash_pbkdf2_615243819', '2026-04-05', 'CLINIC'],
      ['CLI-005', 'Rafael Nogueira Santos', 'rafael.nogueira@email.com', '(41) 99876-5432', 'hash_pbkdf2_514238716', '2026-05-18', 'BARBER']
    ];

    for (const c of clientes) {
      insertCliente.run(...c);
    }

    // 3. Serviços (ALI 2 - Integrante 1)
    const insertServico = db.prepare(`
      INSERT INTO servicos (id, nome_servico, preco, duracao_minutos, categoria, tenant_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const servicos = [
      ['SRV-001', 'Corte Degradê Premium & Barboterapia', 95.00, 50, 'Cabelo e Barba', 'BARBER'],
      ['SRV-002', 'Barba Tradicional com Toalha Quente', 55.00, 35, 'Barba', 'BARBER'],
      ['SRV-003', 'Limpeza de Pele Facial Profunda', 180.00, 60, 'Estética Facial', 'CLINIC'],
      ['SRV-004', 'Consulta Dermatológica Clínica', 250.00, 45, 'Consultas Médicas', 'CLINIC'],
      ['SRV-005', 'Tratamento Capilar Reconstrutor', 130.00, 40, 'Tratamento', 'BARBER']
    ];

    for (const s of servicos) {
      insertServico.run(...s);
    }

    // 4. Agendamentos (ALI 3 - Integrante 2)
    const insertAgendamento = db.prepare(`
      INSERT INTO agendamentos (id, data_hora, status, cliente_id, servico_id, observacoes, tenant_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const agendamentos = [
      ['AGD-201', '2026-09-18T14:30', 'Confirmado', 'CLI-001', 'SRV-001', 'Cliente prefere tesoura no topo e navalha nas laterais.', 'BARBER'],
      ['AGD-202', '2026-09-18T16:00', 'Pendente', 'CLI-002', 'SRV-003', 'Pele sensível com histórico de rosácea leve.', 'CLINIC'],
      ['AGD-203', '2026-09-19T10:00', 'Confirmado', 'CLI-003', 'SRV-002', 'Primeira visita indicada por amigos.', 'BARBER'],
      ['AGD-204', '2026-09-20T11:15', 'Concluído', 'CLI-004', 'SRV-004', 'Retorno de rotina dermatológico sem intercorrências.', 'CLINIC'],
      ['AGD-205', '2026-09-21T15:45', 'Cancelado', 'CLI-005', 'SRV-005', 'Solicitou cancelamento prévio por conflito de agenda.', 'BARBER']
    ];

    for (const a of agendamentos) {
      insertAgendamento.run(...a);
    }

    // 5. Disponibilidade (ALI 4 - Integrante 2)
    const insertDisponibilidade = db.prepare(`
      INSERT INTO disponibilidade (id, profissional, dia_semana, hora_inicio, hora_fim, tenant_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const disponibilidades = [
      ['DSP-101', 'Carlos Eduardo (Master Barber)', 'Segunda-feira', '09:00', '18:00', 'BARBER'],
      ['DSP-102', 'Carlos Eduardo (Master Barber)', 'Terça-feira', '09:00', '19:00', 'BARBER'],
      ['DSP-103', 'Dra. Helena Moreira (Dermatologista)', 'Quarta-feira', '08:30', '17:30', 'CLINIC'],
      ['DSP-104', 'Dra. Helena Moreira (Dermatologista)', 'Quinta-feira', '08:30', '16:00', 'CLINIC'],
      ['DSP-105', 'Marcos Vinícius (Visagista)', 'Sexta-feira', '10:00', '20:00', 'BARBER'],
      ['DSP-106', 'Marcos Vinícius (Visagista)', 'Sábado', '08:00', '14:00', 'BARBER']
    ];

    for (const d of disponibilidades) {
      insertDisponibilidade.run(...d);
    }

    console.log('✅ Carga inicial (Seed) concluída.');
  }
}
