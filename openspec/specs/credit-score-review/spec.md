# credit-score-review Specification

## Purpose

Calcula um score de crédito no estilo Serasa (0-1000) a partir dos dados de um usuário e do seu histórico de transações, classificando o resultado em uma faixa de risco.

## Requirements

### Requirement: Cálculo do Score de Crédito
O sistema SHALL calcular um score de crédito numérico na faixa de 0 a 1000 a partir de um usuário e do seu histórico de transações, fornecidos como entrada do caso de uso.

#### Scenario: Score calculado para histórico válido
- **WHEN** o caso de uso recebe um usuário e uma lista não vazia de transações
- **THEN** o sistema retorna um score inteiro entre 0 e 1000

#### Scenario: Score para usuário sem histórico de transações
- **WHEN** o caso de uso recebe um usuário com uma lista de transações vazia
- **THEN** o sistema retorna um score dentro da faixa 0-1000, refletindo ausência de histórico, em vez de falhar

### Requirement: Fatores de Cálculo do Score
O sistema SHALL considerar os seguintes fatores extraídos do histórico de transações no cálculo do score: pontualidade de pagamentos, volume/frequência de transações e inadimplência (transações em atraso ou não pagas).

#### Scenario: Histórico com atrasos reduz o score
- **WHEN** duas listas de transações são idênticas exceto que uma contém transações marcadas como atrasadas/inadimplentes e a outra não
- **THEN** o score calculado para a lista com atrasos/inadimplência é menor que o score da lista sem atrasos

#### Scenario: Maior volume de transações pontuais aumenta o score
- **WHEN** duas listas de transações têm o mesmo padrão de pontualidade, mas uma tem significativamente mais transações pagas em dia que a outra
- **THEN** o score da lista com maior volume de transações pontuais é maior ou igual ao da lista com menor volume

### Requirement: Classificação em Faixa de Risco
O sistema SHALL classificar o score calculado em uma das faixas de risco: Muito Baixo, Baixo, Médio, Alto ou Muito Alto, e retornar essa classificação junto com o valor numérico do score.

#### Scenario: Classificação retornada junto com o score
- **WHEN** o caso de uso calcula um score para um usuário e seu histórico
- **THEN** o resultado inclui tanto o valor numérico do score (0-1000) quanto o nome da faixa de risco correspondente

### Requirement: Validação de Entrada
O sistema SHALL rejeitar a solicitação de cálculo de score quando os dados de entrada forem inválidos, sem retornar um score.

#### Scenario: Usuário ausente ou inválido
- **WHEN** o caso de uso é invocado sem um usuário válido (identificador ausente ou vazio)
- **THEN** o sistema rejeita a solicitação com um erro de validação e não retorna um score

#### Scenario: Lista de transações nula ou malformada
- **WHEN** o caso de uso é invocado com o histórico de transações ausente (`null`/`undefined`) ou contendo um item sem os campos obrigatórios
- **THEN** o sistema rejeita a solicitação com um erro de validação e não retorna um score

### Requirement: Endpoint HTTP de Revisão de Crédito
O sistema SHALL expor um endpoint `POST /credit-score` que recebe um usuário e seu histórico de transações no corpo da requisição e retorna o score e a faixa de risco calculados.

#### Scenario: Requisição válida retorna o score
- **WHEN** um cliente envia `POST /credit-score` com um usuário válido e histórico de transações válido no corpo
- **THEN** o sistema responde com HTTP 200 e um corpo JSON contendo o score numérico e a faixa de risco

#### Scenario: Requisição inválida retorna erro
- **WHEN** um cliente envia `POST /credit-score` com dados de usuário ou histórico de transações inválidos
- **THEN** o sistema responde com HTTP 400 e um corpo JSON de erro, sem calcular um score
