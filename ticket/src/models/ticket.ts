import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface ticketAttributes {
  title: string;
  userId: string;
  price: number;
}

interface ticketDoc extends mongoose.Document {
  title: string;
  userId: string;
  price: number;
  version: number;
}

interface ticketModel extends mongoose.Model<ticketDoc> {
  build(ticketAttributes: any): ticketDoc;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
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
ticketSchema.statics.build = (attr: ticketAttributes) => {
  return new Ticket(attr);
};

const Ticket = mongoose.model<ticketDoc, ticketModel>("Ticket", ticketSchema);

export { Ticket };
