const express = require("express");
const connectDB = require("./config/db");
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const verifyToken = require("./middlewares/authMiddleware");

const app = express();
const PORT = 8080;

// Connection
connectDB().then(async () => {}).catch();

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Routes
app.get("/", (req, res) => {
    res.send("SERVER ON")
});

app.use("/auth", authRoutes);

app.use(verifyToken);
app.use("/user", userRoutes);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));