import * as bcrypt from "bcryptjs";
import { Model, model, Schema } from "mongoose";
import { IUserDocument } from "../interfaces/user";

export interface IUserModel extends IUserDocument {
  comparePassword(candidatePassword, callback);
}

export const UserSchema: Schema = new Schema({
  avatar: {
    default: "avatar.jpg",
    type: String,
  },
  email: String,
  level: {
    default: "user",
    enum: ["admin", "user"],
    type: String,
  },
  name: String,
  password: String,
  username: String,
});

UserSchema.pre<IUserDocument>("save", function encrypt(next): void {
  const user = this;

  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      next(err);
    }

    bcrypt.hash(user.password, salt, (fault, hash) => {
      if (fault) {
        next(fault);
      }

      user.password = hash;
      next();
    });
  });
});

UserSchema.method("comparePassword", function compare(candidatePassword: string, callback: any): void {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) {
      callback(err);
    }

    callback(null, isMatch);
  });
});

export const User: Model<IUserModel> = model<IUserModel>("User", UserSchema);
