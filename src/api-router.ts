import express from "express";
import { rules, validate } from "./utils/validate";
import * as middlewares from "../src/middlewares";
import * as controllers from "../src/controllers";

const { NOT_EMPTY_STRING } = rules;

const router = express.Router();

router.use("/:method/:app", middlewares.checkSig);

router.use("/:method/:app", validate("headers", { authorization: NOT_EMPTY_STRING }), middlewares.jwt);

router.post(
  "/score/:app",
  validate("body", { score: [["required"], ["number"], ["min", 0]], id: [["required"]] }),
  controllers.score.setScore
);

router.get("/leaders/:app", validate("query", { id: [["required"]] }), controllers.score.leaders);

export { router };
