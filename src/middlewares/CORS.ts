import type { Request, Response, NextFunction } from "express";

export const CORS = (req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers && req.headers["origin"] ? req.headers["origin"] : undefined;

  res.setHeader("Access-Control-Allow-Origin", origin ? origin : "*");

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
