import mongoose from "mongoose";
import { app } from "../app";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
let mongo: any;

// declare global {
//   namespace NodeJS {
//     interface Global {
//       singUp(): Promise<string[]>;
//     }
//   }
// }
declare global {
  function singUp(): Promise<string[]>;
}

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    //   useUnifiedToplology: true,
    //   useNewUrlParser: true,
  });
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.singUp = async () => {
  const email = "test@test.com";
  const password = "password";

  const res = await request(app)
    .post("/api/users/signup")
    .send({ email, password })
    .expect(201);
  const cookie = res.get("Set-Cookie");
  return cookie;
};
