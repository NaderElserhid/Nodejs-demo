const express = require("express");
const booksPath = require("./routes/books");

//init app
const app = express();

// Apply middleware
app.use(express.json());

// Use the books route
app.use("/api/books", booksPath);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
