const mongoose = require('mongoose');
const User = require('../models/user');

const participant = User.discriminator('participant', new mongoose.Schema({
    participantType: {
        type: String,
        enum: ['IIIT', 'Non-IIIT'],
        default: 'IIIT',
        required: true
    }
}));

// Email Validation
participant.schema.path('email').validate(function(email){
        if(this.get('participantType') === 'IIIT'){
            return email.endsWith('.iiit.ac.in');
        }
        return true;
    },
    'IIIT participants must use their institute email!'
);

module.exports = participant;