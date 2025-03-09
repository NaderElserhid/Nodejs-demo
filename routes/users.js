const express = require("express");
const router = express.Router();
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../middlewares/verifyToken");
const {
  getAllusers,
  getUserByID,
  deleteUser,
  updateUser,
} = require("../controllers/userControler");

router.route("/").get(verifyTokenAndAdmin, getAllusers);

router
  .route("/:id")
  .get(verifyTokenAndAuthorization, getUserByID)
  .delete(verifyTokenAndAuthorization, deleteUser)
  .put(verifyTokenAndAuthorization,updateUser );

router;

module.exports = router;
