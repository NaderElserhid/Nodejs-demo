const express = require("express");
const router = express.Router();
const joi = require("joi");

//make an object of books each book has id, title, author, price
let books = [
  { id: 1, title: "The Alchemist", author: "Paulo Coelho", price: 10 },
  { id: 2, title: "The Notebook", author: "Nicholas Sparks", price: 15 },
  { id: 3, title: "The Da Vinci Code", author: "Dan Brown", price: 12 },
];

router.get("/", (req, res) => {
  res.json(books);
});

// to get a book by id
router.get("/:id", (req, res) => {
  const book = books.find((b) => b.id === parseInt(req.params.id));
  if (book) {
    res.status(200).json(book);
  } else {
    res.status(404).send("The book with the given ID was not found");
  }
});

//to add a new book

router.post("/", (req, res) => {
  const schema = joi.object({
    title: joi.string().trim().min(3).required(),
    author: joi.string().trim().min(3).required(),
    price: joi.number().min(1).required(),
  });
  const result = schema.validate(req.body);
  if (result.error) {
    res.status(400).send(result.error.details[0].message);
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

// to get a book by title

// app.get('/api/books/:title', (req, res) => {
//    const book = books.find(b => b.title === req.params.title);
//    if(book){
//       res.status(200).json(book);
//    }else{
//       res.status(404).send('The book with the given title was not found');
//    }
// });

module.exports = router;
