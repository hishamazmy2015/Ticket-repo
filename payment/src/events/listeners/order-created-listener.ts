import {
  Listener,
  OrderCreatedEvent,
  OrderStatus,
  Subjects,
} from "@haticket/common20";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { queueGroupName } from "./queue-group-name";

export class orderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;
  async onMessage(
    data: OrderCreatedEvent["data"],
    msg: Message
  ): Promise<void> {
    const order = Order.build({
      id: data.id,
      version: data.version,
      status: OrderStatus.Complete,
      userId: data.userId,
      price: data.ticket.price,
    });

    await order.save();
    msg.ack();
  }
}
