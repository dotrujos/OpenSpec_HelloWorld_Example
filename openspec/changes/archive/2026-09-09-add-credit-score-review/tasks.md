## 1. Tipos de Domínio

- [x] 1.1 Criar `src/types/credit-score.ts` com `User`, `Transaction` e `CreditScoreResult` (score, riskLevel) conforme design.md; verificar que `npx tsc --noEmit` compila sem erros

## 2. Validação de Entrada

- [x] 2.1 Implementar validação de `User` e `Transaction[]` (usuário com `id` não vazio, `transactions` array presente com campos obrigatórios e `status` válido em cada item), lançando `ApiError` com status 400 em caso de dados inválidos; verificar com testes unitários cobrindo usuário ausente/inválido e lista nula/malformada

## 3. Algoritmo de Scoring

- [x] 3.1 Implementar `src/services/credit-score.service.ts` com o cálculo de score (base 500, componentes de pontualidade, volume e inadimplência, clamp 0-1000) conforme design.md; verificar com teste unitário que histórico vazio retorna score dentro de 0-1000
- [x] 3.2 Implementar o componente de pontualidade e inadimplência; verificar com teste unitário que duas listas idênticas exceto por transações atrasadas/inadimplentes produzem score menor para a lista com atraso/inadimplência
- [x] 3.3 Implementar o componente de volume; verificar com teste unitário que maior volume de transações pontuais produz score maior ou igual ao de menor volume, mantendo o padrão de pontualidade constante
- [x] 3.4 Implementar a classificação em faixa de risco (Muito Alto/Alto/Médio/Baixo/Muito Baixo) a partir do score calculado; verificar com testes unitários cobrindo os limites de cada faixa

## 4. Endpoint HTTP

- [x] 4.1 Implementar `src/controllers/credit-score.controller.ts` chamando o service com os dados do corpo da requisição e retornando o score e a faixa de risco; verificar que uma chamada direta ao controller com dados válidos retorna HTTP 200 com o payload esperado
- [x] 4.2 Implementar `src/routes/credit-score.route.ts` com `POST /credit-score` e montar em `src/routes/index.ts`; verificar com `curl -X POST localhost:<port>/credit-score` (corpo válido) que a resposta é 200 com score e faixa de risco
- [x] 4.3 Verificar que requisição com corpo inválido em `POST /credit-score` retorna HTTP 400 com corpo de erro JSON, sem calcular score, reutilizando o middleware de erro centralizado existente

## 5. Verificação Final

- [x] 5.1 Rodar `npm run build` e `npm run lint`; verificar que ambos completam sem erros
- [x] 5.2 Rodar a suíte de testes unitários do service e confirmar que todos os cenários da spec `credit-score-review` estão cobertos e passando
