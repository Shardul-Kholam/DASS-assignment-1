const mongoose = require('mongoose');
const User = require('../models/user');

const participant = User.discriminator('participant', new mongoose.Schema({
    contactNumber : {
        type: Number,
        required: true
    },
    OrgName : {
        type: String,
        required: true
    },
    participantType: {
        type: String,
        enum: ['IIIT', 'Non-IIIT'],
        default: 'IIIT',
        required: true,
        validate:[{
            validator: function () {
                if(this.OrgName === 'International Institute of Information Technology')
                    this.participantType = 'IIIT';
            }
        }]
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