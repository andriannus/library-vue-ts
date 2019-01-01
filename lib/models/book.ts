import * as mongoose from "mongoose";

const Schema = mongoose.Schema;

export const BookSchema = new Schema({
  author: String,
  date: {
    default: Date.now,
    type: Date,
  },
  isbn: String,
  name: String,
  page: Number,
  publisher: String,
});
