export type { User, Transaction, TransactionStatus } from "../schemas/credit-score.schema";

export type RiskLevel = "Muito Alto" | "Alto" | "Médio" | "Baixo" | "Muito Baixo";

export interface CreditScoreResult {
  score: number;
  riskLevel: RiskLevel;
}

export interface RawUser {
  id?: string;
  name?: string;
}

export interface RawTransaction {
  id?: string;
  amount?: number;
  dueDate?: string;
  paidDate?: string;
  status?: string;
}

export interface CreditScoreRequestBody {
  user?: RawUser | null;
  transactions?: RawTransaction[] | null;
}
