import { TicketUpdateEvent } from "@haticket/common20";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketUpdatedListener } from "../ticket-updated-listener";

// const setup = async () => {
//   //create an instance of the listener
//   const listener = new TicketUpdatedListener(natsWrapper.client);

//   const ticket = Ticket.build({
//     title: "concert",
//     price: 20,
//     id: new mongoose.Types.ObjectId().toString(),
//   });
//   // await ticket.save();

//   const res = await ticket.save();
//   console.log("Saved Ticket res ", res);
//   console.log("id: >>>>>> , version: >>>>>>>>>", ticket.id, ticket.version);
//   //create a fake data event
//   const data: TicketUpdateEvent["data"] = {
//     id: ticket.id,
//     version: ticket.version + 1,
//     title: "ewmail",
//     price: 19.8,
//     userId: "123456",
//   };

//   // @ts-ignore
//   const msg: Message = {
//     ack: jest.fn(),
//   };
//   return { msg, data, listener, ticket };
// };

// it("creates and saves a ticket Update !!! ", async () => {
//   const { msg, data, listner, ticket } = await setup();
//   console.log(
//     "id: 22 >>>>>> , version:22 >>>>>>>>>",
//     ticket.id,
//     ticket.version
//   );

//   //call the onMessage function  with the data object + message object
//   await listner.onMessage(data, msg);

//   //write assertions to make sure a ticket was created!
//   // const updatedTicket = await Ticket.findByEvent({
//   //   id: ticket.id,
//   //   version: ticket.version,
//   // });
//   // );
//   // });
//   // const updatedTicket = await Ticket.findById("62d236cc46ab2303bd463874");
//   const updatedTicket = await Ticket.findById(ticket.id);

//   // expect(updatedTicket).toBeDefined();
//   expect(updatedTicket!.title).toEqual(data.title);
//   expect(updatedTicket!.price).toEqual(data.price);
//   // expect(ticket!.version).toEqual(data.version);
// });

const setup = async () => {
  // Create a listener
  const listener = new TicketUpdatedListener(natsWrapper.client);

  const ticketId = new mongoose.Types.ObjectId().toHexString();
  // Create and save a ticket
  const ticket = Ticket.build({
    id: ticketId,
    // id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  const saveTicket = await ticket.save();
  console.log("saveTicket >> ", saveTicket);

  // Create a fake data object
  const data: TicketUpdateEvent["data"] = {
    id: ticketId,
    version: ticket.version + 1,
    title: "new concert",
    price: 999,
    userId: "ablskdjf",
  };

  // Create a fake msg object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  // return all of this stuff
  return { msg, data, ticket, listener, ticketId };
};

it("finds, updates, and saves a ticket", async () => {
  const { msg, data, ticket, listener, ticketId } = await setup();
  // console.log("Ticket data after save ", ticket.id, "  data >>   ", data);

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticketId);
  console.log("updatedTicket ", updatedTicket);
  console.log("updatedTicket!.version  ", updatedTicket!.version);

  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
});

it("ack the message", async () => {
  const { msg, data, ticket, listener, ticketId } = await setup();

  // //call the onMessage function  with the data object + message object
  await listener.onMessage(data, msg);
  // //write assertions to make sure a ticket was created!
  // const updatedTicket = await Ticket.findById(data.id);
  // expect(updatedTicket).toBeDefined();
  // expect(updatedTicket!.title).toEqual("ewmail");
  // expect(updatedTicket!.price).toEqual(data.price);
  // expect(updatedTicket!.version).toEqual(data.version);
  //call the onMessage function  with the data object + message object
  //write assertions to make sure a sticket was created!

  expect(msg.ack).toHaveBeenCalled();
});

it("does not call ack if the event has a skipped version number ", async () => {
  const { msg, data, ticket, listener, ticketId } = await setup();

  data.version = 10;

  try {
    await listener.onMessage(data, msg);
  } catch (err) {
    return;
  }
  expect(msg.ack()).not.toHaveBeenCalled();
});
