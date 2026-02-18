require('./utils/logger');
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const verifyToken = require("./middlewares/authMiddleware");

const app = express();
const PORT = process.env.PORT || 8080;

// Connection
connectDB().then(() => {
    console.log('Mongo connection established');
}).catch(err => {
    console.error('Mongo connection failed', err);
    process.exit(1);
});

require("./models/user");
require("./models/participant");
require("./models/organizer");
require("./models/event");
require("./models/merchandiseEvent");

// Middleware
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use((req, res, next) => {
    const safeBody = {...req.body};
    if (safeBody && Object.prototype.hasOwnProperty.call(safeBody, 'password')) {
        safeBody.password = '[REDACTED]';
    }
    console.log(`${req.method} ${req.path}`, safeBody);
    next();
});

// Routes
app.get("/", (req, res) => {
    res.send("SERVER ON")
});

app.use("/api/auth", authRoutes);

app.use(verifyToken);
app.use("/api/user", userRoutes);
app.use("/api/events", eventRoutes)

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));