import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { Order, OrderStatus } from "./order";

interface TicketAttrs {
  id: string;
  title: string;
  price: number;
}

export interface TicketDocs extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDocs> {
  build(attrs: TicketAttrs): TicketDocs;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<TicketDocs | null>;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    price: {
      type: Number,
      require: true,
      min: 0,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);
ticketSchema.set("versionKey", "version");
ticketSchema.plugin(updateIfCurrentPlugin);
// ticketSchema.pre("save", function (done) {
//   // @ts-ignore
//   this.$where = {
//     version: this.get("version") - 1,
//   };
//   done();
// });

ticketSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return Ticket.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};
ticketSchema.statics.build = (att: TicketAttrs) => {
  return new Ticket({
    _id: att.id,
    title: att.title,
    price: att.price,
  });
};

/// Run query to look at all orders. Find an order where where the ticket is the ticket we just found
/// and the orderStatus is *not* cancelled
/// If we find an order from that means the ticket *is* reserved
ticketSchema.methods.isReserved = async function () {
  // This === the ticket doc that we just called 'isReserved' on

  return await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });
};

const Ticket = mongoose.model<TicketDocs, TicketModel>("Ticket", ticketSchema);

export { Ticket };
