const mongoose = require("mongoose");
const joi = require("joi");

const authorSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 255,
    },
    lastName: {
      type: String,
      trim: true,
      required: true,
      minlength: 3,
      maxlength: 255,
    },
    nationality: {
      type: String,
      trim: true,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 255,
    },
    image: {
      type: String,
      default: "default-avatar.png",
    },
  },
  { timestamps: true }
);

// to validate the author
function validateCreateAuthor(author) {
  const schema = joi.object({
    firstName: joi.string().min(3).max(255).required().trim(),
    lastName: joi.string().min(3).max(255).required().trim(),
    nationality: joi.string().min(3).max(255).required().trim(),
    Image: joi.string(),
  });
  return schema.validate(author);
}

// to validate the update author
function validateUpdateAuthor(author) {
  const schema = joi.object({
    firstName: joi.string().min(3).trim(),
    lastName: joi.string().min(3).trim(),
    nationality: joi.string().min(3).trim(),
    Image: joi.string(),
  });
  return schema.validate(author);
}

const Author = mongoose.model("Author", authorSchema);

module.exports = { Author, validateCreateAuthor, validateUpdateAuthor };
