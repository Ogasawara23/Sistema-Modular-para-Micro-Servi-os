# Relatório Técnico de Estimativas com Análise de Pontos de Função (APF - IFPUG)
## Mapeamento e Prototipação de Saídas Externas (SE)

**Projeto:** Sistema Modular Multi-Tenant de Agendamento e Gestão (Barbearia Vintage & Clínica Mente e Corpo)  
**Metodologia:** Análise de Pontos de Função (APF) segundo o Manual de Práticas de Contagem IFPUG (CPM 4.3.1)  
**Composição da Equipe:** Dupla de Engenharia de Software (2 Membros)  
**Distribuição:** 2 Saídas Externas (SE) por membro da equipe = **4 Saídas Externas (SE) no total**  
**Total de Pontos de Função (PFs) das SEs:** **24 PFs**

---

## 1. Fundamentação Teórica: O que define uma Saída Externa (SE / EO)?

De acordo com o IFPUG, uma **Saída Externa (SE)** é um processo elementar que envia dados ou informações de controle para fora da fronteira da aplicação. Para que um processo seja classificado como **SE** (e não Consulta Externa - CE), ele deve cumprir **obrigatoriamente** pelo menos um dos seguintes requisitos:
1. **Conter pelo menos uma fórmula matemática ou cálculo complexo**;
2. **Criar ou apresentar dados derivados**;
3. **Atualizar um ou mais Arquivos Lógicos Internos (ALIs)**;
4. **Alterar o comportamento do sistema**.

No nosso projeto, todas as 4 funções foram rigorosamente projetadas com fórmulas matemáticas, agregações financeiras e derivação de estados em tempo real.

---

## 2. Matriz de Contagem e Complexidade Funcional (IFPUG)

A complexidade funcional de uma Saída Externa (SE) é determinada pelo cruzamento da quantidade de **Arquivos Lógicos Referenciados (ARs / ALIs)** com a quantidade de **Tipos de Dados Referenciados (DERs / Atributos)**:

| Quantidade de ARs (ALIs lidos) | 1 a 5 DERs (Atributos) | 6 a 19 DERs (Atributos) | 20 ou mais DERs |
|:---:|:---:|:---:|:---:|
| **0 a 1 AR** | Baixa (4 PF) | Baixa (4 PF) | Média (5 PF) |
| **2 a 3 ARs** | Baixa (4 PF) | Média (5 PF) | Alta (7 PF) |
| **4 ou mais ARs** | Média (5 PF) | Alta (7 PF) | Alta (7 PF) |

---

## 3. Detalhamento das 4 Saídas Externas (2 por Membro da Equipe)

### 👤 MEMBRO 1 (Arthur Major)

---

#### 📄 SE-01: Extrato e Recibo Fiscal Detalhado de Agendamento
* **Objetivo:** Gerar o comprovante fiscal e recibo formal do atendimento com detalhamento de preços, cálculos tributários municipais e autenticação.
* **Componente Prototipado:** `src/components/se/SE01Receipt.jsx` (integrado na rota `/reports` e no fluxo de Checkout).
* **Classificação IFPUG:**
  - **ALIs Referenciados (4 ARs):**
    1. `ALI_CLIENTES` (Nome, e-mail, telefone, histórico cadastral)
    2. `ALI_SERVICOS` (Nome do procedimento, preço base, duração, categoria)
    3. `ALI_AGENDAMENTOS` (Data e hora, profissional alocado, status da reserva)
    4. `ALI_TENANTS` (Identidade corporativa, regras de sinal, CNPJ/razão social)
  - **Itens de Dados Referenciados (14 DERs):**
    `idRecibo`, `tenantNome`, `clienteNome`, `clienteTelefone`, `servicoNome`, `profissionalNome`, `dataHoraAtendimento`, `precoBaseTabela`, `percentualDesconto`, `valorDescontoCalculado`, `valorSinalCobrado`, `saldoDevedorBalcao`, `impostoISSRetido`, `hashAutenticacaoQRCode`.
  - **Lógica Matemática / Dados Derivados:**
    - $\text{Valor Desconto} = \text{Preço Base} \times (\text{Percentual Desconto} / 100)$
    - $\text{Preço Líquido do Serviço} = \text{Preço Base} - \text{Valor Desconto}$
    - $\text{Valor Sinal Cobrado} = \text{Preço Líquido} \times \text{Alíquota Sinal}$ ($20\%$ vs $100\%$)
    - $\text{Saldo Devedor Pendente} = \text{Preço Líquido} - \text{Valor Sinal Cobrado}$
    - $\text{Retenção Fiscal ISS (5\%)} = \text{Preço Líquido} \times 0{,}05$
    - $\text{Hash Criptográfico de Protocolo} = \text{Geração dinâmica alfanumérica única baseada no ID e timestamp}$
  - **Complexidade:** **Alta** (4 ARs e 14 DERs) $\rightarrow$ **7 Pontos de Função (PF)**.

