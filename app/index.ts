import dotevn from "dotenv";
dotevn.config();
import * as redis from "redis";
import { createApp } from "./app";
const { PORT, REDIS_URL } = process.env;
if (!PORT) throw new Error("PORT is required");
if (!REDIS_URL) throw new Error("REDIS_URL is required");

const startServer = async () => {
  console.log("Trying to start Server");
  const client = redis.createClient({
    url: REDIS_URL,
  });
  await client.connect();

  const app = createApp(client);
  const server = app.listen(PORT, () => {
    console.log(`${PORT} app lisenting new version`);
  });

  return server;
};

const server = startServer();

const gracefullShutdown = async () => {
  const _server = await server;
  _server.close(() => {
    // DB 커넥션 종료등을 해 주면 됨.
    console.log("gracefull shutdown!");
    process.exit();
  });
};

process.on("SIGTERM", () => gracefullShutdown);

process.on("SIGINT", gracefullShutdown);
