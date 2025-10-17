import express from "express";
import * as bodyParser from "body-parser";
import { CORS } from "./middlewares/CORS";
import { router as apiRouter } from "./api-router";

import { mongo } from "./middlewares/mongodb";

const app = express();
app.disable("x-powered-by");

app.use(CORS);

app.use(mongo());

app.use(bodyParser.json());

app.use(process.env.URL_PREFIX || "/api", apiRouter);

app.use((req, res) => {
  console.warn(JSON.stringify({ type: "http_error_404", url: req.url }));
  res.status(404).send({});
});

app.use((error: any, req: any, res: any, _next: any) => {
  console.error(JSON.stringify({ type: "http_error_500", error: error.message, url: req.url }));
  return res.status(500).send({ error: error.message ? error.message : error });
});

export { app };