* **5 Funcionalidades Interativas Implementadas no Modelo:**
  1. *Seleção Dinâmica de Atendimento:* Dropdown conectado aos agendamentos reais do banco de dados SQLite com autopreenchimento instantâneo.
  2. *Aplicação de Desconto por GoF Strategy:* Seleção entre Padrão ($0\%$), Primeira Visita ($-15\%$) e Plano VIP ($-30\%$) com recálculo instantâneo dos valores.
  3. *Alternador de Política de Sinal Multi-Tenant:* Seleção entre Sinal de $20\%$ (Barbearia) e Pagamento Integral de $100\%$ (Clínica) com cálculo automático do saldo devedor de balcão.
  4. *Memória de Cálculo Fiscal & Gateway:* Apuração segregada de $5\%$ de retenção municipal de ISS e $1{,}99\%$ de taxa operacional bancária.
  5. *Emissão Térmica, Hash & WhatsApp:* Renderização visual estilo cupom fiscal térmico com cópia de chave hash de segurança, botão de impressão nativa e simulação de disparo via WhatsApp.

---

#### 📈 SE-02: Relatório Consolidado de Faturamento e Fechamento de Caixa
* **Objetivo:** Consolidar as entradas financeiras, apurar deduções de gateways de pagamento, calcular tickets médios e projetar a receita final do período.
* **Componente Prototipado:** `src/components/se/SE02Revenue.jsx` (integrado na rota `/reports`).
* **Classificação IFPUG:**
  - **ALIs Referenciados (3 ARs):**
    1. `ALI_AGENDAMENTOS` (Agregação de receitas, datas de liquidação e status)
    2. `ALI_SERVICOS` (Valores e categorias dos procedimentos faturados)
    3. `ALI_TENANTS` (Parâmetros fiscais e configurações financeiras ativas)
  - **Itens de Dados Referenciados (12 DERs):**
    `periodoInicial`, `periodoFinal`, `totalAtendimentos`, `faturamentoBruto`, `taxasGatewaysRetidas`, `faturamentoLiquidoReal`, `ticketMedioPonderado`, `volumePix`, `volumeCartaoCredito`, `variacaoMesAnterior`, `projecaoRunRateMensal`, `statusConciliacao`.
  - **Lógica Matemática / Dados Derivados:**
    - $\text{Faturamento Bruto} = \sum \text{Valores de Agendamentos Realizados}$
    - $\text{Taxa Retida Pix (0,99\%)} = \text{Volume Pix} \times 0{,}0099$
    - $\text{Taxa Retida Stripe (2,99\%)} = \text{Volume Cartão} \times 0{,}0299$
    - $\text{Faturamento Líquido} = \text{Faturamento Bruto} - (\text{Taxa Pix} + \text{Taxa Stripe})$
    - $\text{Ticket Médio} = \text{Faturamento Bruto} / \text{Total de Atendimentos}$
    - $\text{Run-Rate (Projeção)} = (\text{Bruto Acumulado} / \text{Dias Decorridos}) \times \text{Dias Totais do Mês}$
  - **Complexidade:** **Média** (3 ARs e 12 DERs) $\rightarrow$ **5 Pontos de Função (PF)**.

* **5 Funcionalidades Interativas Implementadas no Modelo:**
  1. *Filtro Temporal Multicritério:* Alternador dinâmico de período ("Hoje", "Últimos 7 Dias", "Mês Atual") com recálculo instantâneo de todos os indicadores.
  2. *Decomposição Segregada por Meio de Pagamento:* Análise comparativa entre Pix BACEN e Cartão Stripe com valores absolutos, participação percentual e taxas retidas.
  3. *Cálculo e Indicador de Ticket Médio Ponderado:* Relação matemática direta de receita por volume de clientes com base analítica.
  4. *Projeção Estatística Run-Rate:* Estimativa algorítmica de faturamento projetado até o fechamento mensal com base no ritmo diário.
  5. *Exportação de Extrato Analítico em CSV:* Geração dinâmica e download automático de arquivo `.csv` tabular para auditoria contábil.

---

### 👤 MEMBRO 2 (Dupla de Projeto)

---

