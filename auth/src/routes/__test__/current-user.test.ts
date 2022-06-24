import request from "supertest";
import { app } from "../../app";
beforeEach((): void => {
  jest.useFakeTimers("legacy");
  // jest.setTimeout(60000);
  // p = new SUT.PlaywrightFluent();
});
it("clears the cookie after signing out ", async () => {
  // process.env.JWT_KEY = "adsf";
  const cookie = await global.singUp();
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password123",
    })
    .expect(201);

  const res = await request(app)
    .post("/api/users/currentusers")
    .send({})
    .expect(200);
  console.log(res.get("Set-Cookie"));
});

it("Response with null if not authenticated", async () => {
  const res = await request(app)
    .post("/api/users/currentusers")
    .send()
    .expect(200);
  // console.log(res.get("Set-Cookie"));
});
