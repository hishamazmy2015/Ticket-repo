import mongoose from "mongoose";
import { app } from "../app";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import jwt from "jsonwebtoken";
let mongo: any;

declare global {
  function singUp(): Promise<string[]>;
  // function signin(): string;
  // function signin(): string[];
  // function signin(): Promise<string[]>;
  // function signin(): Promise<string>;
  function signin(): string[];
}
// all tests use mock of nats wrapper before tests
jest.mock('../nats-wrapper');

beforeAll(async () => {
  process.env.JWT_KEY = "adsf";
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

global.signin = () => {
  // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyYjkyYjYxNzBjYTM2NTgxZTFlYjBmOSIsImVtYWlsIjoiaGlkaGZpaGlAZ21haWwuY29tIiwiaWF0IjoxNjU2MzAyNDMzfQ.74GyFm5_cSLnNnS-pm9LdKUIjR9U_nOOno_PcVd1e2U

  //Build a JWT payload {id, email}
  const payload = {
    // id: "1L1234k56",
    id: new mongoose.Types.ObjectId().toHexString(),
    email: "test1234@gmail.com",
  };

  // Create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  const sessino = { jwt: token };

  // Build session OBject {jwt: MY_JWT}
  // const tt =
  //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyYjkyYjYxNzBjYTM2NTgxZTFlYjBmOSIsImVtYWlsIjoiaGlkaGZpaGlAZ21haWwuY29tIiwiaWF0IjoxNjU2MzAyNDMzfQ.74GyFm5_cSLnNnS-pm9LdKUIjR9U_nOOno_PcVd1e2U";
  // const sessino = { jwt: tt };

  //Turn that session into JSON
  const sessionJSON = JSON.stringify(sessino);

  //Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString("base64");

  //return a string thats the cookie with the encoded data
  // return [`session=${base64}`];
  return [`session=${base64}`];
  // return [`express:sess=${base64}`];
  // return [`express:sess=${base64}`];
  // return "session=eyJqd3QiOiJleUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKcFpDSTZJall5WWprME1UZ3lOekJqWVRNMk5UZ3haVEZsWWpCbVl5SXNJbVZ0WVdsc0lqb2lkR1Z6ZEdWM1FHZHRZV2xzTG1OdmJTSXNJbWxoZENJNk1UWTFOak13T0RBNU9IMC5TMWJHYWhvYWU5aWNWZGNIaG9LRGdJWm9NcE1QOUdpMk1maGVyS1BQRnJRIn0=";
  // return [
  //   `session=eyJqd3QiOiJleUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKcFpDSTZJall5WWprMFkyVXlNMkkyTlROaU5HTTRORFkyWmpGaE9DSXNJbVZ0WVdsc0lqb2lhbTVxWkVCbmJXRnBiQzVqYjIwaUxDSnBZWFFpT2pFMk5UWXpNVEV3TVRCOS5ZQkI0YmtqSTczU3VraDVlZEhWWWU2MWlqOUFMOWZWSWxHOUlWY3UyZDVrIn0="`,
  // ];
};
