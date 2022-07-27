import {
  ExpirationCompleteEvent,
  Listener,
  OrderStatus,
  Subjects,
} from "@haticket/common20";
import { Message } from "node-nats-streaming";
// import { queueGroupName } from "../../../../expiration/src/events/queue-group-name";
import { Order } from "../../models/order";
import { OrderCancelledPublisher } from "../publisher/order-cancelled-publisher";
import { queueGroupName } from "./queue-group-name";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  queueGroupName: string = queueGroupName;

  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  async onMessage(
    data: ExpirationCompleteEvent["data"],
    msg: Message
  ): Promise<void> {
    const order = await Order.findById(data.orderId).populate("ticket");

    if (!order) throw new Error("order not found");

    if (order.status === OrderStatus.Complete) {
      return msg.ack();
    }
    
    order.set({
      status: OrderStatus.Cancelled,
    });
    await order.save();
    new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });
    msg.ack();
  }
}
