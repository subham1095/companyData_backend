const { errorHandler } = require("../../utils/errorHandler");
const { commonResponse } = require("../../utils/responseHelper");
const { MESSAGES } = require("../../utils/constants");
const { generateUUID } = require("../../utils/utils");
const Accessmanager = require("../models/AccessManager");
const accessregistration = require("../mailers/accessregistration");
const changeapikey = require("../mailers/changeapikey");
const deactivateaccessmanager = require("../mailers/deactivateaccessmanager");
const activateaccessmanager = require("../mailers/activateaccessmanager");

module.exports.getAccessManagers = async (req, res) => {
  try {
    let accessManagers = await Accessmanager.find();
    return res.json(
      commonResponse(true, accessManagers.length > 0 ? MESSAGES.DATA_FOUND : MESSAGES.NO_DATA_FOUND, accessManagers)
    );
  } catch (err) {
    const { status, message, error } = errorHandler(err);
    return res.status(status).json(commonResponse(false, message, error));
  }
};
module.exports.grantAccess = async (req, res) => {
  try {
    let { name, email } = req.body;
    let accessManager = await Accessmanager.findOne({ email });
    if (accessManager) {
      return res.json(commonResponse(false, MESSAGES.EMAIL_ALREADY_EXIST));
    } else {
      let apiKey= generateUUID();
      accessManager = new Accessmanager({
        name,
        email,
        apiKey
      });
      await accessManager.save();
      accessregistration(email, name, apiKey).catch((error) => {});
      return res.json(commonResponse(true, MESSAGES.ACCESS_GRANTED, { apiKey: accessManager.apiKey }));
    }
  } catch (err) {
    const { status, message, error } = errorHandler(err);
    return res.status(status).json(commonResponse(false, message, error));
  }
};

module.exports.changeApikey = async (req, res) => {
  try {
    let { _id } = req.body;
    let accessManager = await Accessmanager.findById(_id);
    // console.log(accessManager.name);
    if (accessManager) {
      accessManager.apiKey = generateUUID();
      await accessManager.save();
       changeapikey( accessManager.email,accessManager.name,accessManager.apiKey).catch((error) => {});
      return res.json(commonResponse(true, MESSAGES.API_KEY_CHANGED, { apiKey: accessManager.apiKey }));
    } else {
      return res.json(commonResponse(false, MESSAGES.USER_DOES_NOT_EXIST));
    }
  } catch (err) {
    const { status, message, error } = errorHandler(err);
    return res.status(status).json(commonResponse(false, message, error));
  }
};



module.exports.updateAccessManager = async (req, res) => {
  try {
    let { _id, name, email, status } = req.body;
    let accessManager = await Accessmanager.findById(_id);
    if (accessManager.email != email) {
      let checkSameEmail = await Accessmanager.findOne({ email });
      if (checkSameEmail) {
        return res.json(commonResponse(false, MESSAGES.EMAIL_ALREADY_IN_USE));
      }
    }
    if (accessManager) {
      accessManager.name = name;
      accessManager.email = email;
      accessManager.status = status;
      await accessManager.save();
      return res.json(commonResponse(true, MESSAGES.UPDATE_SUCCESS));
    } else {
      return res.json(commonResponse(false, MESSAGES.USER_DOES_NOT_EXIST));
    }
  } catch (err) {
    const { status, message, error } = errorHandler(err);
    return res.status(status).json(commonResponse(false, message, error));
  }
};

module.exports.deactivateAccessManager = async (req, res) => {
  try {
    let { _id,  status } = req.body;
    let accessManager = await Accessmanager.findById(_id);
    if (accessManager) { 
      accessManager['status'] = status;
      await accessManager.save();
      if(accessManager.status==false){
        deactivateaccessmanager( accessManager.email,accessManager.name,accessManager.apiKey).catch((error) => {});
        return res.json(commonResponse(true, MESSAGES.API_KEY_DEACTIVATED));
      }
      else{
        activateaccessmanager( accessManager.email,accessManager.name,accessManager.apiKey).catch((error) => {});
        return res.json(commonResponse(true, MESSAGES.API_KEY_ACTIVATED));
      }
    } else {
      return res.json(commonResponse(false, MESSAGES.USER_DOES_NOT_EXIST));
    }
  } catch (err) {
    const { status, message, error } = errorHandler(err);
    return res.status(status).json(commonResponse(false, message, error));
  }
};
