import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { natsWrapper } from "../../nats-wrapper";

const createTicekts = () => {
  return request(app).post("/api/tickets").set("Cookie", global.signin()).send({
    title: "fdkfk",
    price: 20,
  });
};
it("returns 404 if the proivder id does not exist", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", global.signin())
    .send({ title: "asddd", price: 20 })
    .expect(404);
});
it("returns 401 if the user is not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({ title: "asddd", price: 20 })
    .expect(401);
});
it("returns 401 if the user does not own the ticket", async () => {
  const res = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "fefefe",
      price: 10,
    });

  //   const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set("Cookie", global.signin())
    .send({ title: "asddddd", price: 20 })
    .expect(401);
});
it("returns 400 if the user provides an invalid title or price", async () => {
  const cookie = global.signin();
  const res = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "fefefe",
      price: 10,
    });
  //   const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "asddddd", price: -20 })
    .expect(400);
});

it("Update the ticket provided valid inputs", async () => {
  const cookie = global.signin();

  const res = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "fefefe",
      price: 10,
    });

  const ticketRes = await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "asddddd", price: 20 });

  expect(ticketRes.body.title).toEqual("asddddd");
  expect(ticketRes.body.price).toEqual(20);
});

it("publish an event", async () => {
  const cookie = global.signin();

  const res = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "fefefe",
      price: 10,
    });

  const ticketRes = await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "asddddd", price: 20 });
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
