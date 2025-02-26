const e = require("express");
const express = require("express");
const app = express();

// Apply middleware
app.use(express.json());

//make an object of books each book has id, title, author, price
let books = [
  { id: 1, title: "The Alchemist", author: "Paulo Coelho", price: 10 },
  { id: 2, title: "The Notebook", author: "Nicholas Sparks", price: 15 },
  { id: 3, title: "The Da Vinci Code", author: "Dan Brown", price: 12 },
];

app.get("/api/books", (req, res) => {
  res.json(books);
});

// to get a book by id
app.get("/api/books/:id", (req, res) => {
  const book = books.find((b) => b.id === parseInt(req.params.id));
  if (book) {
    res.status(200).json(book);
  } else {
    res.status(404).send("The book with the given ID was not found");
  }
});

//to add a new book

app.post("/api/books", (req, res) => {
  if (!req.body.title || req.body.title.length < 3) {
    return res
      .status(400)
      .send("Title is required and should be minimum 3 characters");
  }

  if (!req.body.author || req.body.author.length < 5) {
    return res
      .status(400)
      .send("Author is required and should be minimum 5 characters");
  }

  if (!req.body.price || req.body.price < 5) {
    return res.status(400).send("price is required and should be mlore than 5");
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

const PORT = 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
