import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";

const start = async () => {
  process.env.JWT_KEY = "adsf";

  if (!process.env.JWT_KEY) {
    throw new Error(" JWT_KEY must be defined ");
  }
  if (!process.env.MONGO_URI) {
    throw new Error(" MONGO URI must be defined");
  }
  try {
    await natsWrapper.connect("ticketing", "lassfes", "http://nats-srv:4222");
    natsWrapper.client.on("close", () => {
      console.log("NATS connections closed");
      process.exit();
    });
    process.on("SIGINT", () => natsWrapper.client.close);
    process.on("SIGTERM", () => natsWrapper.client.close);
    mongoose.connect(process.env.MONGO_URI);
    // await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected To Mongo For Ticket DB");
  } catch (err) {
    console.log("err", err);
  }
  app.listen(4003, () => {
    console.log("Listening on Port 4003 ====================== ");
  });
};
start();
