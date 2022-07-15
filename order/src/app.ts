import { errorHandler, NotFoundError, currentUser } from "@haticket/common20";
import { json } from "body-parser";
import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";

import { deleteOrderRouter } from "./routes/delete";
import { newOrderRouter } from "./routes/new";
import { updateOrderRouter } from "./routes/update";
import { showOrderRouter } from "./routes/show";
import { indexOrderRouter } from "./routes";

const app = express();
app.set("trust proxy", true);
require("dotenv").config();

app.use(json());
app.use(
  cookieSession({
    signed: false,
    // secure: false,
    secure: process.env.NODE_EVN !== "test",
  })
);
app.use(currentUser);
app.use(deleteOrderRouter);
app.use(newOrderRouter);
app.use(indexOrderRouter);
app.use(updateOrderRouter);
app.use(showOrderRouter);

app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
