const mongoose = require('mongoose');
const User = require('../models/user');

const participantSchema = new mongoose.Schema({
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
        required: true
    }
});

// OrgName and ParticipantType validation
participantSchema.pre('validate', function (next) {
        if(this.OrgName === 'International Institute of Information Technology, Hyderabad')
            this.participantType = 'IIIT';
        else this.participantType = 'Non-IIIT';
    }
);

participant = User.discriminator('participant', participantSchema);

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