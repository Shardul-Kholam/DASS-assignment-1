const mongoose = require('mongoose');
const User = require('../models/user');

const organizer = User.discriminator('organizer', new mongoose.Schema({
    organizationType: {
        type: String,
        enum: ['Clubs', 'Council', 'Fest Team'],
        required: true
    }
}));

// Email Validation
organizer.schema.path('email').validate(function(email){
   return email.endsWith('.iiit.ac.in');
}, 'Organizers must have a valid IIIT email!'
);

module.exports = organizer;