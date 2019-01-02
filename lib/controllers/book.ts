import { Request, Response } from "express";
import * as _ from "lodash";
import { Book } from "../models/book";

export class BookController {
  public getBooks(req: Request, res: Response): void {
    const search = req.query.search || "";
    const fullUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}${req.path}`;
    const perPage = 5;
    const page = req.query.page || 1;

    Book
      .find(search !== "" ? { name: { $regex: search, $options: "i" } } : {})
      .skip((perPage * page) - perPage)
      .limit(perPage)
      .sort({ date: -1 })
      .exec((err, books) => {
        if (err) {
          res.status(200).send({
            message: err,
            status: 500,
            success: false,
          });
        } else {
          Book
            .countDocuments()
            .exec((fault, count) => {
              if (fault) {
                //
              } else {
                const total = Math.round(count / perPage);

                res.status(200).send({
                  data: books,
                  links: {
                    first: `${fullUrl}?page=1`,
                    last: total > page ? `${fullUrl}?page=${total}` : `${fullUrl}?page=1`,
                    next: total > page ? `${fullUrl}?page=${parseInt(page, 10) + 1}` : null,
                    prev: page - 1 !== 0 ? `${fullUrl}?page=${page - 1}` : null,
                  },
                  message: "Get a list of books",
                  meta: {
                    currentPage: page,
                    from: 1,
                    lastPage: total > page ? total : 1,
                    path: fullUrl,
                    perPage,
                    to: count,
                    total: count,
                  },
                  status: 200,
                  success: true,
                });
              }
            });
        }
      });
  }

  public getBook(req: Request, res: Response): void {
    const bookId = req.params.id;

    Book.findById(bookId)
      .exec((err, book) => {
        if (err) {
          res.status(200).send({
            message: err,
            status: 500,
            success: false,
          });
        }

        if (book == null) {
          res.status(200).send({
            message: "Book cannot be found",
            status: 404,
            success: false,
          });
        } else {
          res.status(200).send({
            data: book,
            message: "Get a book",
            status: 200,
            success: true,
          });
        }
      });
  }

  public addBook(req: Request, res: Response): void {
    const newBook = new Book();

    _.forEach(req.body, (value, index) => {
      newBook[index] = value;
    });

    newBook.save((err, book) => {
      if (err) {
        res.status(200).send({
          message: err,
          status: 500,
          success: false,
        });
      } else {
        res.status(200).send({
          data: book,
          message: "Book has been created",
          status: 201,
          success: true,
        });
      }
    });
  }

  public updateBook(req: Request, res: Response): void {
    const { _id, author, isbn, name, page, publisher } = req.body;

    Book.findByIdAndUpdate(_id,
      {
        author, isbn, name, page, publisher,
      },
      { new: true }, // Callback updated book
      (err, updatedBook) => {
        if (err) {
          res.status(200).send({
            message: err,
            status: 500,
            success: false,
          });
        }

        res.status(200).send({
          data: updatedBook,
          message: "Book has been updated",
          status: 200,
          success: true,
        });
      });
  }

  public deleteBook(req: Request, res: Response): void {
    const bookId = req.body.id;

    Book.findByIdAndDelete(bookId, (err) => {
      if (err) {
        res.status(200).send({
          message: err,
          status: 404,
          success: false,
        });
      }

      res.status(200).send({
        message: "Book has been deleted",
        status: 200,
        success: true,
      });
    });
  }

  public checkISBN(req: Request, res: Response): void {
    const { isbn } = req.body;

    Book.findOne({ isbn })
      .exec((err, book) => {
        if (err) {
          res.status(200).send({
            message: err,
            status: 500,
            success: false,
          });
        }

        if (book == null) {
          res.status(200).send({
            message: "ISBN can be used",
            status: 200,
            success: true,
          });
        } else {
          res.status(200).send({
            message: "ISBN cannot be used",
            status: 200,
            success: false,
          });
        }
      });
  }
}
