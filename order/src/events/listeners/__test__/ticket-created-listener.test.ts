import mongoose from "mongoose";
import { TicketCreatedEvent } from "@haticket/common20";
import { Message } from "node-nats-streaming";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketCreatedListener } from "../ticket-created-listener";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
  //create an instance of the listener
  const listner = new TicketCreatedListener(natsWrapper.client);

  //create a fake data event
  const data: TicketCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    // id: "62cfabfd87d69b4053ca88ad",
    title: "ewmail",
    price: 19.8,
    // userId: "62cd6aa336b6da9792beea71",
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 3,
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { msg, data, listner };
  //create a fake message object
  //   listner.listen();
};

it("creates and saves a ticket Create !!!", async () => {
  const { msg, data, listner } = await setup();

  //call the onMessage function  with the data object + message object
  await listner.onMessage(data, msg);

  //write assertions to make sure a ticket was created!
  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual("ewmail");
  expect(ticket!.price).toEqual(data.price);
});

it("ack the message", async () => {
    const { msg, data, listner } = await setup();

    //call the onMessage function  with the data object + message object
    await listner.onMessage(data, msg);
  
    //write assertions to make sure a ticket was created!
    // const ticket = await Ticket.findById(data.id);
  
    // expect(ticket).toBeDefined();
    // expect(ticket!.title).toEqual("ewmail");
    // expect(ticket!.price).toEqual(data.price);


  //call the onMessage function  with the data object + message object
  //write assertions to make sure a ticket was created!
  expect(msg.ack).toHaveBeenCalled()
});
