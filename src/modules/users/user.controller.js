import { Router } from "express";
import * as S from "./user.service.js";


const router = Router();

router.post("/books", S.createBooks);
router.post("/authors", S.createAuthor);
router.post("/logs/capped", S.createCappedLogs);
router.post("/books/index", S.createTitleIndex);


export const booksRouter = Router();

booksRouter.get("/title", S.findBookByTitle);
booksRouter.get("/year", S.findBooksByYear);
booksRouter.get("/genre", S.findBooksByGenre);
booksRouter.get("/skip-limit", S.skipLimitBooks);
booksRouter.get("/year-integer", S.findBooksYearInteger);
booksRouter.get("/exclude-genres", S.findBooksExcludeGenres);
booksRouter.get("/aggregate1", S.aggregateBooks1);
booksRouter.get("/aggregate2", S.aggregateBooks2);
booksRouter.get("/aggregate3", S.aggregateBooks3);
booksRouter.get("/aggregate4", S.aggregateBooks4);
booksRouter.delete("/before-year", S.deleteBooksBeforeYear);
booksRouter.post("/", S.insertBook);
booksRouter.post("/batch", S.insertBooksBatch);
booksRouter.patch("/:title", S.updateBookYear);


export const logsRouter = Router();

logsRouter.post("/", S.insertLog);

export default router;