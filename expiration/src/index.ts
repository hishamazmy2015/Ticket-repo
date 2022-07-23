import { OrderCreatedListener } from "./events/listeners/order-created-listener";
import { natsWrapper } from "./nats-wrapper";

const start = async () => {
  process.env.JWT_KEY = "adsf123";

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
    await new OrderCreatedListener(natsWrapper.client).listen();
    console.log("Connected To Mongo For Ticket DB");
  } catch (err) {
    console.log("err", err);
  }
};
start();
