import type { NextFunction, Request, Response } from "express";
import jsonwebtoken from "jsonwebtoken";
import { ApiReq } from "../types";

export const jwt = (req: Request, _res: Response, next: NextFunction) => {
  const [, authToken] = req.headers.authorization!.split(/ +/);
  const jwt = jsonwebtoken.verify(authToken, process.env.JWT_SECRET || "") as AuthTokenPayload;
  (req as ApiReq).jwt = jwt;

  if (req.params.app === jwt.app) {
    next();
  } else {
    next(new Error(`Wrong app name: "${jwt.app}" != "${req.params.app}"!`));
  }
};
