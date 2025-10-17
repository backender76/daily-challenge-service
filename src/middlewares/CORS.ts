import type { Request, Response, NextFunction } from "express";

export const CORS = (req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, X-Signature"
  );

  res.setHeader("Access-Control-Allow-Methods", "*");

  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.end();
  }
  next();
};
