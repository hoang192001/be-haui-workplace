const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
  secure: false,
});

const sendPasswordReset = async (mail) => {
  let info = await transporter.sendMail({
    from: mail.fromEmail, // sender address
    to: mail.toEmail, // list of receivers
    subject: mail.subject, // Subject line
    text: mail.message,
  });

  return info;
};

module.exports = { sendPasswordReset };
