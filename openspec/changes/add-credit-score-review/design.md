## Context

Ver proposal.md - Why. A API atualmente só tem a capability `api-foundation` (bootstrap Express, rotas, erros). Não existe modelo de domínio para usuário ou transação ainda — esta change os introduz apenas como tipos de entrada do caso de uso, sem persistência.

## Goals / Non-Goals

**Goals:**
- Definir um algoritmo de scoring determinístico e testável (mesma entrada → mesma saída), que produza um score 0-1000 e uma faixa de risco.
- Manter o caso de uso desacoplado de qualquer fonte de dados: ele recebe `User` e `Transaction[]` já carregados.
- Seguir a arquitetura em camadas já estabelecida (route → controller → service).

**Non-Goals:**
- Não implementar persistência, repositório ou integração com bureau de crédito real.
- Não implementar autenticação/autorização no endpoint.
- Não calibrar o algoritmo com dados reais — os pesos são um modelo inicial razoável, não um modelo estatístico validado.

## Decisions

**Modelo de dados de entrada**
```ts
interface User {
  id: string;
  name: string;
}

interface Transaction {
  id: string;
  amount: number;
  dueDate: string;   // ISO date
  paidDate?: string; // ISO date, ausente = não paga
  status: "paid" | "late" | "unpaid";
}
```
Racional: campos mínimos necessários para calcular pontualidade (comparar `dueDate` vs `paidDate`), volume (contagem/soma de `amount`) e inadimplência (`status`). Evita modelar um domínio de transação bancária completo, que está fora do escopo.

**Algoritmo de scoring**: pontuação base de 500 (ponto médio da faixa 0-1000), ajustada por três componentes independentes, depois limitada (`clamp`) a [0, 1000]:
1. *Pontualidade*: proporção de transações pagas em dia (`status === "paid"` e `paidDate <= dueDate`) sobre o total de transações concluídas — contribui até ±300 pontos.
2. *Volume*: número de transações pontuais, com retornos decrescentes (ex.: `min(volume, cap) * pesoPorTransacao`) — contribui até +150 pontos, nunca negativo (volume baixo não penaliza, apenas deixa de bonificar).
3. *Inadimplência*: proporção de transações com `status === "unpaid"` ou atrasadas (`status === "late"`) sobre o total — penalidade de até −350 pontos, com peso maior que a pontualidade porque inadimplência ativa é o sinal de risco mais forte no scoring estilo Serasa.

Alternativa considerada: modelo de pesos únicos sobre todas as transações somadas (soma ponderada simples). Rejeitada por ser mais difícil de explicar/testar por cenário (a spec exige comportamento comparativo isolado por fator — ver `credit-score-review` spec, requisito "Fatores de Cálculo do Score`), enquanto o modelo por componentes permite testar cada fator isoladamente.

**Faixas de risco** (score → faixa), alinhado ao modelo público do Serasa Score:
- 0–300: Muito Alto (risco)
- 301–500: Alto
- 501–700: Médio
- 701–850: Baixo
- 851–1000: Muito Baixo

**Validação de entrada**: validação síncrona no início do caso de uso (usuário com `id` não vazio; `transactions` é array, presente — pode ser vazio —, e cada item com os campos obrigatórios e `status` em um dos valores permitidos). Erros de validação lançam uma `ApiError` (já existente em `src/types/api-error.ts`) com status 400, reaproveitando o middleware de erro centralizado de `api-foundation` — nenhum novo mecanismo de erro é criado.

**Camadas**: `src/services/credit-score.service.ts` (algoritmo puro, sem dependência do Express) → `src/controllers/credit-score.controller.ts` (parse do body, chama o service, monta resposta) → `src/routes/credit-score.route.ts` (`POST /credit-score`, montada em `src/routes/index.ts`). Segue exatamente o padrão de `health` já existente na capability `api-foundation`.

## Risks / Trade-offs

- [Pesos do algoritmo são arbitrários, sem calibração estatística] → Mitigado documentando-os explicitamente neste design; ajuste futuro é isolado ao service, sem mudar a interface pública do caso de uso ou o contrato HTTP.
- [Ausência de histórico (lista vazia) resulta em score neutro (~500), o que pode não refletir política de negócio real para "sem histórico"] → Aceito para esta versão; a spec exige apenas que o score permaneça na faixa 0-1000 nesse caso, não um valor de negócio específico.
