const mongoose = require('mongoose');
const User = require('../models/user');

const participantSchema = new mongoose.Schema({
    firstName : {
        type: String,
        required: true
    },
    lastName : {
        type: String,
        required: true
    },
    contactNumber : {
        type: Number,
        required: true
    },
    orgName : {
        type: String,
        required: true
    },
    participantType: {
        type: String,
        enum: ['IIIT', 'Non-IIIT'],
        default: 'IIIT',
        required: true
    }
});

// OrgName and ParticipantType validation
participantSchema.pre('validate', function (next) {
        if(this.orgName === 'International Institute of Information Technology, Hyderabad')
            this.participantType = 'IIIT';
        else this.participantType = 'Non-IIIT';
    }
);

participant = User.discriminator('PARTICIPANT', participantSchema);

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