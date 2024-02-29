import express from "express";
import { createClient } from "redis";

export const LIST_KEY = "messages";

export type RedisClientType = ReturnType<typeof createClient>;

export const createApp = (client: RedisClientType) => {
  const app = express();

  app.use(express.json());

  function fibonacci(n: number): number {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
  }

  app.get("/fibonacci/:n", (req, res) => {
    const n = parseInt(req.params.n, 10);
    const result = fibonacci(n);
    res.send(`Fibonacci(${n}) = ${result}`);
  });

  app.get("/", (request, response) => {
    response.status(200).send("hello from exprress, deployed on AWS LightSail");
  });

  app.post("/messages", async (request, response) => {
    const { message } = request.body;
    await client.lPush(LIST_KEY, message);
    response.status(200).send("Message added to List");
  });
  app.get("/messages", async (request, response) => {
    const messages = await client.lRange(LIST_KEY, 0, -1);
    response.status(200).send(messages);
  });

  return app;
};
