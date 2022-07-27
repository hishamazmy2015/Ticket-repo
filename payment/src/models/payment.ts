import mongoose from "mongoose";

interface paymentAttrs {
  stripeId: string;
  orderId: string;
}

interface paymentDocument extends mongoose.Document {
  orderId: string;
  stripeId: string;
}

interface paymentModel extends mongoose.Model<paymentDocument> {
  build(att: paymentAttrs): paymentDocument;
}
const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    stripeId: {
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

const Payment = mongoose.model<paymentDocument, paymentModel>(
  "Payment",
  paymentSchema
);

paymentSchema.statics.build = (paymentAttrs) => {
  return new Payment(paymentAttrs);
};

export { Payment };
