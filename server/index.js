import express from 'express';
import cors from 'cors';
import { db, initDatabase } from './database.js';

// Inicializa o banco de dados SQLite e cria as tabelas
initDatabase();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// -----------------------------------------------------------------------------
// Healthcheck
// -----------------------------------------------------------------------------
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    database: 'SQLite (database.sqlite)',
    driver: 'node:sqlite (Node.js 24 Native)',
    timestamp: new Date().toISOString()
  });
});

function getTenantFilter(tenant_id, prefix = '') {
  if (!tenant_id) return { clause: '', params: [] };
  const col = prefix ? `${prefix}.tenant_id` : 'tenant_id';
  if (tenant_id === 'TenantA' || tenant_id === 'BARBER') {
    return { clause: ` WHERE ${col} IN ('BARBER', 'TenantA')`, params: [] };
  }
  if (tenant_id === 'TenantB' || tenant_id === 'CLINIC') {
    return { clause: ` WHERE ${col} IN ('CLINIC', 'TenantB')`, params: [] };
  }
  return { clause: ` WHERE ${col} = ?`, params: [tenant_id] };
}

function normalizeTenant(tenant_id) {
  if (tenant_id === 'TenantA') return 'BARBER';
  if (tenant_id === 'TenantB') return 'CLINIC';
  return tenant_id || 'BARBER';
}

