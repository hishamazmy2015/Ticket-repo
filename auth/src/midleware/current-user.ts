// import { currentUser } from "./current-user";
import jwt from "jsonwebtoken";
import { NextFunction } from "express";
import second, { Request, Response } from "express";

interface UserPayload {
  id: string;
  email: string;
}
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt) return next();
  //   res.send({ currentUser: null });
  try {
    const payload = jwt.verify(
      req.session.jwt,
      process.env.JWT_KEY!
    ) as UserPayload;
    req.currentUser = payload;
  } catch (err) {
    console.log("err", err);
  }
  next();
};
