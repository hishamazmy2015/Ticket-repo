import express, { Request, Response } from "express";
import { body } from "express-validator";
// import {BodyParser} from 'body-parser'
import { requireAuth, validateRequest } from "@haticket/common20";
import { Ticket } from "../models/ticket";
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post(
  "/api/tickets",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be bigger than zero"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;
    let ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
    });
    await ticket.save();

    new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      price: ticket.price,
      userId: ticket.userId,
      title: ticket.title,
      version: ticket.version,
    });

    res.status(201).send(ticket);
  }
);

// router.get(
//   "/api/tickets/:id",
//   requireAuth,
//   validateRequest,
//   async (req: Request, res: Response) => {
//     const { id } = req.body;
//     console.log("id >> ====== <<", id);
//     const ticket = Ticket.find(id);

//     res.status(200).send(ticket);
//   }
// );
export { router as createTicketRouter };
