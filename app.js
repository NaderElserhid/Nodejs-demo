const express = require("express");
const logger = require("./middlewares/logger");
const { notFound, errorHanlder } = require("./middlewares/errors");
require("dotenv").config();
const coonectToDB = require("./config/db")


//connect to mongodb
coonectToDB();


//init app
const app = express();

// Apply middleware
app.use(express.json());

// Use the logger middleware
app.use(logger);

// Use the books route
app.use("/api/books", require("./routes/books"));
app.use("/api/author", require("./routes/authors"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users",  require("./routes/users"));

//Error handling middleware
app.use(notFound);
app.use(errorHanlder);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () =>
  console.log(`Server is running in ${process.env.NOODE_ENV} on port ${PORT}`)
);
