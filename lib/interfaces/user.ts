import { Document } from "mongoose";

export interface IUserDocument extends Document {
  avatar: string;
  email: string;
  level: string;
  name: string;
  password: string;
  username: string;
}
