const jwt = require("jsonwebtoken");
const { MESSAGES } = require("./constants");
const { commonResponse } = require("./responseHelper");
const JWT_SECRET = process.env.JWT_SECRET;

const generateToken = (data) => {
  return jwt.sign({ data }, JWT_SECRET, { expiresIn: process.env.SESSION_EXPIRE_DAY + "d" });
};
const validateToken = (req, res, next) => {
  let token = req.headers["authorization"];
  if (token && typeof token !== "undefined") {
    try {
      let data = jwt.verify(token, JWT_SECRET);
      req.token = token;
      req.authData = data;
      next();
    } catch (err) {
      return res.status(401).json(commonResponse(false, MESSAGES.INVALID_TOKEN));
    }
  } else {
    return res.status(401).json(commonResponse(false, MESSAGES.INVALID_TOKEN));
  }
};

module.exports = { generateToken, validateToken };
