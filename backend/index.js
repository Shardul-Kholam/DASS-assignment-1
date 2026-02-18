// Imports
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const logger = require("./utils/logger");
const cookieParser = require("cookie-parser");

// Routes
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const verifyToken = require("./middlewares/authMiddleware");

// Models
require("./models/user");
require("./models/participant");
require("./models/organizer");
require("./models/event");
require("./models/merchandiseEvent");

const app = express();
const PORT = process.env.PORT || 8080;

// Connection
connectDB().then(() => {
    logger.info('Mongo connection established');
}).catch(err => {
    logger.error('Mongo connection failed', {error: err});
    process.exit(1);
});

// Middleware
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000').split(',');
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cookieParser());

app.use(morgan('dev', {
    stream: {write: message => logger.info(message.trim())}
}));

// Routes
app.get("/", (req, res) => {
    res.send("SERVER ON")
});

app.use("/api/auth", authRoutes);

app.use(verifyToken);
app.use("/api/user", userRoutes);
app.use("/api/events", eventRoutes)

// Listener
app.listen(PORT, () => logger.info(`Server is running on port ${PORT}`));