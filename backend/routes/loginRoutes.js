const express = require("express");
const {verifyUser} = require("../controllers/loginController");
const router = express.Router();

router.route("/")
    .post(verifyUser);

module.exports = router;