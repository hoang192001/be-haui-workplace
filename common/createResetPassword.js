const crypto = require('crypto');
const moment = require('moment-timezone');

const generateCode = (length) => {
  let code = "";
  for (let i = 0; i < length; i++) {
      code += Math.floor(Math.random() * 10);
  }
  return code;
};

module.exports = { generateCode };
