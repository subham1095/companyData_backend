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
    deviceDetails: {
      type: Object,
    },
    expireAt: {
      type: Date,
    },
    expiredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Loginsession = mongoose.model("Loginsession", ModelSchema);
module.exports = Loginsession;
