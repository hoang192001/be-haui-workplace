const mongoose = require("mongoose");
const configuration = require("./configuration");
mongoose.set('strictQuery', true);
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(configuration().database.MONGO_URI);

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.log(`Error to connect db: ${err.message}`);
  }
};

module.exports = connectDB;
