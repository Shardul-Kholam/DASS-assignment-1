const mongoose = require('mongoose');
const User = require('./user');
require('dotenv').config();

const participantSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    contactNumber: {type: Number, required: true},
    orgName: {type: String, required: true},
    participantType: {
        type: String, enum: ['IIIT', 'Non-IIIT'], required: true
    }
});

const INSTITUTE_DOMAIN = process.env.INSTITUTE_DOMAIN;

participantSchema.path('email').validate(function (email) {
    if (this.participantType === 'IIIT') {
        return email && email.endsWith(INSTITUTE_DOMAIN);
    }
    return true;
}, `Institute participants must use their ${INSTITUTE_DOMAIN} email address.`);

const Participant = User.discriminator('PARTICIPANT', participantSchema);

module.exports = Participant;