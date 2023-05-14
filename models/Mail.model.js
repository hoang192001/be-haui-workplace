const mongoose = require("mongoose");

const mailSchema = new mongoose.Schema({
  toEmail: String,
  fromEmail: String,
  subject: String,
  message: String,
  confirmCode: String
});

module.exports = mongoose.model("Mail", mailSchema);
