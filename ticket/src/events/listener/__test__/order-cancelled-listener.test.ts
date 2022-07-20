import { natsWrapper } from "./../../../nats-wrapper";
import { OrderCancelledEvent, OrderStatus } from "@haticket/common20";
import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket";
import { OrderCreatedListener } from "../order-created-listener";
import { OrderCancelledListener } from "../order-cancelled-listener";

const setup = async () => {
  // const order = await Ord
  const listener = new OrderCancelledListener(natsWrapper.client);

  const ticket = await Ticket.build({
    title: "concert",
    price: 99,
    userId: "adafe",
    orderId: undefined,
  });

  await ticket.save();
  console.log(" ticket id", ticket.id);

  // Create the fake data event
  const data: OrderCancelledEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    ticket: {
      id: ticket.id,
    },
  };
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, ticket, data, msg };
};

it("update the orderId of the tickt", async () => {
  const { listener, data, msg, ticket } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).not.toBeDefined();

//   expect(updatedTicket?.orderId).toEqual(data.id);

  expect(msg.ack).toHaveBeenCalled();

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
