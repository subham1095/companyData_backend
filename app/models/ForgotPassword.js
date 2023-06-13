"use strict";
const mongoose = require("mongoose");
const { Schema } = mongoose;

const ModelSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: {
      type: String,
      required: true,
      index: true,
    },
    expireTime: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Forgotpassword = mongoose.model("Forgotpassword", ModelSchema);
module.exports = Forgotpassword;
