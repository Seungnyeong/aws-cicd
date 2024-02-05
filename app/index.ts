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
  app.listen(PORT, () => {
    console.log(`${PORT} app lisenting`);
  });
};

startServer();
