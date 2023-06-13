const { errorHandler } = require("../../utils/errorHandler");
const { commonResponse } = require("../../utils/responseHelper");
const { MESSAGES } = require("../../utils/constants");
const Companydata = require("../models/CompanyData");
const Uploadlog = require("../models/UploadLog");
const fs = require("fs");
var xlsx = require("xlsx");

// (node --max-old-space-size=8048 server.js) while inserting huge excel file run this command once to create memory size bigger.
module.exports.uploadExcel = async (req, res) => {
  try {
    var file = xlsx.readFile(req.file.path);
    if (req.file.mimetype == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      const rows = xlsx.utils.sheet_to_json(file.Sheets[file.SheetNames[0]]);

      const firstSheet = file.Sheets[file.SheetNames[0]];
      fs.unlinkSync(req.file.path);
      excelHeaders = [];
      excelUndefined = [];

      excelUndefined.push(
        firstSheet["A1"],
        firstSheet["B1"],
        firstSheet["C1"],
        firstSheet["D1"],
        firstSheet["E1"],
        firstSheet["F1"],
        firstSheet["G1"],
        firstSheet["H1"],
        firstSheet["I1"],
        firstSheet["J1"],
        firstSheet["K1"],
        firstSheet["L1"],
        firstSheet["M1"],
        firstSheet["N1"],
        firstSheet["O1"],
        firstSheet["P1"],
        firstSheet["Q1"]
      );
      excelUndefined = excelUndefined.filter(function (element) {
        return element == undefined;
      });

      if (excelUndefined == "") {
        excelHeaders.push(
          firstSheet["A1"].v,
          firstSheet["B1"].v,
          firstSheet["C1"].v,
          firstSheet["D1"].v,
          firstSheet["E1"].v,
          firstSheet["F1"].v,
          firstSheet["G1"].v,
          firstSheet["H1"].v,
          firstSheet["I1"].v,
          firstSheet["J1"].v,
          firstSheet["K1"].v,
          firstSheet["L1"].v,
          firstSheet["M1"].v,
          firstSheet["N1"].v,
          firstSheet["O1"].v,
          firstSheet["P1"].v,
          firstSheet["Q1"].v
        );

        // console.log(excelHeaders);

        const headers = [
          "CORPORATE_IDENTIFICATION_NUMBER",
          "Company_Name",
          "Company_status",
          "Company_class",
          "Company_Category",
          "Company_sub_category",
          "DATE_OF_REGISTRATION",
          "REGISTERED_STATE",
          "AUTHORIZED_CAP",
          "PAIDUP_CAPITAL",
          "Industrial_Class",
          "PRINCIPAL_BUSINESS_ACTIVITY_AS_PER_CIN",
          "Registered_Office_Address",
          "REGISTRAR_OF_COMPANIES",
          "EMAIL_ADDR",
          "Latest_Year_AR",
          "Latest_Year_BS",
        ];
        database = await Companydata.find();
        const difference = rows.filter(
          (page1) => !database.find((page2) => page1.CORPORATE_IDENTIFICATION_NUMBER === page2.cin)
        );

        if (difference == "") {
          return res.json(commonResponse(true, MESSAGES.EXCEL_FILE_SAME));
        }
        if ((JSON.stringify(excelHeaders) == JSON.stringify(headers)) === true) {
          let ExcelData = difference.map((row) => {
            return {
              name: `${row.Company_Name}`,
              cin: `${row.CORPORATE_IDENTIFICATION_NUMBER}`,
              status: `${row.Company_status}`,
              class: `${row.Company_class}`,
              category: `${row.Company_Category}`,
              subCategory: `${row.Company_sub_category}`,
              dateOfRegistration: `${row.DATE_OF_REGISTRATION}`,
              state: `${row.REGISTERED_STATE}`,
              authorisedCapital: `${row.AUTHORIZED_CAP}`,
              paidupCapital: `${row.PAIDUP_CAPITAL}`,
              industrial_Class: `${row.Industrial_Class}`,
              businessType: `${row.PRINCIPAL_BUSINESS_ACTIVITY_AS_PER_CIN}`,
              address: `${row.Registered_Office_Address}`,
              registrar: `${row.REGISTRAR_OF_COMPANIES}`,
              email: `${row.EMAIL_ADDR}`,
              lastYearAR: `${row.Latest_Year_AR}`,
              lastYearBs: `${row.Latest_Year_BS}`,
            };
          });

          await Companydata.insertMany(ExcelData);
          let uploadStatus = await Companydata.countDocuments();
          let { userId } = req.authData.data;
          let fileName = req.file.originalname;
          let newUploadLogs = new Uploadlog({
            userId,
            fileName,
            uploadStatus,
          });
          await newUploadLogs.save();

          return res.json(commonResponse(true, MESSAGES.UPLOAD_SUCCESS));
        }
        if ((JSON.stringify(excelHeaders) == JSON.stringify(headers)) === false) {
          return res.json(commonResponse(true, MESSAGES.EXCEL_FILE));
        }
      }
      return res.json(commonResponse(true, MESSAGES.EXCEL_FILE));
    } else {
      return res.json(commonResponse(true, MESSAGES.UPLOAD_EXCEL));
    }
  } catch (err) {
    // console.log(err);
    const { status, message, error } = errorHandler(err);
    return res.status(status).json(commonResponse(false, message, error));
  }
};
