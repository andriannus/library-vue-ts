import { Router } from "express";
import { BookController } from "../controllers/book";
import { isAuthentication } from "../middlewares/authentication";

const bookController = new BookController();
const router = Router();

router.get("/", bookController.getBooks);
router.get("/:id", bookController.getBook);

router.post("/", isAuthentication, bookController.addBook);
router.post("/update", isAuthentication, bookController.updateBook);
router.post("/delete", isAuthentication, bookController.deleteBook);
router.post("checkIsbn", bookController.checkISBN);

export { router as bookRouter };
