import {
  CreditScoreResult,
  RawTransaction,
  RawUser,
  RiskLevel,
  Transaction,
} from "../types/credit-score";
import { validateTransactions, validateUser } from "./credit-score-validation";

const BASE_SCORE = 500;
const MIN_SCORE = 0;
const MAX_SCORE = 1000;

const PUNCTUALITY_WEIGHT = 300;
const DELINQUENCY_WEIGHT = 350;
const VOLUME_WEIGHT_PER_TRANSACTION = 10;
const VOLUME_CAP = 15;

function isConcluded(transaction: Transaction): boolean {
  return transaction.status === "paid" || transaction.status === "late";
}

function isOnTime(transaction: Transaction): boolean {
  if (transaction.status !== "paid" || !transaction.paidDate) return false;
  return transaction.paidDate <= transaction.dueDate;
}

function isDelinquent(transaction: Transaction): boolean {
  return transaction.status === "unpaid" || transaction.status === "late";
}

function punctualityComponent(transactions: Transaction[]): number {
  const concluded = transactions.filter(isConcluded);
  if (concluded.length === 0) return 0;

  const onTime = concluded.filter(isOnTime).length;
  const ratio = onTime / concluded.length;
  return ratio * PUNCTUALITY_WEIGHT;
}

function delinquencyComponent(transactions: Transaction[]): number {
  if (transactions.length === 0) return 0;

  const delinquent = transactions.filter(isDelinquent).length;
  const ratio = delinquent / transactions.length;
  return -(ratio * DELINQUENCY_WEIGHT);
}

function volumeComponent(transactions: Transaction[]): number {
  const onTimeCount = transactions.filter(isOnTime).length;
  const cappedCount = Math.min(onTimeCount, VOLUME_CAP);
  return cappedCount * VOLUME_WEIGHT_PER_TRANSACTION;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function classifyRisk(score: number): RiskLevel {
  if (score <= 300) return "Muito Alto";
  if (score <= 500) return "Alto";
  if (score <= 700) return "Médio";
  if (score <= 850) return "Baixo";
  return "Muito Baixo";
}

export function calculateCreditScore(
  user: RawUser | null,
  transactions: RawTransaction[] | null
): CreditScoreResult {
  validateUser(user);
  const validTransactions = validateTransactions(transactions);

  const rawScore =
    BASE_SCORE +
    punctualityComponent(validTransactions) +
    delinquencyComponent(validTransactions) +
    volumeComponent(validTransactions);

  const score = Math.round(clamp(rawScore, MIN_SCORE, MAX_SCORE));

  return {
    score,
    riskLevel: classifyRisk(score),
  };
}
