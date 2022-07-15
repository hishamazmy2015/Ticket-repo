import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import mongoose from "mongoose";
import { OrderStatus } from "@haticket/common20";
import { TicketDocs } from "./ticket";

export { OrderStatus };
interface orderAttrs {
  userId: string;
  status: OrderStatus;
  expireAt: Date;
  ticket: TicketDocs;
}

interface orderDocs extends mongoose.Document {
  userId: string;
  version: number;
  status: OrderStatus;
  expireAt: Date;
  ticket: TicketDocs;
}

interface orderModel extends mongoose.Model<orderDocs> {
  build(atts: orderAttrs): orderDocs;
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    expireAt: {
      type: mongoose.Schema.Types.Date,
      required: true,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
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
orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: orderAttrs) => {
  return new Order(attrs);
};
const Order = mongoose.model<orderDocs, orderModel>("Order", orderSchema);

export { Order };
