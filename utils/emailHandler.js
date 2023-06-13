const nodemailer = require("nodemailer");


module.exports.sendEmail = function (email, subject, html) {
  return new Promise(async function (resolve, reject) {
    try {
      var transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: true, // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USERNAME, // generated ethereal user
          pass: process.env.SMTP_PASSWORD, // generated ethereal password
        },
      });
      var info = await transporter.sendMail({
        from: '"' + process.env.APP_NAME + ' " <' + process.env.SMTP_MAIL + ">", // sender address
        to: email, // list of receivers
        subject: subject, // Subject line
        text: html, // plain text body
        html: html, // html body
      });
      if (info) {
        resolve(true);
      } else {
        reject(false);
      }
    } catch (err) {
      console.log(err);
      reject(false);
      
    }
  });
};
