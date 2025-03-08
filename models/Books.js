const mongoose = require("mongoose");
const joi = require("joi");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 255,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Author",
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 1,
  },
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

const Book = mongoose.model("Book", bookSchema);
module.exports = { Book, validateCreateBook, validateUpdateBook };
