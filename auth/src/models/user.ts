import mongoose from "mongoose";
import { Password } from "../services/password";
// import second from 'first'
interface UserAttrs {
  email: string;
  password: string;
}

interface UserModel extends mongoose.Model<userDoc> {
  //   build(x: any): userDoc;
  build(attrs: UserAttrs): userDoc;
}

interface userDoc extends mongoose.Document {
  email: String;
  password: String;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);
userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
  done();
});
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<userDoc, UserModel>("user", userSchema);
// const UserAttrs()

export { User };
