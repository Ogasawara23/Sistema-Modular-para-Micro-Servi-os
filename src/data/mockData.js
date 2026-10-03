/**
 * Mock Data para Protótipos de CRUD e Componentes Read-Only
 * Contém os campos exatos solicitados na especificação.
 */

// 1. Clientes: ID, Nome, Email, Telefone, Senha, Data_Cadastro
export const initialClients = [
  {
    id: 'CLI-001',
    nome: 'Gabriel Duarte Silva',
    email: 'gabriel.duarte@email.com',
    telefone: '(11) 98765-4321',
    senha: 'hash_pbkdf2_918237198',
    dataCadastro: '2026-01-15'
  },
  {
    id: 'CLI-002',
    nome: 'Beatriz Almeida Costa',
    email: 'beatriz.costa@email.com',
    telefone: '(11) 97654-3210',
    senha: 'hash_pbkdf2_827163821',
    dataCadastro: '2026-02-20'
  },
  {
    id: 'CLI-003',
    nome: 'Lucas Mendonça Ferreira',
    email: 'lucas.mendonca@email.com',
    telefone: '(21) 99123-4567',
    senha: 'hash_pbkdf2_716253412',
    dataCadastro: '2026-03-10'
  },
  {
    id: 'CLI-004',
    nome: 'Mariana Ribeiro Ramos',
    email: 'mariana.ramos@email.com',
    telefone: '(31) 98456-7890',
    senha: 'hash_pbkdf2_615243819',
    dataCadastro: '2026-04-05'
  },
  {
    id: 'CLI-005',
    nome: 'Rafael Nogueira Santos',
    email: 'rafael.nogueira@email.com',
    telefone: '(41) 99876-5432',
    senha: 'hash_pbkdf2_514238716',
    dataCadastro: '2026-05-18'
  }
];

// 2. Serviços: ID, Nome do Serviço, Preço, Duração em Minutos, Categoria
export const initialServices = [
  {
    id: 'SRV-001',
    nomeServico: 'Corte Degradê Premium & Barboterapia',
    preco: 95.00,
    duracaoMinutos: 50,
    categoria: 'Cabelo e Barba'
  },
  {
    id: 'SRV-002',
    nomeServico: 'Barba Tradicional com Toalha Quente',
    preco: 55.00,
    duracaoMinutos: 35,
    categoria: 'Barba'
  },
  {
    id: 'SRV-003',
    nomeServico: 'Limpeza de Pele Facial Profunda',
    preco: 180.00,
    duracaoMinutos: 60,
    categoria: 'Estética Facial'
  },
  {
    id: 'SRV-004',
    nomeServico: 'Consulta Dermatológica Clínica',
    preco: 250.00,
    duracaoMinutos: 45,
    categoria: 'Consultas Médicas'
  },
  {
    id: 'SRV-005',
    nomeServico: 'Tratamento Capilar Reconstrutor',
    preco: 130.00,
    duracaoMinutos: 40,
    categoria: 'Tratamento'
  }
];

// 3. Agendamentos: ID, Data e Hora, Status, Cliente, Serviço, Observações
export const initialAppointments = [
  {
    id: 'AGD-201',
    dataHora: '2026-09-18T14:30',
    status: 'Confirmado',
    cliente: 'Gabriel Duarte Silva',
    servico: 'Corte Degradê Premium & Barboterapia',
    observacoes: 'Cliente prefere acabamento na tesoura no topo e navalha nas laterais.'
  },
  {
    id: 'AGD-202',
    dataHora: '2026-09-18T16:00',
    status: 'Pendente',
    cliente: 'Beatriz Almeida Costa',
    servico: 'Limpeza de Pele Facial Profunda',
    observacoes: 'Pele sensível com histórico de rosácea leve.'
  },
  {
    id: 'AGD-203',
    dataHora: '2026-09-19T10:00',
    status: 'Confirmado',
    cliente: 'Lucas Mendonça Ferreira',
    servico: 'Barba Tradicional com Toalha Quente',
    observacoes: 'Primeira visita indicada por amigos.'
  },
  {
    id: 'AGD-204',
    dataHora: '2026-09-20T11:15',
    status: 'Concluído',
    cliente: 'Mariana Ribeiro Ramos',
    servico: 'Consulta Dermatológica Clínica',
    observacoes: 'Retorno de rotina sem intercorrências.'
  },
  {
    id: 'AGD-205',
    dataHora: '2026-09-21T15:45',
    status: 'Cancelado',
    cliente: 'Rafael Nogueira Santos',
    servico: 'Tratamento Capilar Reconstrutor',
    observacoes: 'Solicitou cancelamento prévio por conflito de agenda.'
  }
];

