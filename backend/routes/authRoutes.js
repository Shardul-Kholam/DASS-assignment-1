const express = require("express");
const {verifyUser, register} = require("../controllers/authController");
const router = express.Router();

router.route("/login")
    .post(verifyUser);

router.route("/signup")
    .post(register);

module.exports = router;