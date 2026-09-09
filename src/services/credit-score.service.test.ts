import { describe, expect, it } from "vitest";
import { calculateCreditScore } from "./credit-score.service";
import { Transaction, User } from "../types/credit-score";
import { ApiError } from "../types/api-error";

const user: User = { id: "u1", name: "Ana" };

function paidOnTime(id: string): Transaction {
  return {
    id,
    amount: 100,
    dueDate: "2024-01-10",
    paidDate: "2024-01-10",
    status: "paid",
  };
}

function late(id: string): Transaction {
  return { id, amount: 100, dueDate: "2024-01-10", status: "late" };
}

function unpaid(id: string): Transaction {
  return { id, amount: 100, dueDate: "2024-01-10", status: "unpaid" };
}

describe("calculateCreditScore", () => {
  it("returns a score within 0-1000 for an empty transaction history", () => {
    const result = calculateCreditScore(user, []);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(1000);
  });

  it("returns a score within 0-1000 for a valid history", () => {
    const result = calculateCreditScore(user, [paidOnTime("t1"), paidOnTime("t2")]);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(1000);
  });

  it("gives a lower score to a history with late/delinquent transactions", () => {
    const withoutDelinquency = [paidOnTime("t1"), paidOnTime("t2"), paidOnTime("t3")];
    const withDelinquency = [paidOnTime("t1"), paidOnTime("t2"), late("t3")];

    const scoreWithout = calculateCreditScore(user, withoutDelinquency).score;
    const scoreWith = calculateCreditScore(user, withDelinquency).score;

    expect(scoreWith).toBeLessThan(scoreWithout);
  });

  it("gives a lower score to a history with unpaid transactions than a fully paid one", () => {
    const fullyPaid = [paidOnTime("t1"), paidOnTime("t2")];
    const withUnpaid = [paidOnTime("t1"), unpaid("t2")];

    const scorePaid = calculateCreditScore(user, fullyPaid).score;
    const scoreUnpaid = calculateCreditScore(user, withUnpaid).score;

    expect(scoreUnpaid).toBeLessThan(scorePaid);
  });

  it("gives a higher-or-equal score to a larger volume of on-time transactions with the same punctuality pattern", () => {
    const lowVolume = [paidOnTime("t1"), paidOnTime("t2")];
    const highVolume = [
      paidOnTime("t1"),
      paidOnTime("t2"),
      paidOnTime("t3"),
      paidOnTime("t4"),
      paidOnTime("t5"),
    ];

    const scoreLow = calculateCreditScore(user, lowVolume).score;
    const scoreHigh = calculateCreditScore(user, highVolume).score;

    expect(scoreHigh).toBeGreaterThanOrEqual(scoreLow);
  });

  it("classifies the score into the correct risk level boundaries", () => {
    expect(calculateCreditScore(user, []).riskLevel).toBe("Alto");

    const excellentHistory = Array.from({ length: 15 }, (_, i) => paidOnTime(`t${i}`));
    const excellentResult = calculateCreditScore(user, excellentHistory);
    expect(excellentResult.score).toBeGreaterThan(700);
    expect(["Baixo", "Muito Baixo"]).toContain(excellentResult.riskLevel);

    const terribleHistory = [unpaid("t1"), unpaid("t2"), unpaid("t3")];
    const terribleResult = calculateCreditScore(user, terribleHistory);
    expect(["Muito Alto", "Alto"]).toContain(terribleResult.riskLevel);
  });

  it("rejects an invalid user without returning a score", () => {
    expect(() => calculateCreditScore({ id: "" }, [])).toThrow(ApiError);
  });

  it("rejects a malformed transaction list without returning a score", () => {
    expect(() => calculateCreditScore(user, null)).toThrow(ApiError);
  });
});
