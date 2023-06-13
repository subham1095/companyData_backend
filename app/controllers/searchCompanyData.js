const { errorHandler } = require("../../utils/errorHandler");
const { commonResponse } = require("../../utils/responseHelper");
const { MESSAGES } = require("../../utils/constants");
const Companydata = require("../models/CompanyData");


module.exports.searchCompanyData = async (req, res) => {
    try {
      let {pageno, limit} = req.query;
      pageno = pageno ? pageno : process.env.DEFAULT_PAGE_NO;
      limit = limit ? limit : process.env.DEFAULT_PAGE_LENGTH;
      let skip = pageno ? (pageno*limit)-limit:pageno;
 
    let companyData = await Companydata.find({
      "$or":[
              { name:{$regex:req.query.search, $options:'$i'}},           
              { cin:{$regex:req.query.search, $options:'$i'}},
              { industrial_Class:{$regex:req.query.search, $options:'$i'}},
              { address:{$regex:req.query.search, $options:'$i'}},
              { email:{$regex:req.query.search, $options:'$i'}},
              { state:{$regex:req.query.search, $options:'$i'}},
              { businessType:{$regex:req.query.search, $options:'$i'}},
          ]
    }).limit(limit).skip(skip);

    let totalCount = await Companydata.countDocuments();

    let result = { rows: companyData, total: totalCount};

    return res.json(commonResponse(true, MESSAGES.DATA_FOUND , result));
  
  
    } catch (err) {
      const { status, message, error } = errorHandler(err);
      return res.status(status).json(commonResponse(false, message, error));
    }
  };