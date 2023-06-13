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
    fileName: {
      type: String,
    },
    uploadedAt: {
      type: Date,
    },
    uploadStatus: {
      type: Object,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Uploadlog = mongoose.model("Uploadlog", ModelSchema);
module.exports = Uploadlog;
