import jwt from "jsonwebtoken";
import express, { Request, Response } from "express";
import { currentUser } from "../midleware/current-user";
import { requireAuth } from "../midleware/require-auth";
// import { currentUser } from "@haticket/common20";
// import { requireAuth } from "@haticket/common20";

const router = express.Router();

router.get(
  "/api/users/currentusers",
  currentUser,
  requireAuth,
  (req: Request, res: Response) => {
    res.send({ currentUser: req.currentUser || null });
    // try {
    //   const payload = jwt.verify(req.session?.jwt, process.env.JWT_KEY!);
    //   res.send({ currentUser: payload });
    // } catch (err) {
    //   res.send({ currentUser: null });
    // }

    res.send("Hi There");
  }
);

export { router as currentUserRouter };
