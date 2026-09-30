import express from "express";
import { connectDB } from "./DB/connection.js";
import collectionRouter, {
  booksRouter,
  logsRouter,
} from "./modules/users/user.controller.js";

const bootstrap = async () => {
  const app = express();
  app.use(express.json());

  await connectDB();

  app.use("/collection", collectionRouter);
  app.use("/books", booksRouter);
  app.use("/logs", logsRouter);

  app.listen(3000, () => console.log("Server running on port 3000"));
};

export default bootstrap;