import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from '../../nats-wrapper';

// import * as MockDatabase from "../../__mocks__/nats-wrapper";
// jest.enableAutomock();

// import { natsWrapper } from "../../nats-wrapper";
// jest.mock('../../__mocks__/nats-wrapper.ts')

it("has a route handler listening to /api/tickets for post requests ", async () => {
  const resp = await request(app).post("/api/tickets").send({});
  expect(resp.status).not.toEqual(404);
});

it("can only be accessed if the user is signed in ", async () => {
  const response = await request(app).post("/api/tickets").send({}).expect(401);

  expect(response.status).toEqual(401);
});

it("returns a status other than 401 if the user is signed in", async () => {
  // console.log("global.signin()  ", await global.signin());

  // try {
  const response = await request(app)
    .post("/api/tickets")
    // .set(
    //   "cookie",
    //   // "express:sess=eyJqd3QiOiJleUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKcFpDSTZJall5WWprMFkyVXlNMkkyTlROaU5HTTRORFkyWmpGaE9DSXNJbVZ0WVdsc0lqb2lhbTVxWkVCbmJXRnBiQzVqYjIwaUxDSnBZWFFpT2pFMk5UWXpNVEV3TVRCOS5ZQkI0YmtqSTczU3VraDVlZEhWWWU2MWlqOUFMOWZWSWxHOUlWY3UyZDVrIn0="
    //   "express:sess=eyJqd3QiOiJleUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKcFpDSTZJall5WWprNFpUa3pNMkkyTlROaU5HTTRORFkyWmpGaFlpSXNJbVZ0WVdsc0lqb2lkR1Z6ZEVCbmJXRnBiQzVqYjIwaUxDSnBZWFFpT2pFMk5UWXpNamM0TWpkOS5VeWdWdDNIcnRIRHZQT3UyUmZBdkpURjRYLVQ1dXFwRjd1RlZKbFhoQk93In0="
    // )
    .set("Cookie", global.signin())
    .send({});
  expect(response.status).not.toEqual(401);
  // } catch (err) {
  //   console.log(" Errrrrr ", err);
  // }
});

it("returns an error if an invalid title is provided  ", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "",
      price: 10,
    })
    .expect(400);
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      price: 10,
    })
    .expect(400);
});

it("returns an error if an invalid price is provided  ", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "afdnkfnl",
      price: -10,
    })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "",
    })
    .expect(400);
});

it("create a ticket with valid inputs ", async () => {
  // jest.mock("nats-wrapper");
  // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");

//   jest.mock('../../nats-wrapper', () => ({
//     isEnabled: () => true
// }));
//   // jest.mock("../../nats-wrapper");
//   jest.mock('../../nats-wrapper', () => jest.fn())


  let tickts = await Ticket.find({});
  expect(tickts.length).toEqual(0);

  await request(app)
    .post("/api/tickets")
    .send({
      title: "fdkfk",
      price: 20,
    })
    .set("Cookie", global.signin())
    .expect(201);
  tickts = await Ticket.find({});
  expect(tickts.length).toEqual(1);
  expect(tickts[0].price).toEqual(20);
});
