import request from "supertest";
import { app } from "../../app";

it("fail when a email that does not exist is supplied", async () => {
  process.env.JWT_KEY = "adsf";
  await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "password123",
    })
    .expect(400);
});

// it("fail when an incorrect password is supplied", async () => {
//   process.env.JWT_KEY = "adsf";
//   await request(app)
//     .post("/api/users/signup")
//     .send({
//       email: "test@test.com",
//       password: "password33",
//     })
//     .expect(201);

//   await request(app)
//     .post("/api/users/signin")
//     .send({
//       email: "test@test.com",
//       password: "password123",
//     })
//     .expect(400);
// });








// it("respond with a cookie when given valid credentials", async () => {
//   process.env.JWT_KEY = "adsf";
//   await request(app)
//     .post("/api/users/signup")
//     .send({
//       email: "testpp@test.com",
//       password: "password1",
//     })
//     .expect(201);

//   const res = await request(app)
//     .post("/api/users/signin")
//     .send({
//       email: "testpp@test.com",
//       password: "password1",
//     })
//     .expect(200);
//   expect(res.get("Set-Cookie")).toBeDefined();
// });
