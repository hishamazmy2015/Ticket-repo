import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";

it("returns a 404 if tickets is not found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).get(`/api/tickets/${id}`).send().expect(404);
});

it("returns the ticket if the ticket is found", async () => {
  const res = await request(app)
    .post("/api/tickets")
    .send({
      title: "fdkfk",
      price: 20,
    })
    .set("Cookie", global.signin())
    .expect(201);
  await request(app).get(`/api/tickets/${res.body.id}`).send().expect(200);
});
