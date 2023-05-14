
require("dotenv").config();

module.exports = () => ({
  port: +process.env.PORT || 8001,
  database: {
    MONGO_URI:
      process.env.MONGO_URI || "mongodb://localhost:27017/work-app",
  },
  JWT_SECRET: process.env.JWT_SECRET || "abcxyz",
  NODE_ENV: process.env.NODE_ENV || "development",
  MAX_FILE_SIZE: 5242880, // 5MB
});