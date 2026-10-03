# Sistema Modular para Micro-Serviços
> Plataforma SaaS Multi-Tenant de Agendamento e Gestão Inteligente (Barbearia & Clínica)

Sistema completo com arquitetura modular, persistência em banco de dados relacional **SQLite** nativo, controle de variabilidade e **Padrões de Projeto GoF**.

---

## 🚀 Tecnologias Utilizadas

- **Frontend:** React 18, Vite, Tailwind CSS, Lucide React, React Router DOM.
- **Backend:** Node.js, Express, Native Node SQLite (`node:sqlite` do Node 22+).
- **Arquitetura & Engenharia de Software:**
  - **Multi-Tenancy:** Isolamento de dados, esquemas dinâmicos de cores e fontes por tenant.
    - **Tenant A (Barbearia):** Dark Vintage Luxury (Paleta Ouro Âmbar, fontes *Cinzel* e *Outfit*).
    - **Tenant B (Clínica):** Clean Healthcare Modern (Paleta Azul Clínico, fontes *Inter*).
  - **Padrões GoF Implementados:** Strategy (cálculo de checkout e sinal 20% vs 100%), Singleton (gerenciadores de tenant e sessão), Factory Method, Observer, Decorator, Adapter, Composite, Chain of Responsibility.
  - **Feature Toggles:** Habilitação em tempo de execução de módulos como Telemedicina, Anamnese com IA e Gestão de Comissões.

---

## 📋 Funcionalidades e Abas da Aplicação

1. **Dashboard Geral:** Métricas sincronizadas com faturamento, ocupação diária e banco de dados SQLite.
2. **Agenda & Calendário:** Grade horária interativa com agendamento direto e filtros por profissional.
3. **Gestão de Clientes:** CRUD relacional com busca em tempo real, visualização VIP e modal de cadastro SQLite.
4. **Perfil do Cliente:** Prontuário, histórico de atendimentos e anotações protegidas por Feature Flag.
5. **Catálogo de Serviços:** Gestão de preços, durações e categorias com persistência no banco.
6. **Equipe & Profissionais:** Cadastro de especialistas e parametrização de comissões.
7. **Checkout & PDV:**
   - PDV Dinâmico com Strategy Pattern (sinal de 20% para barbearia vs 100% integral para clínica).
   - Fluxo GoF Completo com 8 padrões arquiteturais orquestrados em tempo real.
8. **Produtos & Estoque:** Controle de estoque de insumos e itens de revenda.
9. **Relatórios Financeiros:** Auditoria de pagamentos Stripe/Pix e rateio de comissões.
10. **Teleconsulta:** Sala virtual com link dinâmico e sala de espera para teleatendimento.
11. **Anamnese com IA:** Módulo lazy-loaded para questionários clínicos e resumos inteligentes.
12. **Configurações & Flags:** Painel de controle de variabilidade e ativação de módulos.
13. **Tenant Switcher:** Alternador rápido de identidade e perfis simulados.
14. **Matriz de Variabilidade & Reuso:** Mapeamento visual de componentes reusáveis e padrões GoF.

---

## 🛠️ Como Executar

### Pré-requisitos
- Node.js 22 ou superior instalado.
- npm instalado.

### Instalação das dependências
```bash
npm install
```

### Iniciar o Projeto (Backend SQLite + Frontend Vite)
```bash
npm run dev
```

- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:3001/api/health](http://localhost:3001/api/health)

### Build de Produção
```bash
npm run build
```

---

## 🗄️ Estrutura do Banco SQLite (`server/database.sqlite`)

- `tenants`: Armazena os tenants ativos (`BARBER` / `CLINIC`) e seus metadados de configuração.
- `clientes`: Tabela relacional com dados cadastrais e credenciais.
- `servicos`: Catálogo de procedimentos com preços e durações.
- `agendamentos`: Chaves estrangeiras conectando cliente, serviço e tenant.
- `disponibilidade`: Escalas de horários por especialista.
