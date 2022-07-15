import {
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
} from "@haticket/common20";
import express, { Request, Response } from "express";
import { OrderCancelledPublisher } from "../events/publisher/order-cancelled-publisher";
import { Order } from "../models/order";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.delete("/api/orders/:orderId", async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.orderId).populate("ticket");
  if (!order) throw new NotFoundError();
  if (order.userId !== req.currentUser!.id) throw new NotAuthorizedError();

  order.status = OrderStatus.Cancelled;
  await order.save();

  new OrderCancelledPublisher(natsWrapper.client).publish({
    id: order.id,
    ticket: {
      id: order.ticket.id,
    },
  });
  res.status(204).send(order);
});

export { router as deleteOrderRouter };