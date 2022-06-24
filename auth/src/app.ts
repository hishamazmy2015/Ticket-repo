import express from "express";
import { json } from "body-parser";
import "express-async-errors";
import { currentUserRouter } from "./routes/current-user";
import { singupRouter } from "./routes/signup";
import { signinRouter } from "./routes/signin";

import { singoutRouter } from "./routes/signout";
// import { errorHandler, NotFoundError } from "@haticket/common20";
// import { errorHandler, NotFoundError } from "@haticket/common20";

import cookieSession from "cookie-session";
import { NotFoundError } from "./errors/not-found-error";
import { errorHandler } from "./midleware/error-handler";

const app = express();
app.set("trust proxy", true);
require("dotenv").config();

app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: false,
    // secure: process.env.NODE_EVN !== 'test'
  })
);
app.use(currentUserRouter);
app.use(singupRouter);
app.use(signinRouter);
app.use(singoutRouter);

app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
