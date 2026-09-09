## Why

A API precisa de um caso de uso que analise o histórico de transações de um usuário e produza um score de crédito no estilo Serasa (0-1000), permitindo que sistemas consumidores decidam sobre concessão de crédito sem implementar a lógica de risco por conta própria.

## What Changes

- Adicionar um caso de uso (application service) de revisão de crédito que recebe um usuário e seu histórico de transações e retorna um score de crédito.
- O score é calculado na faixa 0-1000, seguindo o modelo de faixas de risco do Serasa (Muito Baixo, Baixo, Médio, Alto, Muito Alto).
- O cálculo considera três fatores do histórico de transações: pontualidade de pagamentos, volume/frequência de transações e inadimplência (transações em aberto/atrasadas).
- Usuário e histórico de transações são recebidos como parâmetros de entrada do caso de uso — nenhuma camada de persistência é criada nesta change.
- Adicionar uma rota HTTP (`POST /credit-score`) seguindo a arquitetura existente (route → controller → service) para expor o caso de uso via API.

## Capabilities

### New Capabilities
- `credit-score-review`: Cálculo de score de crédito (0-1000, estilo Serasa) a partir de dados do usuário e histórico de transações, incluindo classificação em faixas de risco.

### Modified Capabilities
(nenhuma — `api-foundation` fornece a infraestrutura de rotas/erros já existente e não precisa de alteração de requisitos)

## Impact

- Novos arquivos em `src/services/`, `src/controllers/`, `src/routes/`, `src/types/` para o caso de uso de revisão de crédito.
- Nova rota HTTP montada em `src/routes/index.ts`, reutilizando a infraestrutura de erros centralizados de `api-foundation`.
- Nenhuma dependência externa nova (cálculo determinístico, sem chamada a serviços de crédito reais).
