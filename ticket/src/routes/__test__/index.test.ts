import request from "supertest";
import { app } from "../../app";

const createTicekts = () => {
  return request(app).post("/api/tickets").set("Cookie", global.signin()).send({
    title: "fdkfk",
    price: 20,
  });
};
it(" can fetch a list of tickets", async () => {
  await createTicekts();
  await createTicekts();
  await createTicekts();

  const res = await request(app).get("/api/tickets").send().expect(200);
  expect(res.body.length).toEqual(3);
});