// 4. Disponibilidade: ID, Profissional, Dia da Semana, Hora Início, Hora Fim
export const initialAvailability = [
  {
    id: 'DSP-101',
    profissional: 'Carlos Eduardo (Master Barber)',
    diaSemana: 'Segunda-feira',
    horaInicio: '09:00',
    horaFim: '18:00'
  },
  {
    id: 'DSP-102',
    profissional: 'Carlos Eduardo (Master Barber)',
    diaSemana: 'Terça-feira',
    horaInicio: '09:00',
    horaFim: '19:00'
  },
  {
    id: 'DSP-103',
    profissional: 'Dra. Helena Moreira (Dermatologista)',
    diaSemana: 'Quarta-feira',
    horaInicio: '08:30',
    horaFim: '17:30'
  },
  {
    id: 'DSP-104',
    profissional: 'Dra. Helena Moreira (Dermatologista)',
    diaSemana: 'Quinta-feira',
    horaInicio: '08:30',
    horaFim: '16:00'
  },
  {
    id: 'DSP-105',
    profissional: 'Marcos Vinícius (Visagista)',
    diaSemana: 'Sexta-feira',
    horaInicio: '10:00',
    horaFim: '20:00'
  },
  {
    id: 'DSP-106',
    profissional: 'Marcos Vinícius (Visagista)',
    diaSemana: 'Sábado',
    horaInicio: '08:00',
    horaFim: '14:00'
  }
];

// 5. Integração Externa: Painel de Pagamentos (Stripe/Pix) [READ-ONLY]
// Campos: Transação ID, Status do Pagamento, Valor Confirmado, Data do Pagamento
export const mockPayments = [
  {
    transacaoId: 'ch_stripe_3M9kLx2eZvKYlo2C1',
    metodo: 'Stripe (Cartão de Crédito)',
    statusPagamento: 'Liquidado',
    valorConfirmado: 95.00,
    dataPagamento: '2026-09-15 14:32:10',
    cliente: 'Gabriel Duarte Silva',
    moeda: 'BRL'
  },
  {
    transacaoId: 'pix_bcb_98f12a45c0839e112d',
    metodo: 'Pix Banco Central',
    statusPagamento: 'Aprovado',
    valorConfirmado: 180.00,
    dataPagamento: '2026-09-15 11:15:43',
    cliente: 'Beatriz Almeida Costa',
    moeda: 'BRL'
  },
  {
    transacaoId: 'ch_stripe_3M9kQp2eZvKYlo2C0',
    metodo: 'Stripe (Apple Pay)',
    statusPagamento: 'Liquidado',
    valorConfirmado: 250.00,
    dataPagamento: '2026-09-14 16:45:00',
    cliente: 'Mariana Ribeiro Ramos',
    moeda: 'BRL'
  },
  {
    transacaoId: 'pix_bcb_77b33a12d9911e441c',
    metodo: 'Pix Banco Central',
    statusPagamento: 'Aprovado',
    valorConfirmado: 55.00,
    dataPagamento: '2026-09-14 09:20:18',
    cliente: 'Lucas Mendonça Ferreira',
    moeda: 'BRL'
  },
  {
    transacaoId: 'ch_stripe_3M9kZz2eZvKYlo2C9',
    metodo: 'Stripe (Cartão de Crédito)',
    statusPagamento: 'Estornado',
    valorConfirmado: 130.00,
    dataPagamento: '2026-09-13 18:05:22',
    cliente: 'Rafael Nogueira Santos',
    moeda: 'BRL'
  },
  {
    transacaoId: 'pix_bcb_66a22f33b8822c330a',
    metodo: 'Pix Banco Central',
    statusPagamento: 'Aprovado',
    valorConfirmado: 80.75,
    dataPagamento: '2026-09-13 10:12:05',
    cliente: 'Rodrigo Medeiros',
    moeda: 'BRL'
  }
];

// 6. Integração Externa: Tela de Login Google OAuth [READ-ONLY PROFILE]
// Campos: Token, Provider ID, Email Verificado, Nome Google
export const mockGoogleProfile = {
  token: 'ya29.a0AfH6SMBx9Z3k8qYv4Lp1o0N7w6E5r4T3u2I1o9P8a7S6d5F4g3H2j1K0l9M8n7B6v5C4x3Z2A1s0D9f8G7h6J5k4L3m2N1',
  providerId: 'google.com (10928374619283749281)',
  emailVerificado: true,
  nomeGoogle: 'Lucas Rodrigues Pereira',
  email: 'lucas.rodrigues@gmail.com',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&auto=format&fit=crop&q=80',
  escopos: ['openid', 'email', 'profile'],
  expiracao: '1 hora (renovação automática)',
  ultimoLogin: '2026-09-16 21:30:12 UTC-3'
};

