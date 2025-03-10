const express = require("express");
const logger = require("./middlewares/logger");
const { notFound, errorHanlder } = require("./middlewares/errors");
require("dotenv").config();
const coonectToDB = require("./config/db");
const path = require("path");
const helmet =require("helmet");
const cors = require("cors")

//connect to mongodb
coonectToDB();

//init app
const app = express();

//Static Folder 
app.use(express.static(path.join(__dirname,"images")))

// Apply middleware
app.use(express.json());
app.use(express.urlencoded({extended :false}));
// Use the logger middleware
app.use(logger);

//Hlemet
app.use(helmet());

//Set view Engine
app.set('view engine', 'ejs');

//cors policy
app.use(cors());
// Use the books route
app.use("/api/books", require("./routes/books"));
app.use("/api/author", require("./routes/authors"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/upload", require("./routes/upload"));
app.use("/password", require("./routes/password"));

//Error handling middleware
app.use(notFound);
app.use(errorHanlder);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () =>
  console.log(`Server is running in ${process.env.NOODE_ENV} on port ${PORT}`)
);
