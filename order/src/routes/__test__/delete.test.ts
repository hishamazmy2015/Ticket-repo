// import {body} from 'express-validator';
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Order, OrderStatus } from "../../models/order";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";

it("return error if ticket are not existing ", async () => {
  const ticketId = new mongoose.Types.ObjectId();
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
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(204);

  const updateOrder = await Order.findById(order.id);
  expect(updateOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("emit a order cancelled event", async () => {
  const ticketId = new mongoose.Types.ObjectId();
  const ticket = Ticket.build({
    title: "concert",
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 20,
  });
  await ticket.save();
  const user = global.signin();
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id });

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
