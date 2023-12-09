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
  completedAt: {
    type: Date,
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
  weekList: [
    {
      list: [weekListSchema],
      createdAt: {
        type: Date,
        default: Date.now,
        immutable: true,
      },
      status: {
        type: String,
        enum: ["active", "inactive", "completed"],
      },
    },
  ],
});

const User = new mongoose.model("user", UserSchema);
const weeklist = new mongoose.model("weekList", weekListSchema);
module.exports = {
  User,
  weeklist,
};
