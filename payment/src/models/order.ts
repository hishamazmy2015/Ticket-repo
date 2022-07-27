import { OrderStatus } from "@haticket/common20";
import mongoose, { mongo } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface orderAttrs {
  id: string;
  version: number;
  userId: string;
  price: number;
  status: OrderStatus;
}

interface orderDocument extends mongoose.Document {
  version: number;
  userId: string;
  price: number;
  status: OrderStatus;
}
interface orderModel extends mongoose.Model<orderDocument> {
  build(att: orderAttrs): orderDocument;
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
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
orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (att: orderAttrs) => {
  return new Order({
    _id: att.id,
    version: att.version,
    userId: att.userId,
    price: att.price,
    status: att.status,
  });
};
const Order = mongoose.model<orderDocument, orderModel>("Order", orderSchema);

export { Order };
