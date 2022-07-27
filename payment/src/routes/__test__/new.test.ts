import { OrderStatus } from "@haticket/common20";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Order } from "../../models/order";
import { stripe } from "../../stripe";

// jest.mock("../../stripe");

beforeAll(() => {
  // process.env.STRIPE_KEY =
  //   "Bearer sk_test_51LOkuvFEfrboxi6lmhQ5QfA1IvqV0WlzaModLM2d1aeDudjYDnqN4GO6GpectVSBrtrbEtQgI6UgSiqR14iiLzbJ00qipWTxZH";
});

it("return a 404 when purchasing an order that does not exist", async () => {
  const signIn = global.signin();
  const requestPay = await request(app)
    .post("/api/payment")
    .set("Cookie", signIn)
    .send({
      orderId: new mongoose.Types.ObjectId().toHexString(),
      token: "123",
    })
    .expect(404);
});

it("return a 401 when purchasing an order that does not belong the user", async () => {
  const order = Order.build({
    userId: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 0,
  });
  await order.save();

  const signIn = global.signin();
  const requestPay = await request(app)
    .post("/api/payment")
    .set("Cookie", signIn)
    .send({
      orderId: order.id,
      token: "123",
    })
    .expect(401);
});
it("return a 400 when purchasing a cancelled order", async () => {
  //   const signIn = global.signin();
  const userId = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    userId,
    status: OrderStatus.Cancelled,
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 0,
  });
  await order.save();

  const requestPay = await request(app)
    .post("/api/payment")
    .set("Cookie", global.signin(userId))
    .send({
      orderId: order.id,
      token: "123",
    })
    .expect(400);
});

// it("return a 204 with valid inputs", async () => {
//   const userId = new mongoose.Types.ObjectId().toHexString();
//   const order = Order.build({
//     userId,
//     status: OrderStatus.Created,
//     id: new mongoose.Types.ObjectId().toHexString(),
//     version: 0,
//     price: 100,
//   });
//   await order.save();

//   await request(app)
//     .post("/api/payment")
//     .set("Cookie", global.signin(userId))
//     .send({
//       token: "tok_visa",
//       orderId: order.id,
//     })
//     .expect(201);

//   const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
//   // expect(chargeOptions.source).toEqual("tok_visa");
//   // expect(chargeOptions.amount).toEqual(100 * 100);
//   // expect(chargeOptions.currency).toEqual("usd");
// });

it("return a 204 with valid inputs", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const price = Math.floor(Math.random() * 100000);
  const order = Order.build({
    userId,
    status: OrderStatus.Created,
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price,
  });
  await order.save();

  await request(app)
    .post("/api/payment")
    .set("Cookie", global.signin(userId))
    // .set("Authorization", process.env.STRIPE_KEY!)
    .send({
      token: "tok_visa",
      orderId: order.id,
    })
    .expect(201);

  console.log(" <<<<<<<<<<<<< Before Stripe is calling >>>>>>>>>>>>>>>>");

  const stripeChareges = await stripe.charges.list({ limit: 50 });
  console.log(" ----------- stripeChareges ------------", stripeChareges);
  const stripeCharege = stripeChareges.data.find((charge) => {
    return charge.amount === price * 100;
  });

  expect(stripeCharege).toBeDefined();
});
