import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
// var jwt = require('jsonwebtoken');

import { BadRequestError, validateRequest } from "@haticket/common20";
import { body } from "express-validator";

// import { DatabaseConnectionError } from "../errors/database-connection-error";
// import { RequestValidationError } from "../errors/request-validation-error";
import { User } from "../models/user";
// import { validateRequest } from "../midleware/validate-request";
// import { BadRequestError } from "../errors/bad-request-error";

// import jwt from "jsonwebtoken";
// import { BadRequestError } from "../errors/bad-request-error";
// import { validateRequest } from "../midleware/validate-request";
const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),

    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password  must be between 4 and 20 characters"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // console.log("Creating a user ...");
    // const {email}
    const existingUser = await User.findOne({ email });
    // console.log("existingUser =========> ", existingUser);
    if (existingUser) {
      throw new BadRequestError("Email is in use");
      // console.log("first   ")
      // res.send({});
    }
    // const user=User.build({email,password})

    const user = User.build({ email, password });
    await user.save();
    //Generate JWT
    const userJwt = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_KEY!
    );

    //store it on session object
    req.session = { jwt: userJwt };
    res.status(201).send(user);
    // throw new DatabaseConnectionError();
  }
);

export { router as singupRouter };
