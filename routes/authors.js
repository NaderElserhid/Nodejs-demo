const express = require("express");
const router = express.Router();
const joi = require("joi");

const authors = [
  {
    id: 1,
    firstName: "Paulo",
    lastName: "Coelho",
    nationality: "Brazilian",
    Image: "any image url",
  },
  {
    id: 2,
    firstName: "Nicholas",
    lastName: "Sparks",
    nationality: "American",
    Image: "any image url",
  },
];

// @dec    Get all authors
// @route  GET /api/authors
// @access Public
// @method GET
router.get("/", (req, res) => {
  res.json(authors);
});

// @dec    Get an author by id
// @route  GET /api/authors/:id
// @access Public
// @method GET
router.get("/:id", (req, res) => {
  const author = authors.find((a) => a.id === parseInt(req.params.id));
  if (author) {
    res.status(200).json(author);
  } else {
    res.status(404).send("The author with the given ID was not found");
  }
});

// @dec    Add an author
// @route  POST /api/authors
// @access Public
// @method POST
router.post("/", (req, res) => {
  const { error } = validateCreateAuthor(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  const author = {
    id: authors.length + 1,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    nationality: req.body.nationality,
    Image: req.body.Image,
  };
  authors.push(author);
  res.status(201).json(author);
});

// @dec    Update an author
// @route  PUT /api/authors/:id
// @access Public
// @method PUT
router.put("/:id", (req, res) => {
  const author = authors.find((a) => a.id === parseInt(req.params.id));
  if (author) {
    res.status(200).json({ message: "Author updated successfully" });
  } else {
    res.status(404).send("The author with the given ID was not found");
  }
  const { error } = validateUpdateAuthor(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  author.firstName = req.body.firstName;
  author.lastName = req.body.lastName;
  author.nationality = req.body.nationality;
  author.Image = req.body.Image;
  res.status(200).json(author);
});

// @dec    Delete an author
// @route  DELETE /api/authors/:id
// @access Public
// @method DELETE

router.delete("/:id", (req, res) => {
  const author = authors.find((a) => a.id === parseInt(req.params.id));
  if (author) {
    const index = authors.indexOf(author);
    authors.splice(index, 1);
    res.status(200).json({ message: "Author deleted successfully" });
  } else {
    res.status(404).send("The author with the given ID was not found");
  }
});

// to validate the author
function validateCreateAuthor(author) {
  const schema = joi.object({
    firstName: joi.string().min(3).required(),
    lastName: joi.string().min(3).required(),
    nationality: joi.string().min(3).required(),
    Image: joi.string(),
  });
  return schema.validate(author);
}

// to validate the update author
function validateUpdateAuthor(author) {
  const schema = joi.object({
    firstName: joi.string().min(3),
    lastName: joi.string().min(3),
    nationality: joi.string().min(3),
    Image: joi.string(),
  });
  return schema.validate(author);
}

module.exports = router; //export the router
