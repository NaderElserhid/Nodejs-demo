const express = require("express");
const router = express.Router();
const joi = require("joi");

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
router.get("/", (req, res) => {
  res.json(books);
});

// @dec    Get a book by id
// @route  GET /api/books/:id
// @access Public
// @method GET
// to get a book by id
router.get("/:id", (req, res) => {
  const book = books.find((b) => b.id === parseInt(req.params.id));
  if (book) {
    res.status(200).json(book);
  } else {
    res.status(404).send("The book with the given ID was not found");
  }
});

// @dec    Add a book
// @route  POST /api/books
// @access Public
// @method POST

router.post("/", (req, res) => {
  const { error } = validateCreateBook(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  const book = {
    id: books.length + 1,
    title: req.body.title,
    author: req.body.author,
    price: req.body.price,
  };
  books.push(book);
  res.status(201).json(book);
});

// @dec    Update a book
// @route  PUT /api/books/:id
// @access Public
// @method PUT

router.put("/:id", (req, res) => {
  const book = books.find((b) => b.id === parseInt(req.params.id));
  if (book) {
    res.status(200).json({ message: "Book updated successfully" });
  } else {
    res.status(404).send("The book with the given ID was not found");
  }
  const { error } = validateUpdateBook(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  res.status(200).json(book);
});

// @dec    Delete a book
// @route  DELETE /api/books/:id
// @access Public
// @method DELETE

router.delete("/:id", (req, res) => {
  const book = books.find((b) => b.id === parseInt(req.params.id));
  if (book) {
    books = books.filter((b) => b.id !== parseInt(req.params.id));
    res.status(200).json({ message: "Book deleted successfully" });
  } else {
    res.status(404).send("The book with the given ID was not found");
  }
});
//validate create book
function validateCreateBook(book) {
  const schema = joi.object({
    title: joi.string().trim().min(3).required(),
    author: joi.string().trim().min(3).required(),
    price: joi.number().min(1).required(),
  });
  return schema.validate(book);
}

//validate update book
function validateUpdateBook(book) {
  const schema = joi.object({
    title: joi.string().trim().min(3),
    author: joi.string().trim().min(3),
    price: joi.number().min(1),
  });
  return schema.validate(book);
}
module.exports = router;
