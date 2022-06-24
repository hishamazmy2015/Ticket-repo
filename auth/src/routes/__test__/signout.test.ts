import request from "supertest";
import { app } from "../../app";

beforeAll(() => {
  process.env.JWT_KEY = "adsf";
});
beforeEach((): void => {
  jest.useFakeTimers("legacy");
  // jest.setTimeout(60000);
  // p = new SUT.PlaywrightFluent();
});

it("clears the cookie after signing out ", async () => {
  process.env.JWT_KEY = "adsf";
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password123",
    })
    .expect(201);

  const res = await request(app)
    .post("/api/users/signout")
    .send({})
    .expect(200);
  console.log(res.get("Set-Cookie"));
});
