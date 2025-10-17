import type { NextFunction, Request, Response } from "express";
import type { ApiReq } from "./../types";
import { calcSig } from "./../utils/calcSig";

export const checkSig = async (req: Request, res: Response, next: NextFunction) => {
  const { mongo } = req as ApiReq;

  const app = await mongo.applications().findOne({ name: req.params.app });

  if (!app) {
    return res.status(403).send({ code: "APP" });
  }
  const payload = req.method === "POST" ? req.body : req.query;

  if (!payload || !payload.sig || payload.sig !== calcSig(payload, app.secret)) {
    return res.status(403).send({ code: "SIG" });
  }
  next();
};
