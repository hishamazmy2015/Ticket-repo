import mongoose from "mongoose";
import { app } from "./app";
import { orderCancelledListener } from "./events/listeners/order-cancelled-listener";
import { orderCreatedListener } from "./events/listeners/order-created-listener";
import { PaymentCreatedPublisher } from "./events/publisher/create-payment-publisher";
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
    if (!process.env.NATS_CLIENT_ID) {
      throw new Error(" NATS_CLIENT_ID URI must be defined");
    }
    if (!process.env.NATS_URL) {
      throw new Error(" NATS_URL URI must be defined");
    }
    if (!process.env.NATS_CLUSTER_ID) {
      throw new Error(" NATS_CLUSTER_ID URI must be defined");
    }
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
    // await natsWrapper.connect("ticketing", "lassfes", "http://nats-srv:4222");
    natsWrapper.client.on("close", () => {
      console.log("NATS connections closed");
      process.exit();
    });
    process.on("SIGINT", () => natsWrapper.client.close);
    process.on("SIGTERM", () => natsWrapper.client.close);

    new orderCreatedListener(natsWrapper.client).listen();
    new orderCancelledListener(natsWrapper.client).listen();

    mongoose.connect(process.env.MONGO_URI);
    // await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected To Mongo For Payment DB");
  } catch (err) {
    console.log("err", err);
  }
  app.listen(4003, () => {
    console.log(
      "====================== Listening Payment SRV on Port 4003 ====================== "
    );
  });
};
start();
