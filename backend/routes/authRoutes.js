const express = require("express");
const {verifyUser, register} = require("../controllers/authController");
const verifyToken = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/login", verifyToken);

router.post("/signup", register);

module.exports = router;