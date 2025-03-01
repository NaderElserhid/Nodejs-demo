const express = require("express");
const booksPath = require("./routes/books");
const authorpath = require("./routes/authors");
const mongoose = require("mongoose");

//connect to mongodb
mongoose
  .connect("mongodb://localhost/bookstoreDB")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB"));

//init app
const app = express();

// Apply middleware
app.use(express.json());

// Use the books route
app.use("/api/books", booksPath);
app.use("/api/author", authorpath);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
