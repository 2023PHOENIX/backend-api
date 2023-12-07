const mongoose = require("mongoose");

const weekListSchema = new mongoose.Schema({
  desc: {
    type: String,
    required: true,
  },
  checked: {
    type: Boolean,
    default: false,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    immutable: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});

const UserSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    immutable: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },

  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  weekList: [[weekListSchema]],
});

module.exports = new mongoose.model("user", UserSchema);