#### 👥 SE-03: Painel Analítico de Ocupação & Rateio de Comissões da Equipe
* **Objetivo:** Analisar a produtividade individual e coletiva dos especialistas, calcular a ociosidade horária da escala, monitorar faltas (no-shows) e apurar o comissionamento escalonado com bônus de metas.
* **Componente Prototipado:** `src/components/se/SE03Productivity.jsx` (integrado na rota `/reports`).
* **Classificação IFPUG:**
  - **ALIs Referenciados (3 ARs):**
    1. `ALI_DISPONIBILIDADE` (Escala semanal de trabalho e horas totais disponíveis)
    2. `ALI_AGENDAMENTOS` (Horas ocupadas, procedimentos executados e faltas/cancelamentos)
    3. `ALI_SERVICOS` (Valores dos procedimentos para apuração da base comissionável)
  - **Itens de Dados Referenciados (13 DERs):**
    `idProfissional`, `nomeProfissional`, `cargoEspecialidade`, `horasDisponiveisEscala`, `horasTrabalhadasEfetivas`, `taxaOcupacaoPercentual`, `quantidadeAtendimentos`, `quantidadeNoShows`, `taxaAbsenteismoPercentual`, `faturamentoBrutoIndividual`, `aliquotaComissaoBase`, `valorBonusMetaExtra`, `valorTotalRepasseLiquido`.
  - **Lógica Matemática / Dados Derivados:**
    - $\text{Taxa de Ocupação Horária (\%)} = (\text{Horas Efetivamente Trabalhadas} / \text{Horas Disponíveis na Escala}) \times 100$
    - $\text{Taxa de Absenteísmo / No-Show (\%)} = (\text{No-Shows} / (\text{Atendimentos} + \text{No-Shows})) \times 100$
    - $\text{Comissão Contratual Base} = \text{Faturamento Bruto Individual} \times \text{Alíquota Base}$ ($25\%$ a $40\%$)
    - $\text{Bônus Extra de Produtividade} = \text{Se Faturamento} \ge \text{Meta}, \text{adiciona } 5\% \text{ sobre o bruto}; \text{senão } 0$
    - $\text{Repasse Final Líquido} = \text{Comissão Contratual Base} + \text{Bônus Extra}$
  - **Complexidade:** **Média** (3 ARs e 13 DERs) $\rightarrow$ **5 Pontos de Função (PF)**.

* **5 Funcionalidades Interativas Implementadas no Modelo:**
  1. *Cálculo da Taxa Percentual de Ocupação Horária:* Indicador global e por profissional com barra de progresso visual comparando horas trabalhadas contra a grade de horários.
  2. *Monitoramento de No-Show e Absenteísmo:* Cálculo de índice de cancelamentos com semáforo de risco operacional (Normal, Alerta, Crítico).
  3. *Tabela de Comissionamento Escalonado:* Aplicação individualizada das taxas contratuais de cada profissional sobre sua produção real.
  4. *Simulador Interativo de Metas de Produtividade:* Slider dinâmico (R$ 2.000 a R$ 10.000) que recalcula em tempo real o gatilho de bônus de $+5\%$ na tabela inteira.
  5. *Ranking Dinâmico com Ordenação Multi-Coluna:* Seletor para reordenar a equipe instantaneamente por Faturamento Bruto, Taxa de Ocupação ou Quantidade de Atendimentos.

---

#### 📊 SE-04: Demonstrativo de Resultado Operacional e DRE Multi-Tenant
* **Objetivo:** Apurar a saúde econômica da operação através de um DRE contábil gerencial estruturado, demonstrando a margem de contribuição por nicho, o ponto de equilíbrio e o benchmarking comparativo entre tenants.
* **Componente Prototipado:** `src/components/se/SE04DRE.jsx` (integrado na rota `/reports`).
* **Classificação IFPUG:**
  - **ALIs Referenciados (4 ARs):**
    1. `ALI_TENANTS` (Estrutura de custos fixos, segmento e configurações corporativas)
    2. `ALI_AGENDAMENTOS` (Volume de receita bruta auferida no período)
    3. `ALI_SERVICOS` (Custos de insumos por categoria e composição de margens)
    4. `ALI_CLIENTES` (Base ativa de clientes e cálculo de ticket médio)
  - **Itens de Dados Referenciados (15 DERs):**
    `idTenant`, `receitaOperacionalBruta`, `deducoesTributariasFiscais`, `receitaOperacionalLiquida`, `custosInsumosProdutos`, `comissoesVariaveisEquipe`, `margemContribuicaoReais`, `margemContribuicaoPercentual`, `custosFixosOperacionais`, `lucroOperacionalEBITDA`, `margemEBITDAPercentual`, `pontoEquilibrioReais`, `pontoEquilibrioAtendimentos`, `benchmarkMargemComparativa`, `indicadorMargemSeguranca`.
  - **Lógica Matemática / Dados Derivados:**
    - $\text{Receita Líquida} = \text{Receita Bruta} - \text{Deduções Fiscais}$
    - $\text{Custos Variáveis} = \text{Custos de Insumos} + \text{Comissões da Equipe}$
    - $\text{Margem de Contribuição (R\$)} = \text{Receita Líquida} - \text{Custos Variáveis}$
    - $\text{Margem de Contribuição (\%)} = (\text{Margem de Contribuição} / \text{Receita Líquida}) \times 100$
    - $\text{Lucro Operacional EBITDA} = \text{Margem de Contribuição} - \text{Custos Fixos}$
    - $\text{Margem EBITDA (\%)} = (\text{Lucro EBITDA} / \text{Receita Líquida}) \times 100$
    - $\text{Ponto de Equilíbrio (R\$)} = \text{Custos Fixos} / (\text{Margem de Contribuição} / \text{Receita Líquida})$
    - $\text{Ponto de Equilíbrio (Atendimentos)} = \text{Ponto de Equilíbrio (R\$)} / \text{Ticket Médio}$
  - **Complexidade:** **Alta** (4 ARs e 15 DERs) $\rightarrow$ **7 Pontos de Função (PF)**.

