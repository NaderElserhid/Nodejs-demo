const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { User, validateUpdateUser } = require("../modules/User");
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../middlewares/verifyToken");

// @dec    get all users
// @route  POST /users
// @access public
// @method get (admin only )

router.get(
  "/",
  verifyTokenAndAdmin,
  asyncHandler(async (req, res) => {
    const users = await User.find().select("-password"); // Corrected syntax
    res.status(200).json(users);
  })
);

// @dec    get all users
// @route  POST /users
// @access public
// @method get (usre himslef )

router.get(
  "/",
  verifyTokenAndAuthorization,
  asyncHandler(async (req, res) => {
    const users = await User.findById().select("-password"); // Corrected syntax
   if(user){
    res.status(200).json(users);
   }else{
    res.status(404).json({message : "user not found"})
   }
  })
);

// @dec    Delete users
// @route  POST /users/:id
// @access public
// @method  Delete  (usre himslef )


router.get(
  "/:id",
  verifyTokenAndAuthorization,
  asyncHandler(async (req, res) => {
    const users = await User.findById().select("-password"); // Corrected syntax
   if(user){
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({message : "has been deleted successfully"});
   }else{
    res.status(404).json({message : "user not found"})
   }
  })
);

// @dec    update User
// @route  POST /users/:id
// @access privet
// @method Put

router.put(
  "/:id",
  verifyTokenAndAuthorization,
  asyncHandler(async (req, res) => {
    if (req.user.id !== req.params.id) {
      return res
        .status(403)
        .json({
          message: "you are not allowed , you can only up datat your peofile",
        });
    }
    const { error } = validateUpdateUser(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    console.log(req.headers);

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    const UpdateUser = await User.findByIdAndUpdate(
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
    res.status(200).json(UpdateUser);
  })
);

module.exports = router;
