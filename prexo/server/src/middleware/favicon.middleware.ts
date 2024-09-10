import type { Request, Response, NextFunction } from "express";

export function handleFaviconRequest(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.originalUrl === "/favicon.ico" || req.originalUrl === "/favicon.png")
    res.status(204).end();
  else next();
}
