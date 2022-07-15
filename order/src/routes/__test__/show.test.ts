// import {body} from 'express-validator';
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";

it("return error if ticket are not existing ", async () => {
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
    id: new mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();
  const user = global.signin();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id });

  await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(200);
});

it("return error if one user tries to fetch another users order ", async () => {
  const ticket = Ticket.build({
    // version: "1",
    title: "concert",
    price: 20,
    id: new mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();

  // make a request to build an order with this ticket
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id });

  await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", global.signin())
    .send()
    .expect(401);
});
