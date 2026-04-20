import type { Request, Response, NextFunction } from "express";
import { UniqueConstraintError, ValidationError } from "sequelize";

interface HttpError extends Error {
  status?: number;
}

export const errorHandler = (
  err: HttpError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof UniqueConstraintError) {
    return res.status(409).json({ error: "A record with that value already exists." });
  }

  if (err instanceof ValidationError) {
    return res.status(400).json({ errors: err.errors.map((e) => e.message) });
  }

  if (err.status) {
    return res.status(err.status).json({ error: err.message });
  }

  console.error(err);
  return res.status(500).json({ error: "Internal server error" });
};