* **5 Funcionalidades Interativas Implementadas no Modelo:**
  1. *DRE Estruturado em Cascata Financeira:* Apresentação linha a linha da demonstração de resultados com alternância entre visão Sintética e Analítica.
  2. *Decomposição de Margem de Contribuição por Categoria:* Barras de rentabilidade demonstrando o percentual de margem de cada linha de serviço (ex: Cabelo/Barba vs Consultas Médicas).
  3. *Calculadora de Ponto de Equilíbrio (Break-Even Point):* Cálculo do faturamento mínimo e volume mínimo de atendimentos necessários, com simulador deslizante de custos fixos adicionais.
  4. *Benchmarking Comparativo Multi-Tenant:* Comparação lado a lado entre a performance financeira da Barbearia Vintage e da Clínica Mente & Corpo.
  5. *Exportação Gerencial do DRE:* Botão de geração e download formatado do relatório para tomada de decisão gerencial.

---

## 4. Consolidação Geral das Estimativas da Entrega

| Código | Saída Externa (SE) | Responsável | ALIs (ARs) | DERs | Complexidade | Pontos de Função (PF) |
|:---:|:---|:---:|:---:|:---:|:---:|:---:|
| **SE-01** | Extrato & Recibo Fiscal Detalhado | Membro 1 (Arthur) | 4 | 14 | **Alta** | **7 PF** |
| **SE-02** | Fechamento de Caixa & Faturamento | Membro 1 (Arthur) | 3 | 12 | **Média** | **5 PF** |
| **SE-03** | Painel de Ocupação & Comissões | Membro 2 (Dupla) | 3 | 13 | **Média** | **5 PF** |
| **SE-04** | DRE Operacional & Multi-Tenant | Membro 2 (Dupla) | 4 | 15 | **Alta** | **7 PF** |
| **TOTAL** | **4 Saídas Externas Prototipadas** | **2 Membros** | **—** | **—** | **—** | **24 PF** |

### Resumo por Integrante:
* **Membro 1 (Arthur Major):** SE-01 (7 PF) + SE-02 (5 PF) = **12 Pontos de Função**
* **Membro 2 (Dupla de Projeto):** SE-03 (5 PF) + SE-04 (7 PF) = **12 Pontos de Função**
* **Equilíbrio da Carga de Trabalho:** 100% balanceada ($12\text{ PF} \times 12\text{ PF}$), com 1 Saída Externa de Complexidade Alta (7 PF) e 1 de Complexidade Média (5 PF) para cada integrante.

---

## 5. Como Executar e Validar a Prototipação

1. Inicie a aplicação no terminal:
   ```bash
   npm run dev
   ```
2. Abra no navegador: `http://localhost:5173`
3. Acesse a aba **"Relatórios Financeiros"** (`/reports`) no menu lateral ou digite `http://localhost:5173/reports`.
4. Utilize a barra superior de abas de APF para transitar livremente entre:
   - `SE-01: Recibos Fiscais (Membro 1)`
   - `SE-02: Fechamento Caixa (Membro 1)`
   - `SE-03: Produtividade & Comissões (Membro 2)`
   - `SE-04: DRE & Multi-Tenant (Membro 2)`
   - `Auditoria Stripe / Pix (AIE)`
5. Teste as **5 funcionalidades interativas** de cada SE (filtros, seletores de estratégia, sliders de metas, cálculos automáticos e botões de exportação).
