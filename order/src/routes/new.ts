import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@haticket/common20";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";
import { OrderCreatedPublisher } from "../events/publisher/order-create-publisher";
import { Order } from "../models/order";
import { Ticket } from "../models/ticket";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post(
  "/api/orders",
  requireAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("TicketId must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    // Find the ticket the user is trying to order in the DB
    const { ticketId } = req.body;
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) throw new NotFoundError();

    // Make sure that this ticket is not already reserved (taken)

    const isReserved = await ticket.isReserved();
    // const existingOrder = await Order.findOne({
    //   ticket: ticket,
    //   status: {
    //     $in: [
    //       OrderStatus.Created,
    //       OrderStatus.AwaitingPayment,
    //       OrderStatus.Complete,
    //     ],
    //   },
    // });
    if (isReserved) throw new BadRequestError("Ticket is already reserved");

    // Calculate an expiration date for this order
    const expireDate = new Date();
    expireDate.setSeconds(expireDate.getSeconds() + 15 * 60);

    // Build the order and save it to the database
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expireAt: expireDate,
      ticket: ticket,
    });  
    await order.save();

    // Publish an event saying that an order was created
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      status: order.status,
      userId: order.userId,
      version: order.version,
      expiresAt: order.expireAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    });
    res.status(201).send(order);
  }
);

export { router as newOrderRouter };
