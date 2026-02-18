const mongoose = require('mongoose');
const Event = require('../models/event');
const items = Event.discriminator('merchandiseEvent', new mongoose.Schema({
    description: {type: String, required: true},
    details: {type: String, required: true},
    stockQuant: {type: Number, required: true},
    purchaseLimit: {type: Number, required: true}
}));

module.exports = items;