const express = require("express");
const router = express.Router();
const {
  validateCreateBook,
  validateUpdateBook,
  Book,
} = require("../modules/Books");
const asyncHandler = require("express-async-handler");

//make an object of books each book has id, title, author, price
let books = [
  { id: 1, title: "The Alchemist", author: "Paulo Coelho", price: 10 },
  { id: 2, title: "The Notebook", author: "Nicholas Sparks", price: 15 },
  { id: 3, title: "The Da Vinci Code", author: "Dan Brown", price: 12 },
];

// @dec    Get all books
// @route  GET /api/books
// @access Public
// @method GET
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const books = await Book.find().populate("author");
    res.status(200).json(books);
  })
);

// @dec    Get a book by id
// @route  GET /api/books/:id
// @access Public
// @method GET
// to get a book by id
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const book = await Book.findById(req.params.id);
    if (book) {
      res.status(200).json(book);
    } else {
      res.status(404).send("The book with the given ID was not found");
    }
  })
);

// @dec    Add a book
// @route  POST /api/books
// @access Public
// @method POST

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { error } = validateCreateBook(req.body);

    if (error) {
      res.status(400).send(error.details[0].message);
      return;
    }

    const book = new Book({
      title: req.body.title,
      author: req.body.author,
      price: req.body.price,
    });

    const result = await book.save();
    res.status(201).json(result);
  })
);

// @dec    Update a book
// @route  PUT /api/books/:id
// @access Public
// @method PUT

router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const { error } = validateUpdateBook(req.body);
    if (error) {
      res.status(400).send(error.details[0].message);
      return;
    }

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          title: req.body.title,
          author: req.body.author,
          price: req.body.price,
        },
      },
      { new: true }
    );

    res.status(200).json(updatedBook);
  })
);

// @dec    Delete a book
// @route  DELETE /api/books/:id
// @access Public
// @method DELETE

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const book = await Book.findById(req.params.id);
    if (book) {
      await book.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Book deleted successfully" });
    } else {
      res.status(404).send("The book with the given ID was not found");
    }
  })
);

module.exports = router;
