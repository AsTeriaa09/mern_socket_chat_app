const mongoose = require("mongoose");
require("dotenv").config();

const connectToDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("connection successfull")
  } catch (error) {
    console.log("connection failed")
  }
};

module.exports = connectToDb;
