const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async (next) => {
    mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected Successfully!"))
    .catch((err) => next(err));
}

module.exports = connectDB;