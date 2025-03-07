const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { User, validateUpdateUser } = require("../modules/User");
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../middlewares/verifyToken");

// @desc    Get all users (Admin only)
// @route   GET /users
// @access  Private (Admin)
router.get(
  "/",
  verifyTokenAndAdmin,
  asyncHandler(async (req, res) => {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  })
);

// @desc    Get a single user (User himself)
// @route   GET /users/:id
// @access  Private (User)
router.get(
  "/:id",
  verifyTokenAndAuthorization,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select("-password");
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  })
);

// @desc    Delete user (User himself)
// @route   DELETE /users/:id
// @access  Private (User)
router.delete(
  "/:id",
  verifyTokenAndAuthorization,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "User has been deleted successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  })
);

// @desc    Update User
// @route   PUT /users/:id
// @access  Private (User)

router.put(
  "/:id",
  verifyTokenAndAuthorization,
  asyncHandler(async (req, res) => {
    if (req.user.id !== req.params.id) {
      return res.status(403).json({
        message: "You are not allowed, you can only update your profile",
      });
    }

    const { error } = validateUpdateUser(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          email: req.body.email,
          password: req.body.password,
          username: req.body.username,
        },
      },
      { new: true }
    ).select("-password");

    res.status(200).json(updatedUser);
  })
);

module.exports = router;
