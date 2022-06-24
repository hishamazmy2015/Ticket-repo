import request from "supertest";
import { app } from "../../app";

beforeEach((): void => {
  jest.useFakeTimers("legacy");
  // jest.setTimeout(60000);
  // p = new SUT.PlaywrightFluent();
});

it("returns a 201 on successful signup ", async () => {
  process.env.JWT_KEY = "adsf";
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);
});

// it("returns a 400 with an invalid email", async () => {
//   return request(app)
//     .post("/api/users/signup")
//     .send({
//       email: "test@test",
//       password: "password",
//     })
//     .expect(400);
// });

// it("returns a 400 with an invalid email", async () => {
//   return request(app).post("/api/users/signup").send({}).expect(400);
//   // jest.setTimeout(10 * 1000);
// });

// it("disallows duplicate emails ", async () => {
//   await request(app)
//     .post("/api/users/signup")
//     .send({
//       email: "test@test.com",
//       password: "password",
//     })
//     .expect(201);

//   await request(app)
//     .post("/api/users/signup")
//     .send({
//       email: "test@test.com",
//       password: "password",
//     })
//     .expect(400);
// });

// it("sets a cookie after successful signup", async () => {
//   process.env.NODE_EVN = "test";

//   const response = await request(app)
//     .post("/api/users/signup")
//     .send({
//       email: "testw@test.com",
//       password: "password",
//     })
//     .expect(201);
//   expect(response.get("Set-Cookie")).toBeDefined();
// });
