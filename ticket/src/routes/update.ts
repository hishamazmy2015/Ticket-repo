import { natsWrapper } from "./../nats-wrapper";
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@haticket/common20";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher";

const router = express.Router();
router.put(
  "/api/tickets/:id",
  requireAuth,
  [
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be bigger than zero"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    console.log(
      " ------------------------------------------------------------------  ",
      req.params.id
    );
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) throw new NotFoundError();
    if (ticket.userId !== req.currentUser!.id) throw new NotAuthorizedError();
    ticket.set({
      title: req.body.title,
      price: req.body.price,
    });
    await ticket.save();
   await new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    });
    res.send(ticket);
  }
);

export { router as UpdateRouter };
