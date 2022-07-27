import {
  ExpirationCompleteEvent,
  Listener,
  OrderStatus,
  PaymentCreatedEvent,
  Subjects,
} from "@haticket/common20";
import { Message } from "node-nats-streaming";
// import { queueGroupName } from "../../../../expiration/src/events/queue-group-name";
import { Order } from "../../models/order";
import { queueGroupName } from "./queue-group-name";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  queueGroupName: string = queueGroupName;

  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  async onMessage(
    data: PaymentCreatedEvent["data"],
    msg: Message
  ): Promise<void> {
    const order = await Order.findById(data.orderId);

    if (!order) throw new Error("order not found");

    order.set({
      status: OrderStatus.Complete,
    });
    await order.save();

    msg.ack();
  }
}
