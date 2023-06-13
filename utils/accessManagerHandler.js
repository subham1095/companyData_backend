const { MESSAGES } = require("./constants");
const { commonResponse } = require("./responseHelper");
const Accessmanager = require("../app/models/AccessManager");

const validateApiKey = async (req, res, next)  => {
    let api = req.query.apikey;
    if (api && typeof api !== "undefined") {
      
      try {
        let accessManagers = await Accessmanager.findOne({apiKey:api, status:true});
        if(!accessManagers){
            return res.status(401).json(commonResponse(false, MESSAGES.INVALID_API));
        }
          next();
      } catch (err) {
        return res.status(401).json(commonResponse(false, MESSAGES.INVALID_API));
      }
    } else {
      return res.status(401).json(commonResponse(false, MESSAGES.INVALID_API));
    }
  };
  
  module.exports = { validateApiKey };