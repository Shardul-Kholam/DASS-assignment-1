const mongoose = require("mongoose");
const logger = require("../utils/logger");
require("dotenv").config();

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is not defined in environment variables");
        }
        await mongoose.connect(process.env.MONGO_URI);
        logger.info("Connected to MongoDB!!!");
    } catch (err) {
        logger.error("Error connecting to MongoDB", { error: err.message });
        process.exit(1);
    }
}

module.exports = connectDB;