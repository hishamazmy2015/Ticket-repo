import {
  Listener,
  NotFoundError,
  OrderCancelledEvent,
  OrderCreatedEvent,
  OrderStatus,
  Subjects,
} from "@haticket/common20";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { queueGroupName } from "./queue-group-name";

export class orderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;
  async onMessage(
    data: OrderCancelledEvent["data"],
    msg: Message
  ): Promise<void> {
    console.log("_id: data.id,  ", data.id);
    console.log(" version: data.version - 1 ", data.version);
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    });
    if (!order) throw new Error("Order not found");
    order.set({ status: OrderStatus.Cancelled });
    await order.save();
    msg.ack();
  }
}
