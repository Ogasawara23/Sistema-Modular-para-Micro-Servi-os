# Especificação dos Protótipos de CRUD e Componentes Read-Only

Documentação completa da implementação realizada dentro da pasta `projeto`, integrando protótipos interativos para gestão SaaS e visualização de integrações externas.

---

## 1. Entidades de CRUD (Listagem e Formulário de Criação/Edição)

Todos os formulários e tabelas contêm **exatamente os campos solicitados**, com suporte a busca, filtros, validação, criação, edição, exclusão e dados mockados estruturados:

### A. Clientes
* **Campos Obrigatórios**:
  - `ID`: Identificador único (ex: `CLI-001`, `CLI-002`)
  - `Nome`: Nome completo do cliente
  - `Email`: Endereço de e-mail para contato e login
  - `Telefone`: Número formatado `(DD) 9XXXX-XXXX`
  - `Senha`: Senha/Hash de autenticação do cliente com botão de alternar visibilidade (`••••••` / texto plano)
  - `Data_Cadastro`: Data em formato ISO (`YYYY-MM-DD`)
* **Componente**: `src/components/crud/ClientsCrud.jsx`

### B. Serviços
* **Campos Obrigatórios**:
  - `ID`: Identificador único (ex: `SRV-001`)
  - `Nome do Serviço`: Descrição do atendimento (ex: `Corte Degradê Premium`)
  - `Preço`: Valor numérico em R$ formatado
  - `Duração em Minutos`: Tempo estimado em minutos (ex: `45 min`)
  - `Categoria`: Segmentação (Cabelo e Barba, Estética Facial, Consultas Médicas, etc.)
* **Componente**: `src/components/crud/ServicesCrud.jsx`

### C. Agendamentos
* **Campos Obrigatórios**:
  - `ID`: Identificador da reserva (ex: `AGD-201`)
  - `Data e Hora`: Data e horário no formato `YYYY-MM-DDTHH:mm`
  - `Status`: Situação do agendamento (`Confirmado`, `Pendente`, `Concluído`, `Cancelado`) com badges coloridos
  - `Cliente`: Vínculo com a entidade Cliente
  - `Serviço`: Vínculo com a entidade Serviço
  - `Observações`: Campo textual para detalhes adicionais e histórico do cliente
* **Componente**: `src/components/crud/AppointmentsCrud.jsx`

### D. Disponibilidade
* **Campos Obrigatórios**:
  - `ID`: Identificador da escala (ex: `DSP-101`)
  - `Profissional`: Nome do atendente ou especialista responsável
  - `Dia da Semana`: Dia da escala (`Segunda-feira` a `Domingo`)
  - `Hora Início`: Início do expediente (ex: `09:00`)
  - `Hora Fim`: Término do expediente (ex: `18:00`)
* **Componente**: `src/components/crud/AvailabilityCrud.jsx`

---

## 2. Componentes de Interface Focados em LEITURA (Read-Only) e Integrações Externas

Estes componentes são dedicados à visualização de payloads e eventos de serviços externos, **sem botões de edição**:

### A. Painel de Pagamentos (Stripe / Pix)
* **Campos Exibidos**:
  - `Transação ID`: Hash do gateway externo (ex: `ch_stripe_3M9kLx2eZvKYlo2C1`, `pix_bcb_98f12a45c...`)
  - `Status do Pagamento`: `Liquidado`, `Aprovado`, `Processando`, `Estornado`
  - `Valor Confirmado`: Valor monetário recebido (R$)
  - `Data do Pagamento`: Carimbo de data e hora do processamento bancário
* **Diferenciais**:
  - Identificação visual clara do gateway (Stripe vs Pix BACEN)
  - Cards de indicadores consolidados (Total Confirmado, Volume Stripe, Volume Pix)
  - **Sem botões de edição**, com aviso explícito de auditoria bancária PCI-DSS.
* **Componente**: `src/components/readonly/PaymentsPanel.jsx`

### B. Tela de Login (Google SSO)
* **Elementos Exibidos**:
  - Botão oficial **"Entrar com Google"** com logo e efeito hover
  - Botão para simular login com conta secundária ou logout
  - Perfil mockado contendo exatamente os dados recebidos do provedor:
    - `Token`: OAuth Access Token com botão de cópia
    - `Provider ID`: Identificador federado (`google.com (10928374619283749281)`)
    - `Email Verificado`: Indicador booleano `true` com badge verificado
    - `Nome Google`: Nome retornado pela API de perfil
* **Componente**: `src/components/readonly/GoogleLoginScreen.jsx`

### C. Log de Notificações (WhatsApp)
* **Campos Exibidos**:
  - `Mensagem ID`: Identificador da mensagem (ex: `WAM-2026-0918-001`)
  - `Status de Envio`: Ícones dinâmicos de status (`Lido` com double blue check, `Entregue` com double grey check, `Enviado`, `Falha`)
  - `Data de Entrega`: Data e hora da entrega
  - `Destinatário`: Telefone e nome do cliente
* **Diferenciais**:
  - Painel lateral interativo simulando a pré-visualização da mensagem no balão do WhatsApp
  - Exibição do template de notificação associado
  - **Sem opções de edição pós-envio**.
* **Componente**: `src/components/readonly/WhatsAppLogs.jsx`

### D. Calendário de Feriados (Integração Externa)
* **Campos Exibidos**:
  - `Data do Feriado`: Data do evento (ex: `2026-09-07`, `2026-10-12`)
  - `Nome do Feriado`: Denominação oficial (ex: `Independência do Brasil`)
  - `Tipo de Feriado`: `Nacional`, `Estadual`, `Ponto Facultativo`
* **Diferenciais**:
  - Grade mensal do calendário destacando em vermelho os dias com feriados com aviso **"INDISPONÍVEL"**
  - Bloqueio de marcações nesses dias
  - Lista lateral sincronizada com filtro por tipo de feriado
* **Componente**: `src/components/readonly/HolidayCalendar.jsx`

---

## 3. Preservação da Arquitetura Multi-Tenant & GoF Design Patterns

A navegação superior do sistema permite transitar livremente entre o fluxo original de agendamento (que utiliza os 8 padrões GoF: `Singletons`, `Template Methods` e `Strategies`) e os novos módulos de CRUD e Integrações Read-Only, aplicando dinamicamente o tema do tenant ativo (**Barbearia Vintage** ou **Clínica Saúde & Estética**).
