const express = require("express");
const {createEvent, getAllEvents, registerForEvent} = require("../controllers/eventController");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/", getAllEvents);

router.post("/create", authMiddleware, createEvent);

router.post("/:eventId/register", authMiddleware,registerForEvent);

module.exports = router;