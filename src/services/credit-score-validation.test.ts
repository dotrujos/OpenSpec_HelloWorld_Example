import { describe, expect, it } from "vitest";
import { validateTransactions, validateUser } from "./credit-score-validation";
import { ApiError } from "../types/api-error";

describe("validateUser", () => {
  it("rejects a missing user", () => {
    expect(() => validateUser(undefined)).toThrow(ApiError);
  });

  it("rejects a user with an empty id", () => {
    expect(() => validateUser({ id: "", name: "Ana" })).toThrow(ApiError);
  });

  it("accepts a valid user", () => {
    expect(() => validateUser({ id: "u1", name: "Ana" })).not.toThrow();
  });
});

describe("validateTransactions", () => {
  it("rejects a null transactions list", () => {
    expect(() => validateTransactions(null)).toThrow(ApiError);
  });

  it("rejects an undefined transactions list", () => {
    expect(() => validateTransactions(undefined)).toThrow(ApiError);
  });

  it("rejects a transaction missing required fields", () => {
    expect(() =>
      validateTransactions([{ id: "t1", amount: 100, status: "paid" }])
    ).toThrow(ApiError);
  });

  it("rejects a transaction with an invalid status", () => {
    expect(() =>
      validateTransactions([
        { id: "t1", amount: 100, dueDate: "2024-01-01", status: "invalid" },
      ])
    ).toThrow(ApiError);
  });

  it("accepts an empty transactions list", () => {
    expect(() => validateTransactions([])).not.toThrow();
  });

  it("accepts a well-formed transactions list", () => {
    expect(() =>
      validateTransactions([
        { id: "t1", amount: 100, dueDate: "2024-01-01", status: "paid" },
      ])
    ).not.toThrow();
  });
});
