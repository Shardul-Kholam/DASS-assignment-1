const Event = require('../models/event');
const logger = require('../utils/logger');

const createEvent = async (req, res) => {
    try {
        if (req.user.role !== 'ORGANIZER' && req.user.role !== 'ADMIN') {
            logger.warn(`Unauthorized event creation attempt by user: ${req.user.userID}`);
            return res.status(403).json({error: "Access denied. Only Organizers can create events."});
        }

        const {
            Name,
            description,
            eligibility,
            registrationDeadline,
            startDate,
            endDate,
            registrationLimit,
            registrationFee,
            tags
        } = req.body;

        const newEvent = new Event({
            Name,
            description,
            eligibility,
            registrationDeadline,
            startDate,
            endDate,
            registrationLimit,
            registrationFee,
            tags,
            orgID: req.user.userID
        });

        await newEvent.save();
        logger.info(`Event created: ${newEvent._id} by ${req.user.userID}`);
        res.status(201).json({msg: "Event created successfully", event: newEvent});
    } catch (err) {
        logger.error("Failed to create event", {error: err.message});
        res.status(500).json({error: "Failed to create event"});
    }
};

const getAllEvents = async (req, res) => {
    try {
        const events = await Event.find().populate('orgID', 'organizerName email');
        res.status(200).json(events);
    } catch (err) {
        logger.error("Could not fetch events", {error: err.message});
        res.status(500).json({error: "Could not fetch events"});
    }
};

const registerForEvent = async (req, res) => {
    try {
        const {eventId} = req.params;
        const participantId = req.user.userID;

        if (req.user.role !== 'PARTICIPANT') {
            return res.status(403).json({error: "Only participants can register"});
        }

        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({error: "Event not found"});

        if (new Date() > new Date(event.registrationDeadline)) {
            return res.status(400).json({error: "Registration deadline passed"});
        }

        const alreadyReg = event.registrations.some(r => r.participantId.toString() === participantId);
        if (alreadyReg) {
            return res.status(400).json({error: "Already registered"});
        }

        // Check registration limit
        const updatedEvent = await Event.findOneAndUpdate(
            {
                _id: eventId,
                $expr: { $lt: [{ $size: "$registrations" }, "$registrationLimit"] }
            },
            {
                $push: { registrations: { participantId, registeredAt: new Date() } }
            },
            { new: true }
        );

        if (!updatedEvent) return res.status(400).json({error: "Registration limit reached"});

        logger.info(`User ${participantId} registered for ${eventId}`);
        res.status(200).json({msg: "Registration successful", ticketId: updatedEvent._id});

    } catch (err) {
        logger.error("Registration failed", {error: err.message});
        res.status(500).json({error: "Registration failed due to server error"});
    }
};

const updateEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const updates = req.body;
        const userId = req.user.userID;

        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }

        // Authorization: Only the organizer who created it can update it
        if (event.orgID.toString() !== userId && req.user.role !== 'ADMIN') {
            return res.status(403).json({ error: "Unauthorized to update this event" });
        }

        // Prevent updating critical fields if necessary (e.g., orgID)
        delete updates.orgID;
        delete updates.registrations; // specific endpoint for logic handling

        const updatedEvent = await Event.findByIdAndUpdate(eventId, updates, { new: true });
        logger.info(`Event updated: ${eventId} by ${userId}`);
        res.status(200).json({ msg: "Event updated successfully", event: updatedEvent });

    } catch (err) {
        logger.error("Update failed", { error: err.message, eventId: req.params.eventId });
        res.status(500).json({ error: "Update failed" });
    }
};

const deleteEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const userId = req.user.userID;

        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }

        if (event.orgID.toString() !== userId && req.user.role !== 'ADMIN') {
            return res.status(403).json({ error: "Unauthorized to delete this event" });
        }

        await Event.findByIdAndDelete(eventId);
        logger.info(`Event deleted: ${eventId} by ${userId}`);
        res.status(200).json({ msg: "Event deleted successfully" });

    } catch (err) {
        logger.error("Delete failed", { error: err.message, eventId: req.params.eventId });
        res.status(500).json({ error: "Delete failed" });
    }
};

module.exports = { createEvent, getAllEvents, registerForEvent, updateEvent, deleteEvent };