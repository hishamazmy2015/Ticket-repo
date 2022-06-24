import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
  process.env.JWT_KEY = "adsf";

  if (!process.env.JWT_KEY) {
    throw new Error(" JWT_KEY must be defined ");
  }
  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth");
    console.log("Connected To Mongo");
  } catch (err) {
    console.log("err", err);
  }
  app.listen(4003, () => {
    console.log("Listening on Port 4003 ====================== ");
  });
};
start();
