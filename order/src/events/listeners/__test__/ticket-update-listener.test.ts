import { TicketUpdateEvent } from "@haticket/common20";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketUpdatedListener } from "../ticket-updated-listener";

const setup = async () => {
  //create an instance of the listener
  const listner = new TicketUpdatedListener(natsWrapper.client);

  //create a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "ewmail",
    price: 19.8,
  });

  console.log(
    "id: ticket.id, version: ticket.version",
    ticket.id,
    ticket.version
  );
  //create a fake data event  
  const data: TicketUpdateEvent["data"] = {
    id: ticket.id,
    title: "ewmail",
    price: 19.8,
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: ticket.version + 1,
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { msg, data, listner, ticket };
};

it("creates and saves a ticket Update !!! ", async () => {
  const { msg, data, listner, ticket } = await setup();

  //call the onMessage function  with the data object + message object
  await listner.onMessage(data, msg);

  //write assertions to make sure a ticket was created!
  console.log(
    "id: ticket.id, version: ticket.version  ",
    ticket.id,
    ticket.version
  );
  // const updatedTicket = await Ticket.findByEvent({
  //   id: ticket.id,
  //   version: ticket.version,
  // });
  // );
  // });
  const updatedTicket = await Ticket.findById(ticket.id)

  // expect(updatedTicket).toBeDefined();
  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  // expect(ticket!.version).toEqual(data.version);
});

it("ack the message", async () => {
  // const { msg, data, listner } = await setup();
  // //call the onMessage function  with the data object + message object
  // await listner.onMessage(data, msg);
  // //write assertions to make sure a ticket was created!
  // const ticket = await Ticket.findById(data.id);
  // expect(ticket).toBeDefined();
  // expect(ticket!.title).toEqual("ewmail");
  // expect(ticket!.price).toEqual(data.price);
  // expect(ticket!.version).toEqual(data.version);
  //call the onMessage function  with the data object + message object
  //write assertions to make sure a sticket was created!
  // expect(msg.ack).toHaveBeenCalled();
});
