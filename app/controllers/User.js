const { errorHandler } = require("../../utils/errorHandler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { commonResponse } = require("../../utils/responseHelper");
const { MESSAGES } = require("../../utils/constants");
const { generateToken } = require("../../utils/jwt");
const { generateRandomPassword } = require("../../utils/utils");
const moment = require("moment");
const User = require("../models/User");
const Forgotpassword = require("../models/ForgotPassword");
const Loginsession = require("../models/LoginSession");
const Companydata = require("../models/CompanyData");
const Accessmanager = require("../models/AccessManager");
const registrationMailer = require("../mailers/registration");
const forgotPasswordMailer = require("../mailers/forgotpassword");
const resetPasswordMailer = require("../mailers/resetpassword");
const { status } = require("express/lib/response");

module.exports.loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;
    let userAgent = req.useragent;
    let user = await User.findOne({ email, status: true });
    if (user) {
      bcrypt.compare(password, user.password, async (err, result) => {
        if (err) return res.json(commonResponse(false, MESSAGES.INVALID_LOGIN));
        if (result) {
          const token = generateToken({ userId: user._id, email: user.email, name: user.name });
          await Loginsession.create({
            userId: user._id,
            token,
            deviceDetails: userAgent,
            expireAt: moment().add(process.env.SESSION_EXPIRE_DAY, "day").toDate(),
          });
          return res.json(commonResponse(true, MESSAGES.LOGIN_SUCCESS, { token ,  email:user.email, name: user.name}));
        } else {
          return res.json(commonResponse(false, MESSAGES.INVALID_LOGIN));
        }
      });
    } else {
      return res.json(commonResponse(false, MESSAGES.USER_DOES_NOT_EXIST));
    }
  } catch (err) {
    const { status, message, error } = errorHandler(err);
    return res.status(status).json(commonResponse(false, message, error));
  }
};

module.exports.logoutUser = async (req, res) => {
  try {
    let token = req.token;
    let loginSession = await Loginsession.findOne({ token });
    if (loginSession) {
      loginSession.expiredAt = moment().toDate();
      await loginSession.save();
      return res.json(commonResponse(true, MESSAGES.LOGOUT_SUCCESS));
    } else {
      return res.json(commonResponse(false, MESSAGES.USER_NOT_LOGGED_IN));
    }
  } catch (err) {
    const { status, message, error } = errorHandler(err);
    return res.status(status).json(commonResponse(false, message, error));
  }
};

module.exports.registerUser = async (req, res) => {
  try {
    let { name, email } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      return res.json(commonResponse(false, MESSAGES.USER_ALREADY_EXISTS));
    }
    let password = generateRandomPassword();
    bcrypt.hash(password, 10, async (err, hash) => {
      if (err) return res.json(commonResponse(false, MESSAGES.SERVER_ERROR));
      let newUser = new User({
        name,
        email,
        password: hash,
      });
      await newUser.save();
      registrationMailer(email, name, password).catch((error) => {});
      return res.json(commonResponse(true, MESSAGES.REGISTER_SUCCESS));
    });
  } catch (err) {
    const { status, message, error } = errorHandler(err);
    return res.status(status).json(commonResponse(false, message, error));
  }
};

module.exports.updateUser = async (req, res) => {
  try {
    let { _id, name, email, status } = req.body;
    let { userId } = req.authData.data;
    let user = await User.findById(_id);
    if (userId == _id && status != user.status) {
      return res.json(commonResponse(false, MESSAGES.USER_CANNOT_UPDATE_SELF));
    }
    if (user.email != email) {
      let checkSameEmailUser = await User.findOne({ email });
      if (checkSameEmailUser) {
        return res.json(commonResponse(false, MESSAGES.EMAIL_ALREADY_IN_USE));
      }
    }
    if (user) {
      user.name = name;
      user.email = email;
      user.status = status;
      await user.save();
      return res.json(commonResponse(true, MESSAGES.UPDATE_SUCCESS));
    } else {
      return res.json(commonResponse(false, MESSAGES.USER_DOES_NOT_EXIST));
    }
  } catch (err) {
    const { status, message, error } = errorHandler(err);
    return res.status(status).json(commonResponse(false, message, error));
  }
};

module.exports.getUsers = async (req, res) => {
  try {
    let users = await User.find().select("-password");
    return res.json(commonResponse(true, users.length > 0 ? MESSAGES.DATA_FOUND : MESSAGES.NO_DATA_FOUND, users));
  } catch (err) {
    const { status, message, error } = errorHandler(err);
    return res.status(status).json(commonResponse(false, message, error));
  }
};

module.exports.getUser = async (req, res) => {
  try {
    let { _id } = req.params;
    let user = await User.findById(_id).select("-password");
    return res.json(commonResponse(true, user ? MESSAGES.DATA_FOUND : MESSAGES.NO_DATA_FOUND, user));
  } catch (err) {
    const { status, message, error } = errorHandler(err);
    return res.status(status).json(commonResponse(false, message, error));
  }
};

module.exports.forgetUser = async (req, res) => {
  try {
    let { email } = req.body;
    let user = await User.findOne({email});
    // console.log(user)
    if (user) {
      const token = jwt.sign({ userId: user._id  }, process.env.JWT_SECRET, { expiresIn: process.env.SESSION_EXPIRE_FORGOTPASSWORD });
      //  console.log(token);
      let ForgetUser = new Forgotpassword({
        userId: user._id,
        token,
        expireTime: moment().add(process.env.SESSION_EXPIRE_FORGOTPASSWORD, "minute").toDate(),
      });
      await ForgetUser.save();
      forgotPasswordMailer(email, user.name, token).catch((error) => {});
      return res.json(commonResponse(true, MESSAGES.FORGOT_PASSWORD));
    }
    else {
      return res.json(commonResponse(false, MESSAGES.USER_DOES_NOT_EXIST));
    }
    
  } catch (err) {
    const { status, message, error } = errorHandler(err);
    return res.status(status).json(commonResponse(false, message, error));
  }
};

module.exports.resetPassword = async (req, res) => {
  try {
    let {  password } = req.body;
    let token = req.headers["authorization"];
    
      try {
        let data = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(data);
        let checkForgotPassword = await Forgotpassword.findOne({userId:data.userId,token});
        // console.log(checkForgotPassword);
        let user = await User.findOne({_id:data.userId})
        // console.log(user);
        if(checkForgotPassword){
        bcrypt.hash(password, 10, async (err, hash) => {
          if (err) return res.json(commonResponse(false, MESSAGES.SERVER_ERROR));
       
          user.password=hash
          await user.save();
           resetPasswordMailer(user.email, user.name).catch((error) => {});
          return res.json(commonResponse(true, MESSAGES.PASSWORD_CHANGED));
        });
      }
      } catch (err) {
        return res.status(401).json(commonResponse(false, MESSAGES.INVALID_TOKEN));
      }
  } catch (err) {
    const { status, message, error } = errorHandler(err);
    return res.status(status).json(commonResponse(false, message, error));
  }
};

module.exports.getDashboard = async (req, res) => {
  try {
    let users = await User.countDocuments();
    let accessUser = await Accessmanager.countDocuments();
    let companyDataCount = await Companydata.countDocuments();
    let data = {
      accessUser:accessUser,
      companyDataCount:companyDataCount,
      users:users
    }
    return res.json(commonResponse(true, users || accessUser || companyDataCount > 0 ? MESSAGES.DATA_FOUND : MESSAGES.NO_DATA_FOUND, 
      data ));
  } catch (err) {
    const { status, message, error } = errorHandler(err);
    return res.status(status).json(commonResponse(false, message, error));
  }
};