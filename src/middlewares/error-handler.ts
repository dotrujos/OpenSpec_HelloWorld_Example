import { NextFunction, Request, Response } from "express";
import { ApiError } from "../types/api-error";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const status = err instanceof ApiError ? err.status : 500;
  res.status(status).json({ error: { message: err.message } });
}
