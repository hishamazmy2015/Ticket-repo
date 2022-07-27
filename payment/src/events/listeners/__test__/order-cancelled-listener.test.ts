import {
  OrderCancelledEvent,
  OrderCreatedEvent,
  OrderStatus,
} from "@haticket/common20";
import mongoose from "mongoose";
import { Order } from "../../../models/order";
import { natsWrapper } from "../../../nats-wrapper";
import { orderCancelledListener } from "../order-cancelled-listener";
import { orderCreatedListener } from "./../order-created-listener";

const setup = async () => {
  // const order = await Ord
  const listener = new orderCancelledListener(natsWrapper.client);

  const order = await Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: "reqdknfd",
    status: OrderStatus.Created,
    version: 0,
    price: 10,
  });
  await order.save();

  // Create the fake data event
  const data: OrderCancelledEvent["data"] = {
    id: order.id,
    version: 1,
    ticket: {
      id: "123",
    },
  };
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, data, msg, order };
};

it("replicate the order info", async () => {
  const { listener, data, msg, order } = await setup();
  await listener.onMessage(data, msg);
  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});
