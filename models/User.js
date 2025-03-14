const mongoose = require("mongoose");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity")


// the schema for user 

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlegth: 5,
    maxlengh: 100,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    trim: true,
    minlegth: 5,
    maxlengh: 100,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlegth: 8,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

//valdate Register user
function validateRegisterUser(obj) {
  const schema = Joi.object({
    email: Joi.string().trim().max(100).min(5).required().email(),
    username: Joi.string().trim().max(100).min(5).required(),
    password: passwordComplexity().required(),
  });
  return schema.validate(obj);
}

//valdate login user
function validateLoginUser(obj) {
  const schema = Joi.object({
    email: Joi.string().trim().max(100).min(5).required().email(),
    password: Joi.string().trim().min(5).required(),
  });
  return schema.validate(obj);
}


//valdate change password
function validateChangePassword (obj) {
  const schema = Joi.object({
    password: Joi.string().trim().min(5).required(),
  });
  return schema.validate(obj);
}


//valdate Update user
function validateUpdateUser(obj) {
  const schema = Joi.object({
    email: Joi.string().trim().max(100).min(5).email(),
    username: Joi.string().trim().max(100).min(5),
    password: Joi.string().min(5),
    isAdmin: Joi.boolean(),
  });
  return schema.validate(obj);
}

//user model
const User = mongoose.model("User", UserSchema);

module.exports = {
  User,
  validateRegisterUser,
  validateLoginUser,
  validateUpdateUser,
  validateChangePassword,
};
