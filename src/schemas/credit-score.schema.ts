import { z } from "zod";

export const userSchema = z.object({
  id: z.string().trim().min(1, "id is required"),
  name: z.string(),
});

export const transactionStatusSchema = z.enum(["paid", "late", "unpaid"]);

export const transactionSchema = z.object({
  id: z.string().trim().min(1, "id is required"),
  amount: z.number(),
  dueDate: z.string().trim().min(1, "dueDate is required"),
  paidDate: z.string().optional(),
  status: transactionStatusSchema,
});

export const transactionsSchema = z.array(transactionSchema);

export type User = z.infer<typeof userSchema>;
export type TransactionStatus = z.infer<typeof transactionStatusSchema>;
export type Transaction = z.infer<typeof transactionSchema>;