// 7. Integração Externa: Log de Notificações (WhatsApp) [READ-ONLY]
// Campos: Mensagem ID, Status de Envio, Data de Entrega, Destinatário
export const mockWhatsAppLogs = [
  {
    mensagemId: 'WAM-2026-0918-001',
    statusEnvio: 'Lido',
    dataEntrega: '2026-09-16 14:31:02',
    destinatario: '+55 (11) 98765-4321 (Gabriel Duarte)',
    template: 'confirmação_agendamento_barber',
    conteudo: 'Olá Gabriel! Seu agendamento de Corte Degradê foi confirmado para 18/09 às 14:30.'
  },
  {
    mensagemId: 'WAM-2026-0918-002',
    statusEnvio: 'Entregue',
    dataEntrega: '2026-09-16 14:30:45',
    destinatario: '+55 (11) 97654-3210 (Beatriz Almeida)',
    template: 'lembrete_24h_clinica',
    conteudo: 'Lembrete de consulta: Limpeza de Pele amanhã às 16:00 na Clínica Saúde & Estética.'
  },
  {
    mensagemId: 'WAM-2026-0918-003',
    statusEnvio: 'Lido',
    dataEntrega: '2026-09-15 18:22:11',
    destinatario: '+55 (21) 99123-4567 (Lucas Mendonça)',
    template: 'recibo_pagamento_pix',
    conteudo: 'Recebemos seu pagamento via Pix de R$ 55,00. Código comprovante: REC-712891.'
  },
  {
    mensagemId: 'WAM-2026-0918-004',
    statusEnvio: 'Enviado',
    dataEntrega: '2026-09-15 10:14:50',
    destinatario: '+55 (31) 98456-7890 (Mariana Ribeiro)',
    template: 'pesquisa_satisfacao',
    conteudo: 'Mariana, conte-nos como foi sua experiência na consulta dermatológica de hoje!'
  },
  {
    mensagemId: 'WAM-2026-0918-005',
    statusEnvio: 'Falha',
    dataEntrega: '2026-09-14 09:05:12',
    destinatario: '+55 (41) 90000-0000 (Número Inválido)',
    template: 'boas_vindas_cadastro',
    conteudo: 'Número do destinatário não cadastrado na rede WhatsApp Business API.'
  }
];

// 8. Integração Externa: Calendário de Feriados [READ-ONLY EXTERNAL DATA]
// Campos: Data do Feriado, Nome do Feriado, Tipo de Feriado
export const mockHolidays = [
  {
    dataFeriado: '2026-01-01',
    nomeFeriado: 'Confraternização Universal (Ano Novo)',
    tipoFeriado: 'Nacional'
  },
  {
    dataFeriado: '2026-02-17',
    nomeFeriado: 'Carnaval',
    tipoFeriado: 'Ponto Facultativo'
  },
  {
    dataFeriado: '2026-04-03',
    nomeFeriado: 'Sexta-feira Santa',
    tipoFeriado: 'Nacional'
  },
  {
    dataFeriado: '2026-04-21',
    nomeFeriado: 'Tiradentes',
    tipoFeriado: 'Nacional'
  },
  {
    dataFeriado: '2026-05-01',
    nomeFeriado: 'Dia Mundial do Trabalho',
    tipoFeriado: 'Nacional'
  },
  {
    dataFeriado: '2026-06-04',
    nomeFeriado: 'Corpus Christi',
    tipoFeriado: 'Ponto Facultativo'
  },
  {
    dataFeriado: '2026-07-09',
    nomeFeriado: 'Revolução Constitucionalista',
    tipoFeriado: 'Estadual (SP)'
  },
  {
    dataFeriado: '2026-09-07',
    nomeFeriado: 'Independência do Brasil',
    tipoFeriado: 'Nacional'
  },
  {
    dataFeriado: '2026-10-12',
    nomeFeriado: 'Nossa Senhora Aparecida (Padroeira do Brasil)',
    tipoFeriado: 'Nacional'
  },
  {
    dataFeriado: '2026-11-02',
    nomeFeriado: 'Finados',
    tipoFeriado: 'Nacional'
  },
  {
    dataFeriado: '2026-11-15',
    nomeFeriado: 'Proclamação da República',
    tipoFeriado: 'Nacional'
  },
  {
    dataFeriado: '2026-11-20',
    nomeFeriado: 'Dia Nacional de Zumbi e da Consciência Negra',
    tipoFeriado: 'Nacional'
  },
  {
    dataFeriado: '2026-12-25',
    nomeFeriado: 'Natal',
    tipoFeriado: 'Nacional'
  }
];
