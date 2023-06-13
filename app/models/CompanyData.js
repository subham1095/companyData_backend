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
    cin: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
    status: {
      type: String,
      required: true,
      index: true,
    },
    class: {
      type: String,
      required: true,
      index: true,
    },
    category: {
      type: String,
      index: true,
    },
    subCategory: {
      type: String,
      index: true,
    },
    dateOfRegistration: {
      type: String,
      index: true,
    },
    state: {
      type: String,
      index: true,
    },
    authorisedCapital: {
      type: String,
    },
    paidupCapital: {
      type: String,
    },
    industrial_Class: {
      type: String,
      index: true,
    },
    businessType: {
      type: String,
      index: true,
    },
    address: {
      type: String,
      index: true,
    },
    registrar: {
      type: String,
      index: true,
    },
    email: {
      type: String,
      index: true,
    },
    lastYearAR: {
      type: String,
    },
    lastYearBs: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Companydata = mongoose.model("Companydata", ModelSchema);
module.exports = Companydata;
