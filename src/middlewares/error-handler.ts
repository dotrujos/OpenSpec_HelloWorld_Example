import { NextFunction, Request, Response } from "express";
import { ApiError } from "../types/api-error";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const status = err instanceof ApiError ? err.status : 500;
  const message = err instanceof Error ? err.message : "Internal Server Error";
  res.status(status).json({ error: { message } });
}
