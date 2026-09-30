import { db } from "../../DB/connection.js";
export const createBooks = async (req, res) => {
  try {
    const result = await db.command({
      create: "books",
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["title"],
          properties: { title: { bsonType: "string", minLength: 1 } },
        },
      },
    });
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}
export const createAuthor = async (req, res) => {
  try {
    const result = await db.collection("authors").insertOne(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const createCappedLogs = async (req, res) => {
  try {
    const result = await db.command({
      create: "logs",
      capped: true,
      size: 1024 * 1024,
    });
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const createTitleIndex = async (req, res) => {
  try {
    const result = await db.collection("books").createIndex({ title: 1 });
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const insertBook = async (req, res) => {
  try {
    const result = await db.collection("books").insertOne(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const insertBooksBatch = async (req, res) => {
  try {
    const result = await db.collection("books").insertMany(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


export const insertLog = async (req, res) => {
  try {
    const result = await db.collection("logs").insertOne(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateBookYear = async (req, res) => {
  try {
    const result = await db
      .collection("books")
      .updateOne({ title: req.params.title }, { $set: { year: 2022 } });
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const findBookByTitle = async (req, res) => {
  try {
    const book = await db
      .collection("books")
      .findOne({ title: req.query.title });
    res.status(200).json(book);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const findBooksByYear = async (req, res) => {
  try {
    const from = Number(req.query.from);
    const to = Number(req.query.to);
    const books = await db
      .collection("books")
      .find({ year: { $gte: from, $lte: to } })
      .toArray();
    res.status(200).json(books);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const findBooksByGenre = async (req, res) => {
  try {
    const books = await db
      .collection("books")
      .find({ genres: req.query.genre })
      .toArray();
    res.status(200).json(books);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
export const skipLimitBooks = async (req, res) => {
  try {
    const books = await db
      .collection("books")
      .find()
      .sort({ year: -1 })
      .skip(2)
      .limit(3)
      .toArray();
    res.status(200).json(books);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const findBooksYearInteger = async (req, res) => {
  try {
    const books = await db
      .collection("books")
      .find({ year: { $type: "number" } })
      .toArray();
    res.status(200).json(books);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
export const findBooksExcludeGenres = async (req, res) => {
  try {
    const books = await db
      .collection("books")
      .find({ genres: { $nin: ["Horror", "Science Fiction"] } })
      .toArray();
    res.status(200).json(books);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
export const deleteBooksBeforeYear = async (req, res) => {
  try {
    const year = Number(req.query.year);
    const result = await db
      .collection("books")
      .deleteMany({ year: { $lt: year } });
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const aggregateBooks1 = async (req, res) => {
  try {
    const books = await db
      .collection("books")
      .aggregate([
        { $match: { year: { $gt: 2000 } } },
        { $sort: { year: -1 } },
      ])
      .toArray();
    res.status(200).json(books);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const aggregateBooks2 = async (req, res) => {
  try {
    const books = await db
      .collection("books")
      .aggregate([
        { $match: { year: { $gt: 2000 } } },
        { $project: { _id: 0, title: 1, author: 1, year: 1 } },
      ])
      .toArray();
    res.status(200).json(books);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const aggregateBooks3 = async (req, res) => {
  try {
    const books = await db
      .collection("books")
      .aggregate([
        { $unwind: "$genres" },
        { $project: { _id: 0, title: 1, genres: 1 } },
      ])
      .toArray();
    res.status(200).json(books);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
export const aggregateBooks4 = async (req, res) => {
  try {
    const logs = await db
      .collection("logs")
      .aggregate([
        {
          $lookup: {
            from: "books",
            localField: "book_id",
            foreignField: "_id",
            as: "book_details",
          },
        },
        {
          $project: {
            _id: 0,
            action: 1,
            "book_details.title": 1,
            "book_details.author": 1,
            "book_details.year": 1,
          },
        },
      ])
      .toArray();
    res.status(200).json(logs);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};