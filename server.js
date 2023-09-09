const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const useragent = require("express-useragent");
dotenv.config();

const app = express();
const path = require("path");
const { connection } = require("./config/connection");

// user agent parser
app.use(useragent.express());

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});
app.use(function returnOps(req, res, next) {
  if (req.method === "OPTIONS") return res.status(200).send("OK my subham").end();
  next();
});

// create a db connection globally
mongoose.Promise = global.Promise;
mongoose.connect(connection);
mongoose.set("strictQuery", false);
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//   console.log('connected')
// });

app.use(require("./app/routes"));

// create tables automatically
const User = require("./app/models/User");
const Accessmanager = require("./app/models/AccessManager");
const Companydata = require("./app/models/CompanyData");
const Forgotpassword = require("./app/models/ForgotPassword");
const Loginsession = require("./app/models/LoginSession");
const Uploadlog = require("./app/models/UploadLog");

(async () => {
  // initially feed data if no user exists create one
  let users = await User.find({});
  if (users.length == 0) {
    bcrypt.hash("admin", 10, async (err, hash) => {
      if (!err) {
        await User.create({ name: "Admin", password: hash, email: "subhamchowdhury57@gmail.com" });
      }
    });
  }
})();

const PORT = process.env.SERVER_PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
