const express = require("express");
const booksPath = require("./routes/books");
const authorpath = require("./routes/authors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

//connect to mongodb
mongoose
  .connect(process.env.MONG_URI)
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB"));

//init app
const app = express();

// Apply middleware
app.use(express.json());

// Use the books route
app.use("/api/books", booksPath);
app.use("/api/author", authorpath);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () =>
  console.log(`Server is running in ${process.env.NOODE_ENV} on port ${PORT}`)
);
