const express = require("express");
const router = express.Router();
const {
  getAllbooks,
  getBookById,
  createNewBook,
  updateBook,
  deleteBook,
} = require("../controllers/bookController");
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");

router.route("/")
      .get(getAllbooks)
      .post(verifyTokenAndAdmin, createNewBook);

router
  .route("/:id")
  .get(getBookById)
  .put(verifyTokenAndAdmin, updateBook)
  .delete(verifyTokenAndAdmin, deleteBook);

module.exports = router;
