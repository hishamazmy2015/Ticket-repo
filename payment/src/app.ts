import { errorHandler, NotFoundError, currentUser } from "@haticket/common20";
import { json } from "body-parser";
import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";
// import { createTicketRouter } from "./routes/new";
// import { showTicketRouter } from "./routes/show";
// import { indexTicketRouter } from "./routes";
// import { UpdateRouter } from "./routes/update";

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
// app.use(createTicketRouter);
// app.use(showTicketRouter);
// app.use(indexTicketRouter);
// app.use(UpdateRouter);

app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
