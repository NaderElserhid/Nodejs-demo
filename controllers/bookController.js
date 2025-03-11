const asyncHandler = require("express-async-handler");
const {
  validateCreateBook,
  validateUpdateBook,
  Book,
} = require("../models/Books");
const { models } = require("mongoose");

//hi 


/**
 * @route  GET /@dec    Get all books
 * api/books
 * @access Public
 * @method GET
 */
const getAllbooks = asyncHandler(async (req, res) => {
  const { minPrice, maxPrice } = req.query;
  let books;
  if (minPrice & maxPrice) {
    books = await Book.find({
      price: { $gte: minPrice, $lte: maxPrice },
    }).populate("author");
  } else {
    books = await Book.find().populate("author");
  }
  res.status(200).json(books);
});

// @dec    Get a book by id
// @route  GET /api/books/:id
// @access Public
// @method GET


const getBookById =   asyncHandler(async (req, res) => {
    const book = await Book.findById(req.params.id);
    if (book) {
      res.status(200).json(book);
    } else {
      res.status(404).send("The book with the given ID was not found");
    }
  });


// @dec    Create new book
// @route  post /api/books
// @access Public
// @method post
  const createNewBook = 
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
  });


  
  // @dec    Update a book
  // @route  PUT /api/books/:id
  // @access private
  // @method PUT

  const updateBook =   asyncHandler(async (req, res) => {
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
    });


    // @dec    Delete a book
    // @route  DELETE /api/books/:id
    // @access private
    // @method DELETE
 const deleteBook =   asyncHandler(async (req, res) => {
    const book = await Book.findById(req.params.id);
    if (book) {
      await book.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Book deleted successfully" });
    } else {
      res.status(404).send("The book with the given ID was not found");
    }
  })

module.exports = {
    getAllbooks,
    getBookById,
    createNewBook,
    updateBook,
    deleteBook
};