const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const {
  User,
  validateLoginUser,
  validateRegisterUser,
} = require("../models/User");
const jwt = require('jsonwebtoken');

// @dec    Register New author
// @route  POST /api/register
// @access Public
// @method POST

const  register =   asyncHandler(async (req, res) => {
    const { error } = validateRegisterUser(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ message: "User already exists with the given email" });
    }

    if (!req.body.password) {
      return res.status(400).json({ message: "Password is required" });
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

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET_KEY
    );

    const { password, ...other } = result._doc;

    res.status(201).json({ ...other, token });
  })


// @desc    Login user
// @route   POST /api/login
// @access  Public

const login = asyncHandler(async (req, res) => {
  // Validate user input
  const { error } = validateLoginUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // Check if user exists
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  // Verify password
  const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
  if (!isPasswordMatch) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  // Generate JWT token
  const token = jwt.sign(
    { id: user._id, isAdmin: user.isAdmin },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "1h" } // Token expires in 1 hour
  );

  // Exclude password from response
  const { password, ...otherDetails } = user._doc;

  res.status(200).json({ ...otherDetails, token });
});


  module.exports = {
    register,
    login
  };