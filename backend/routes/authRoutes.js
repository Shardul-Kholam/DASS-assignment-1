const express = require("express");
const {verifyUser, register} = require("../controllers/authController");
const router = express.Router();

router.post("/login", verifyUser);

router.post("/signup", register);

module.exports = router;