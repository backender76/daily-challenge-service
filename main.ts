import { createServer } from "node:http";
import { app } from "./src/expressApp";
import { once } from "./src/utils/once";
import { close } from "./src/middlewares/mongodb";

const server = createServer(app);
const port = process.env.WEB_SERVER_PORT;
server.listen(port);
console.log(`server listen on ${port}`);

const shutdown = once(async (...args: any) => {
  console.log("Shutting down...", args);
  await close();
  setTimeout(() => process.exit(0), 100);
});

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
