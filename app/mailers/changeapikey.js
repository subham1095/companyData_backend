const ejs = require("ejs");
const path = require("path");
const { sendEmail } = require("../../utils/emailHandler");

module.exports = async (email, name, apiKey) => {
  return new Promise(function (resolve, reject) {
    let subject = process.env.APP_NAME + " - Access Manager Api Key Change";
    ejs.renderFile(
      path.join(__dirname, "../emailTemplates", "changeapikey.ejs"),
      { name, apiKey },
      async (err, html) => {
        if (err) {
          console.log(err);
          reject(false);
        } else {
          let isSent = await sendEmail(email, subject, html);
          resolve(isSent);
        }
      }
    );
  });
};
