const express = require("express");
const {
    createEvent,
    getAllEvents,
    registerForEvent,
    updateEvent,
    deleteEvent
} = require("../controllers/eventController");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

// Public
router.get("/", getAllEvents);

// Protected Routes
router.post("/create", authMiddleware, createEvent);
router.post("/:eventId/register", authMiddleware, registerForEvent);
router.put("/:eventId", authMiddleware, updateEvent);
router.delete("/:eventId", authMiddleware, deleteEvent);

module.exports = router;