"use strict";
const mongoose = require("mongoose");
const { Schema } = mongoose;

const ModelSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

ModelSchema.virtual("loginSessions", {
  ref: "Loginsession",
  localField: "_id",
  foreignField: "userId",
});

ModelSchema.virtual("forgotPasswords", {
  ref: "Forgotpassword",
  localField: "_id",
  foreignField: "userId",
});

ModelSchema.virtual("uploadLogs", {
  ref: "Uploadlog",
  localField: "_id",
  foreignField: "userId",
});

const User = mongoose.model("User", ModelSchema);
module.exports = User;
