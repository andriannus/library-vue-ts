import { model, Schema } from "mongoose";

const BookSchema = new Schema({
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

export const Book = model("Book", BookSchema);
