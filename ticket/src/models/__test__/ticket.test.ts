import { Ticket } from "../ticket";

it("implement optimistic concurrency control", async () => {
  // let done: () => Promise<void>;
  // const callbackResolved = new Promise((resolve) => { done = resolve; });
  //   let done: () => void;
  //   const callbackRes = new Promise((res) => {
  //     done = res;
  //   });
  // Create an instance of a ticket
  const ticket = Ticket.build({
    title: "concert",
    price: 5,
    userId: "123",
  });

  // Save the ticket to the database
  await ticket.save();

  // Fetch the ticket twice
  const firstInstance1 = await Ticket.findById(ticket.id);
  const firstInstance2 = await Ticket.findById(ticket.id);

  // Make two seperate changes to the tickets we fetched
  firstInstance1!.set({ price: 10 });
  firstInstance2!.set({ price: 15 });

  //   firstInstance2!.set({ price: 15, version: firstInstance1!?.version + 1 });
  // Save the first fetched ticket
  await firstInstance1!.save();

  // save the second fetched ticket and expect an error
  try {
    await firstInstance2!.save();
  } catch (err) {
    return;
    // return await Promise.resolve();
    // return Promise.resolve();
    // return new Promise.resolve("expected value");
  }
  throw new Error("Should not reach to here ");
});

it("increament the version number on multiple saves", async () => {
  const ticket = Ticket.build({
    title: "concert",
    price: 5,
    userId: "123",
  });
  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
});
