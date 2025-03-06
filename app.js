const express = require("express");
const booksPath = require("./routes/books");
const authorpath = require("./routes/authors");
const authPath = require("./routes/auth");
const usersPath = require("./routes/users");
const mongoose = require("mongoose");
const logger = require("./middlewares/logger");
const { notFound, errorHanlder } = require("./middlewares/errors");
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

// Use the logger middleware
app.use(logger);

// Use the books route
app.use("/api/books", booksPath);
app.use("/api/author", authorpath);
app.use("/api/auth", authPath);
app.use("/api/users", usersPath);

//Error handling middleware
app.use(notFound);
app.use(errorHanlder);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () =>
  console.log(`Server is running in ${process.env.NOODE_ENV} on port ${PORT}`)
);
