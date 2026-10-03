# Prompt de Engenharia de Frontend: Sistema SaaS Multi-Tenant com Padrões de Reuso

> **Documento**: `PromptFrontEnd.md`  
> **Objetivo**: Especificação técnica em formato de Prompt de Engenharia para orientar o desenvolvimento completo da interface frontend e da camada de arquitetura de software reutilizável.

---

## 🤖 Prompt Recomendado (Master Prompt)

```markdown
Atue como um Engenheiro de Software Senior e Designer de UI/UX especialista em Arquiteturas Multi-Tenant e Engenharia de Reuso de Software.

Sua tarefa é desenvolver uma aplicação web completa, moderna e reativa utilizando **React + Vite**, que sirva como protótipo funcional para uma plataforma SaaS de Agendamento e Gestão White-Label (capaz de atender diferentes nichos, como Barbearias e Clínicas Médicas/Estéticas).

---

### 🎨 1. Requisitos de Interface (UI/UX & Design System)
1. **Estética de Alto Padrão**:
   - Tema escuro moderno (*Dark Theme*) utilizando paletas de cores refinadas (`#0b0f19`, `#1e293b`), cantos arredondados suavizados (`border-radius: 20px`), sombras difusas e tipografia moderna (`Plus Jakarta Sans` e `JetBrains Mono` para recibos).
   - Efeitos de **Glassmorphic Navbar** com transparência e desfoque de fundo (`backdrop-filter: blur(16px)`).
   
2. **Capacidade Multi-Tenant White-Label Dinâmica**:
   - Inclua um alternador no topo da tela para trocar entre o perfil **"Barbearia Vintage & Style"** (Tom Azul `#2563eb`) e **"Clínica Saúde & Estética"** (Tom Verde Água `#0d9488`).
   - A troca de tenant deve alterar nativamente as variáveis CSS do sistema (`--tenant-primary`), atualizando instantaneamente as cores de destaque, os serviços disponíveis, o catálogo e a lista de profissionais.

3. **Componentes da Jornada do Usuário**:
   - **Barra de Progresso (Stepper)**: Indicador visual das etapas do agendamento (1. Serviço ➔ 2. Profissional & Data ➔ 3. Pagamento ➔ 4. Confirmação).
   - **Grid de Serviços**: Cards clicáveis com nome, duração e preço.
   - **Seleção de Profissionais**: Suporte a fotos/avatares e indicativo de avaliação (ex: 4.9 ★).
   - **Seletores de Estratégias**: Botões interativos para escolha do algoritmo de alocação, cupom de desconto e meio de pagamento.
   - **Painel Lateral de Checkout (Sticky Summary)**: Card fixo à direita mostrando o resumo dos itens, valores e o botão de ação principal.
   - **Modal de Confirmação**: Janela sobreposta que exibe o bilhete/recibo impresso estilizado em código monoespaçado e o status do envio de notificação.

---

### 🏛️ 2. Arquitetura de Reuso de Software (Padrões de Projeto sob o capô)
Toda a lógica de negócios deve ser isolada na pasta `src/patterns/` e executada de forma transparente pelas interações da interface, implementando rigorosamente os **8 Padrões de Projeto**:

#### A. Singletons (2 Padrões)
*   `TenantConfigManager` (`src/patterns/singletons/TenantConfigManager.js`): Mantém uma única instância global do tenant ativo (dados, cores e serviços).
*   `SessionManager` (`src/patterns/singletons/SessionManager.js`): Mantém a instância única com o perfil do usuário logado na sessão.

#### B. Template Methods (3 Padrões)
*   `BaseBookingProcessor` (`src/patterns/templates/BookingProcessor.js`): Define o algoritmo fixo de processamento de reserva (`validateAvailability` ➔ `calculatePrice` ➔ `applySpecialRules` ➔ `confirmBooking`). Subclasses: `BarberBookingProcessor` e `ClinicBookingProcessor`.
*   `BaseReceiptGenerator` (`src/patterns/templates/ReceiptGenerator.js`): Padroniza a montagem do recibo (`buildHeader` ➔ `buildBody` ➔ `buildFooter`). Subclasses: `SimpleReceiptGenerator` e `DetailedClinicalReceiptGenerator`.
*   `BaseNotificationPipeline` (`src/patterns/templates/NotificationPipeline.js`): Padroniza a sequência de disparo de mensagens (`validateRecipient` ➔ `formatMessage` ➔ `dispatch`). Subclasses: `EmailNotificationPipeline` e `WhatsAppNotificationPipeline`.

#### C. Strategies (3 Padrões)
*   `ProfessionalSelectionStrategy` (`src/patterns/strategies/ProfessionalSelectionStrategy.js`): Algoritmos para alocação de profissionais (`ManualProfessionalStrategy`, `RoundRobinStrategy`, `FastestAvailableStrategy`).
*   `DiscountStrategy` (`src/patterns/strategies/DiscountStrategy.js`): Algoritmos de cálculo de descontos (`NoDiscountStrategy`, `FirstVisitDiscountStrategy` -15%, `VipSubscriptionDiscountStrategy` -30%).
*   `PaymentStrategy` (`src/patterns/strategies/PaymentStrategy.js`): Algoritmos de cobrança (`PixPaymentStrategy`, `CreditCardPaymentStrategy`, `DepositAdvancePaymentStrategy` 30%).

---

### 📦 3. Entregáveis Esperados
1. Código limpo em React + Vite utilizando a biblioteca `lucide-react` para ícones.
2. Execução sem erros no servidor de desenvolvimento (`npm run dev`).
3. Documentação `js.md` na raiz mapeando cada função e padrão implementado.
```