// -----------------------------------------------------------------------------
// 1. CRUD de Clientes (Integrante 1 - ALI 1)
// Campos: ID, Nome, Email, Telefone, Senha, Data_Cadastro
// -----------------------------------------------------------------------------
app.get('/api/clientes', (req, res) => {
  try {
    const { tenant_id } = req.query;
    let query = 'SELECT id, nome, email, telefone, senha, data_cadastro as dataCadastro, tenant_id FROM clientes';
    const filter = getTenantFilter(tenant_id);
    query += filter.clause;
    query += ' ORDER BY data_cadastro DESC';
    const rows = db.prepare(query).all(...filter.params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/clientes', (req, res) => {
  try {
    const { id, nome, email, telefone, senha, dataCadastro, tenant_id = 'BARBER' } = req.body;
    if (!id || !nome || !email || !senha) {
      return res.status(400).json({ error: 'Campos obrigatórios ausentes.' });
    }

    const stmt = db.prepare(`
      INSERT INTO clientes (id, nome, email, telefone, senha, data_cadastro, tenant_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(id, nome, email, telefone || '', senha, dataCadastro || new Date().toISOString().split('T')[0], normalizeTenant(tenant_id));
    res.status(201).json({ success: true, message: 'Cliente cadastrado com sucesso no banco de dados!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/clientes/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, telefone, senha, dataCadastro, tenant_id } = req.body;

    const current = db.prepare('SELECT * FROM clientes WHERE id = ?').get(id);
    if (!current) {
      return res.status(404).json({ error: 'Cliente não encontrado no banco de dados.' });
    }

    const stmt = db.prepare(`
      UPDATE clientes
      SET nome = ?, email = ?, telefone = ?, senha = ?, data_cadastro = ?, tenant_id = COALESCE(?, tenant_id)
      WHERE id = ?
    `);
    stmt.run(
      nome ?? current.nome,
      email ?? current.email,
      telefone ?? current.telefone,
      senha ?? current.senha,
      dataCadastro ?? current.data_cadastro,
      tenant_id ?? null,
      id
    );

    res.json({ success: true, message: 'Cliente atualizado com sucesso no banco de dados!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/clientes/:id', (req, res) => {
  try {
    const { id } = req.params;
    const stmt = db.prepare('DELETE FROM clientes WHERE id = ?');
    const result = stmt.run(id);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Cliente não encontrado.' });
    }
    res.json({ success: true, message: 'Cliente excluído com sucesso do banco de dados!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -----------------------------------------------------------------------------
// 2. CRUD de Serviços (Integrante 1 - ALI 2)
// Campos: ID, Nome do Serviço, Preço, Duração em Minutos, Categoria
// -----------------------------------------------------------------------------
app.get('/api/servicos', (req, res) => {
  try {
    const { tenant_id } = req.query;
    let query = 'SELECT id, nome_servico as nomeServico, preco, duracao_minutos as duracaoMinutos, categoria, tenant_id FROM servicos';
    const filter = getTenantFilter(tenant_id);
    query += filter.clause;
    query += ' ORDER BY nome_servico ASC';
    const rows = db.prepare(query).all(...filter.params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/servicos', (req, res) => {
  try {
    const { id, nomeServico, preco, duracaoMinutos, categoria, tenant_id = 'BARBER' } = req.body;
    if (!id || !nomeServico || preco === undefined || !duracaoMinutos) {
      return res.status(400).json({ error: 'Campos obrigatórios ausentes.' });
    }

    const stmt = db.prepare(`
      INSERT INTO servicos (id, nome_servico, preco, duracao_minutos, categoria, tenant_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    stmt.run(id, nomeServico, parseFloat(preco), parseInt(duracaoMinutos, 10), categoria || 'Geral', normalizeTenant(tenant_id));
    res.status(201).json({ success: true, message: 'Serviço cadastrado com sucesso no banco de dados!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/servicos/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { nomeServico, preco, duracaoMinutos, categoria, tenant_id } = req.body;

    const current = db.prepare('SELECT * FROM servicos WHERE id = ?').get(id);
    if (!current) {
      return res.status(404).json({ error: 'Serviço não encontrado.' });
    }

    const stmt = db.prepare(`
      UPDATE servicos
      SET nome_servico = ?, preco = ?, duracao_minutos = ?, categoria = ?, tenant_id = COALESCE(?, tenant_id)
      WHERE id = ?
    `);
    stmt.run(
      nomeServico ?? current.nome_servico,
      preco !== undefined ? parseFloat(preco) : current.preco,
      duracaoMinutos !== undefined ? parseInt(duracaoMinutos, 10) : current.duracao_minutos,
      categoria ?? current.categoria,
      tenant_id ?? null,
      id
    );

    res.json({ success: true, message: 'Serviço atualizado com sucesso no banco de dados!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/servicos/:id', (req, res) => {
  try {
    const { id } = req.params;
    const stmt = db.prepare('DELETE FROM servicos WHERE id = ?');
    const result = stmt.run(id);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Serviço não encontrado.' });
    }
    res.json({ success: true, message: 'Serviço excluído com sucesso do banco de dados!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -----------------------------------------------------------------------------
// 3. CRUD de Agendamentos (Integrante 2 - ALI 3)
// Campos: ID, Data e Hora, Status, Cliente, Serviço, Observações
// -----------------------------------------------------------------------------
app.get('/api/agendamentos', (req, res) => {
  try {
    const { tenant_id } = req.query;
    let query = `
      SELECT 
        a.id, 
        a.data_hora as dataHora, 
        a.status, 
        COALESCE(c.nome, a.cliente_id) as cliente,
        COALESCE(s.nome_servico, a.servico_id) as servico,
        a.cliente_id as clienteId,
        a.servico_id as servicoId,
        a.observacoes,
        a.tenant_id
      FROM agendamentos a
      LEFT JOIN clientes c ON a.cliente_id = c.id
      LEFT JOIN servicos s ON a.servico_id = s.id
    `;
    const filter = getTenantFilter(tenant_id, 'a');
    query += filter.clause;
    query += ' ORDER BY a.data_hora ASC';
    const rows = db.prepare(query).all(...filter.params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/agendamentos', (req, res) => {
  try {
    const { id, dataHora, status, cliente, servico, observacoes, tenant_id = 'BARBER' } = req.body;
    if (!id || !dataHora || !cliente || !servico) {
      return res.status(400).json({ error: 'Campos obrigatórios ausentes.' });
    }

    // Resolve cliente_id (caso tenha vindo nome ou id)
    let clienteId = cliente;
    const clientMatch = db.prepare('SELECT id FROM clientes WHERE id = ? OR nome = ?').get(cliente, cliente);
    if (clientMatch) clienteId = clientMatch.id;

    // Resolve servico_id (caso tenha vindo nome ou id)
    let servicoId = servico;
    const serviceMatch = db.prepare('SELECT id FROM servicos WHERE id = ? OR nome_servico = ?').get(servico, servico);
    if (serviceMatch) servicoId = serviceMatch.id;

    const stmt = db.prepare(`
      INSERT INTO agendamentos (id, data_hora, status, cliente_id, servico_id, observacoes, tenant_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(id, dataHora, status || 'Confirmado', clienteId, servicoId, observacoes || '', normalizeTenant(tenant_id));
    res.status(201).json({ success: true, message: 'Agendamento cadastrado com sucesso no banco de dados!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/agendamentos/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { dataHora, status, cliente, servico, observacoes, tenant_id } = req.body;

    const current = db.prepare('SELECT * FROM agendamentos WHERE id = ?').get(id);
    if (!current) {
      return res.status(404).json({ error: 'Agendamento não encontrado.' });
    }

    let clienteId = current.cliente_id;
    if (cliente) {
      const match = db.prepare('SELECT id FROM clientes WHERE id = ? OR nome = ?').get(cliente, cliente);
      if (match) clienteId = match.id;
    }

    let servicoId = current.servico_id;
    if (servico) {
      const match = db.prepare('SELECT id FROM servicos WHERE id = ? OR nome_servico = ?').get(servico, servico);
      if (match) servicoId = match.id;
    }

    const stmt = db.prepare(`
      UPDATE agendamentos
      SET data_hora = ?, status = ?, cliente_id = ?, servico_id = ?, observacoes = ?, tenant_id = COALESCE(?, tenant_id)
      WHERE id = ?
    `);
    stmt.run(
      dataHora ?? current.data_hora,
      status ?? current.status,
      clienteId,
      servicoId,
      observacoes ?? current.observacoes,
      tenant_id ?? null,
      id
    );

    res.json({ success: true, message: 'Agendamento atualizado com sucesso no banco de dados!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/agendamentos/:id', (req, res) => {
  try {
    const { id } = req.params;
    const stmt = db.prepare('DELETE FROM agendamentos WHERE id = ?');
    const result = stmt.run(id);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Agendamento não encontrado.' });
    }
    res.json({ success: true, message: 'Agendamento excluído com sucesso do banco de dados!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -----------------------------------------------------------------------------
// 4. CRUD de Disponibilidade (Integrante 2 - ALI 4)
// Campos: ID, Profissional, Dia da Semana, Hora Início, Hora Fim
// -----------------------------------------------------------------------------
app.get('/api/disponibilidade', (req, res) => {
  try {
    const { tenant_id } = req.query;
    let query = 'SELECT id, profissional, dia_semana as diaSemana, hora_inicio as horaInicio, hora_fim as horaFim, tenant_id FROM disponibilidade';
    const filter = getTenantFilter(tenant_id);
    query += filter.clause;
    query += ' ORDER BY dia_semana, hora_inicio ASC';
    const rows = db.prepare(query).all(...filter.params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/disponibilidade', (req, res) => {
  try {
    const { id, profissional, diaSemana, horaInicio, horaFim, tenant_id = 'BARBER' } = req.body;
    if (!id || !profissional || !diaSemana || !horaInicio || !horaFim) {
      return res.status(400).json({ error: 'Campos obrigatórios ausentes.' });
    }

    const stmt = db.prepare(`
      INSERT INTO disponibilidade (id, profissional, dia_semana, hora_inicio, hora_fim, tenant_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    stmt.run(id, profissional, diaSemana, horaInicio, horaFim, normalizeTenant(tenant_id));
    res.status(201).json({ success: true, message: 'Disponibilidade cadastrada com sucesso no banco de dados!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/disponibilidade/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { profissional, diaSemana, horaInicio, horaFim, tenant_id } = req.body;

    const current = db.prepare('SELECT * FROM disponibilidade WHERE id = ?').get(id);
    if (!current) {
      return res.status(404).json({ error: 'Disponibilidade não encontrada.' });
    }

    const stmt = db.prepare(`
      UPDATE disponibilidade
      SET profissional = ?, dia_semana = ?, hora_inicio = ?, hora_fim = ?, tenant_id = COALESCE(?, tenant_id)
      WHERE id = ?
    `);
    stmt.run(
      profissional ?? current.profissional,
      diaSemana ?? current.dia_semana,
      horaInicio ?? current.hora_inicio,
      horaFim ?? current.hora_fim,
      tenant_id ?? null,
      id
    );

    res.json({ success: true, message: 'Disponibilidade atualizada com sucesso no banco de dados!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/disponibilidade/:id', (req, res) => {
  try {
    const { id } = req.params;
    const stmt = db.prepare('DELETE FROM disponibilidade WHERE id = ?');
    const result = stmt.run(id);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Disponibilidade não encontrada.' });
    }
    res.json({ success: true, message: 'Disponibilidade excluída com sucesso do banco de dados!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -----------------------------------------------------------------------------
// 5. Variabilidade & Multi-Tenant (Engenharia de Reuso de Software)
// -----------------------------------------------------------------------------
app.get('/api/tenants', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM tenants').all();
    const formatted = rows.map(r => ({
      ...r,
      features: JSON.parse(r.features_json)
    }));
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/variabilidade', (req, res) => {
  try {
    const counts = {
      clientes: db.prepare('SELECT COUNT(*) as count FROM clientes').get().count,
      servicos: db.prepare('SELECT COUNT(*) as count FROM servicos').get().count,
      agendamentos: db.prepare('SELECT COUNT(*) as count FROM agendamentos').get().count,
      disponibilidade: db.prepare('SELECT COUNT(*) as count FROM disponibilidade').get().count,
      tenants: db.prepare('SELECT COUNT(*) as count FROM tenants').get().count
    };

    const featureModel = {
      sistema: 'Plataforma SaaS Multi-Tenant de Agendamento e Gestão',
      pontosVariacao: [
        {
          id: 'VP-01',
          nome: 'Segmento de Atuação (Tenant)',
          tipo: 'XOR (Alternativa)',
          variantes: ['Barbearia (Vintage)', 'Clínica (Saúde & Estética)'],
          mecanismoReuso: 'Multi-tenant no BD (tenant_id) + CSS Variables + Singleton TenantConfigManager',
          bindingTime: 'Runtime (Execução)'
        },
        {
          id: 'VP-02',
          nome: 'Algoritmo de Alocação de Profissional',
          tipo: 'OR (Múltipla Escolha)',
          variantes: ['Escolha Manual', 'Fila Equilibrada (Round-Robin)', 'Mais Rápido Disponível'],
          mecanismoReuso: 'Padrão GoF Strategy (ProfessionalSelectionStrategy)',
          bindingTime: 'Runtime (Execução)'
        },
        {
          id: 'VP-03',
          nome: 'Cálculo de Desconto & Políticas Comerciais',
          tipo: 'XOR (Alternativa)',
          variantes: ['Sem Desconto', 'Primeira Visita (-15%)', 'Assinatura VIP (-30%)'],
          mecanismoReuso: 'Padrão GoF Strategy (DiscountStrategy)',
          bindingTime: 'Runtime (Execução)'
        },
        {
          id: 'VP-04',
          nome: 'Processamento de Reserva & Recibo',
          tipo: 'XOR (Específico por Domínio)',
          variantes: ['Processador Barbearia + Recibo Simples', 'Processador Clínico + Recibo Detalhado Anamnese'],
          mecanismoReuso: 'Padrão GoF Template Method (BookingProcessor e ReceiptGenerator)',
          bindingTime: 'Runtime (Execução)'
        },
        {
          id: 'VP-05',
          nome: 'Canal de Notificação Externa',
          tipo: 'OR (Múltiplo)',
          variantes: ['WhatsApp Business API', 'E-mail SMTP'],
          mecanismoReuso: 'Padrão GoF Template Method (NotificationPipeline)',
          bindingTime: 'Runtime (Execução)'
        }
      ],
      estatisticasBanco: counts
    };

    res.json(featureModel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor API REST rodando em http://localhost:${PORT}`);
});
