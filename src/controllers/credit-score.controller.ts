import { Request, Response } from "express";
import { calculateCreditScore } from "../services/credit-score.service";
import { CreditScoreRequestBody, CreditScoreResult } from "../types/credit-score";

export function postCreditScore(
  req: Request<Record<string, never>, CreditScoreResult, CreditScoreRequestBody>,
  res: Response<CreditScoreResult>
): void {
  const { user, transactions } = req.body;
  const result = calculateCreditScore(user, transactions);
  res.status(200).json(result);
}
