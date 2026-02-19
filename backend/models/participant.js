const mongoose = require('mongoose');
const User = require('./user');
require('dotenv').config();

const INSTITUTE_DOMAIN = process.env.INSTITUTE_DOMAIN;

const participantSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    contactNumber: {type: Number, required: true},
    orgName: {type: String, required: true},
    participantType: {
        type: String, enum: ['IIIT', 'Non-IIIT'], required: true
    }
});

participantSchema.pre('save', async function() {
    if (this.participantType === 'IIIT') {
        if (!this.email || !this.email.endsWith(INSTITUTE_DOMAIN)) {
            throw new Error(`Institute participants must use their ${INSTITUTE_DOMAIN} email address.`);
        }
    }
});

const Participant = User.discriminator('PARTICIPANT', participantSchema);

module.exports = Participant;