import supertest from "supertest";
import { App } from "supertest/types";
import { LIST_KEY, RedisClientType, createApp } from "./app";
import * as redis from "redis";

let app: App;
let client: RedisClientType;

const REDIS_URL = "redis://:abcd1234@127.0.0.1:6379";

beforeAll(async () => {
  client = redis.createClient({
    url: REDIS_URL,
  });
  await client.connect();
  app = createApp(client);
});

beforeEach(async () => {
  await client.flushDb();
});

afterAll(async () => {
  await client.flushDb();
  await client.quit();
});

describe("POST /messages", () => {
  it("response with a success message", async () => {
    const response = await supertest(app).post("/messages").send({
      message: "test redis",
    });

    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("Message added to List");
  });
});

describe("GET /messages", () => {
  it("response with all messages", async () => {
    await client.lPush(LIST_KEY, ["msg1", "msg2"]);
    const response = await supertest(app).get("/messages");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(["msg2", "msg1"]);
  });
});
