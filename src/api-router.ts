import express from "express";
import { rules, validate } from "./utils/validate";
import * as middlewares from "../src/middlewares";
import * as controllers from "../src/controllers";

const { NOT_EMPTY_STRING } = rules;

const router = express.Router();

router.use("/:method/:app", middlewares.checkSig);

router.use("/:method/:app", validate("headers", { authorization: NOT_EMPTY_STRING }), middlewares.jwt);

router.post(
  "/daily-challenge/:app",
  validate("body", {
    year: [["required"], ["number"]],
    month: [["required"], ["number"]],
    day: [["required"], ["number"]],
    progress: [["required"], ["number"]],
    state: [["required"], ["string"]],
  }),
  controllers.dailyChallenge.save
);

router.get(
  "/daily-challenge/:app",
  validate("query", { year: [["required"], ["digits"]], month: [["required"], ["digits"]], day: [["digits"]] }),
  controllers.dailyChallenge.get
);

export { router };
