import {
  ExpirationCompleteEvent,
  OrderCancelledEvent,
  OrderStatus,
} from "@haticket/common20";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/order";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledPublisher } from "../../publisher/order-cancelled-publisher";
import { ExpirationCompleteListener } from "../expiration-complete-listener";

const setup = async () => {
  //create an instance of the listener
  const listner = new ExpirationCompleteListener(natsWrapper.client);

  const ticket = await Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "string",
    price: 10,
  });
  await ticket.save();
  //create a fake data event
  const order = Order.build({
    userId: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    expireAt: new Date(),
    ticket,
  });
  await order.save();

  const data: ExpirationCompleteEvent["data"] = {
    orderId: order.id,
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { msg, data, listner };
};

it("Update the order status to cancelled", async () => {
  const { msg, data, listner } = await setup();

  await listner.onMessage(data, msg);
  const order = await Order.findById(data.orderId);
  expect(order?.status).toBe(OrderStatus.Cancelled);
});

it("emit an OrderCancelled event ", async () => {
  const { msg, data, listner } = await setup();
  await listner.onMessage(data, msg);
  const order = await Order.findById(data.orderId);
  // @ts-ignore
  const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock
    .calls[0][1]);
    console.log("  =========== eventData eventData  =========== ",eventData)
  expect(eventData.id).toEqual(order!.id);
});

it("ack the message", async () => {
  const { msg, data, listner } = await setup();
  await listner.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});
