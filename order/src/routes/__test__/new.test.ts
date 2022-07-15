// import {body} from 'express-validator';
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Order, OrderStatus } from "../../models/order";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";

it("return error if ticket are not existing ", async () => {
  const ticketId = new mongoose.Types.ObjectId();
  await request(app)
    .post("/api/orders")
    .send({ ticketId })
    .set("Cookie", global.signin())
    .expect(404);
});

it("Fail if Ticket is already reserved ", async () => {
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
    id: new mongoose.Types.ObjectId().toHexString(),

  });
  await ticket.save();

  const order = Order.build({
    ticket,
    userId: "reqdknfd",
    status: OrderStatus.Created,
    expireAt: new Date(),
  });
  await order.save();
  console.log("================ ", ticket.id);
  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it("Reserive a ticket ", async () => {
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
    id: new mongoose.Types.ObjectId().toHexString(),

  });
  await ticket.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);
});

it("emits an order created event", async () => {
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
    id: new mongoose.Types.ObjectId().toHexString(),

  });
  await ticket.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
