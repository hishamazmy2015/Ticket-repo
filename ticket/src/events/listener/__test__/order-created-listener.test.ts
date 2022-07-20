import { Message } from "node-nats-streaming";
import { Listener, OrderCreatedEvent, OrderStatus } from "@haticket/common20";
import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";

const setup = async () => {
  // const order = await Ord
  const listener = new OrderCreatedListener(natsWrapper.client);

  const ticket = await Ticket.build({
    title: "concert",
    price: 99,
    userId: "adafe",
  });

  await ticket.save();
  console.log(" ticket id", ticket.id);

  // Create the fake data event
  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: "adafe",
    expiresAt: "dnfdk",
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, ticket, data, msg };
};

it("set the userId of the ticket", async () => {
  const { listener, data, msg, ticket } = await setup();

  await listener.onMessage(data, msg);
  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket?.orderId).toEqual(data.id);
});

it("acks the message", async () => {
  const { listener, data, msg, ticket } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it(" publishes a ticket updated event", async () => {
  const { listener, data, msg, ticket } = await setup();
  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
  // @ts-ignore
  console.log(natsWrapper.client.publish.mock.calls[0]);

  const ticketUpdateData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );
  expect(ticketUpdateData.orderId).toEqual(data.id);
});
