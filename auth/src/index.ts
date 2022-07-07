import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
  process.env.JWT_KEY = "adsf";

  if (!process.env.JWT_KEY) {
    throw new Error(" JWT_KEY must be defined ");
  }
  try {
    if (!process.env.MONGO_URI) {
      throw new Error(" MONGO URI must be defined");
    }
    await mongoose.connect(process.env.MONGO_URI || "");
    console.log("Connected To Mongo");
  } catch (err) {
    console.log("err", err);
  }
  app.listen(4003, () => {
    console.log("Listening on Port 4003 ====================== ");
  });
};
start();
