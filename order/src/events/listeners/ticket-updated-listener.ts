import { Listener, Subjects, TicketUpdateEvent } from "@haticket/common20";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdateEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdateEvent["data"], msg: Message) {
    // const ticket = await Ticket.findById(data.id);
    const ticket = await Ticket.findByEvent(data);

    if (!ticket) throw new Error("Ticket not found!");

    const { title, price } = data;
    ticket.set({ title, price });
    await ticket.save();
    msg.ack();
  }
}
