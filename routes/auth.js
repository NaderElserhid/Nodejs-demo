const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const {
  User,
  validateLoginUser,
  validateRegisterUser,
} = require("../modules/User");

// @dec    Register New author
// @route  POST /api/auth
// @access Public
// @method POST

router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { error } = validateRegisterUser(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
    }
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res
        .status(400)
        .json({ message: "this user is already registered" });
    }
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);

    user = new User({
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      isAdmin: req.body.isAdmin,
    });
    const result = await user.save();
    const token = jwt.sign({id: user._id ,username : user.username} , "secretKey")
    const { password, ...other } = result._doc;

    res.status(201).json({ ...other, token });
  })
);

// @dec    login user
// @route  POST /api/login
// @access Public
// @method POST

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { error } = validateLoginUser(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
    }
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "invalid email or password" });
    }
    const isPasswordMatch = await bcrypt.compare(req.body.password,user.password);

    if (!isPasswordMatch) {
    return res.status(400).json({ message: "invalid email or password" });
    }
    // this for token 
    const token = null;
    const { password, ...other } = user._doc;

    res.status(200).json({ ...other, token });
  })
);

module.exports = router;
