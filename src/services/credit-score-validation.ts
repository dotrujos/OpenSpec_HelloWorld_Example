import { ZodError } from "zod";
import { ApiError } from "../types/api-error";
import { transactionsSchema, userSchema } from "../schemas/credit-score.schema";
import { RawTransaction, RawUser, Transaction, User } from "../types/credit-score";

function describeIssues(error: ZodError): string {
  return error.issues
    .map((issue) => `${issue.path.length > 0 ? issue.path.join(".") : "value"} - ${issue.message}`)
    .join("; ");
}

export function validateUser(user: RawUser | null | undefined): User {
  const result = userSchema.safeParse(user);
  if (!result.success) {
    throw new ApiError(400, `Invalid user: ${describeIssues(result.error)}`);
  }
  return result.data;
}

export function validateTransactions(
  transactions: RawTransaction[] | null | undefined
): Transaction[] {
  const result = transactionsSchema.safeParse(transactions);
  if (!result.success) {
    throw new ApiError(400, `Invalid transactions: ${describeIssues(result.error)}`);
  }
  return result.data;
}
