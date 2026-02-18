const mongoose = require('mongoose');
const Event = require('../models/event');
const merchandiseSchema = new mongoose.Schema({
    variants: [{
        name: {type: String, required: true},
        options: [{type: String, required: true}]
    }],

    stockQuant: {type: Number, required: true, min: 0},
    purchaseLimit: {type: Number, required: true, min: 1, default: 1}
});

const MerchandiseEvent = Event.discriminator('MerchandiseEvent', merchandiseSchema);

module.exports = MerchandiseEvent;