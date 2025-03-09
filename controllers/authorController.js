const {
  Author,
  validateCreateAuthor,
  validateUpdateAuthor,
} = require("../models/Author");
const asyncHandler = require("express-async-handler");

// @dec    Get all authors
// @route  GET /api/authors
// @access Public
// @method GET

const getAllAuthors = asyncHandler(async (req, res) => {
  const { pageNumber } = req.query;
  let authors;
  if (pageNumber) {
    authors = await Author.find()
      .skip((pageNumber - 1) * 2)
      .limit(2);
  } else {
    authors = await Author.find();
  }
  res.status(200).json(authors);
});

// @dec    Get an author by id
// @route  GET /api/authors/:id
// @access Public
// @method GET

const getAuthorByID = asyncHandler(async (req, res) => {
  const author = await Author.findById(req.params.id);
  if (author) {
    res.status(200).json(author);
  } else {
    res.status(404).send("The author with the given ID was not found");
  }
});

// @dec    Add an author
// @route  POST /api/authors
// @access private
// @method POST

const createNewAuthor = asyncHandler(async (req, res) => {
  const { error } = validateCreateAuthor(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  const author = new Author({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    nationality: req.body.nationality,
    Image: req.body.Image,
  });

  const result = await author.save();

  res.status(201).json(result);
});

// @dec    Update an author
// @route  PUT /api/authors/:id
// @access private
// @method PUT
const updateAuthor = asyncHandler(async (req, res) => {
  const { error } = validateUpdateAuthor(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
  }

  const author = await Author.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        nationality: req.body.national,
        image: req.body.image,
      },
    },
    { new: true }
  );
  res.status(200).json(author);
});

// @dec    Delete an author
// @route  DELETE /api/authors/:id
// @access private
// @method DELETE
const deleteAuthor = asyncHandler(async (req, res) => {
  const author = await Author.findById(req.params.id);
  if (!author) {
    return res.status(404).send("The author with the given ID was not found");
  }
  await Author.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: "Author deleted successfully" });
});

module.exports = {
  getAllAuthors,
  getAuthorByID,
  createNewAuthor,
  updateAuthor,
  deleteAuthor,
};
