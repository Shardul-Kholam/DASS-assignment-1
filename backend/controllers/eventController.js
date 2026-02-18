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
        logger.error("Failed to create event", { error: err.message });
        res.status(500).json({error: "Failed to create event"});
    }
};

const getAllEvents = async (req, res) => {
    try {
        const events = await Event.find().populate('orgID', 'organizerName email');
        res.status(200).json(events);
    } catch (err) {
        logger.error("Could not fetch events", { error: err.message });
        res.status(500).json({error: "Could not fetch events"});
    }
};

const registerForEvent = async (req, res) => {
    try {
        const {eventId} = req.params;
        const participantId = req.user.userID;

        if (req.user.role !== 'PARTICIPANT') {
            return res.status(403).json({error: "Only participants can register for events"});
        }

        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({error: "Event not found"});

        const alreadyReg = event.registrations.find(r => r.participantId.toString() === participantId);

        if (new Date() > new Date(event.registrationDeadline)) {
            return res.status(400).json({error: "Registration deadline passed"});
        }
        if (event.registrations.length >= event.registrationLimit) {
            return res.status(400).json({error: "Registration limit reached"});
        }
        if (alreadyReg) {
            return res.status(400).json({error: "Already registered"});
        }

        event.registrations.push({participantId});
        await event.save();

        logger.info(`User ${participantId} registered for event ${eventId}`);
        res.status(200).json({msg: "Registered successfully", ticketId: event._id});
    } catch (err) {
        logger.error("Registration failed", { error: err.message, eventId: req.params.eventId });
        res.status(500).json({error: "Registration failed"});
    }
};

module.exports = {createEvent, getAllEvents, registerForEvent};