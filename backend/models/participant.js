const mongoose = require('mongoose');
const User = require('./user');

const participantSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    contactNumber: {type: Number, required: true},
    orgName: {type: String, required: true},
    participantType: {
        type: String, enum: ['IIIT', 'Non-IIIT'], required: true
    }
});

// Validating email, orgName and participantType
participantSchema.path('participantType').validate(function (value) {
    if (this.email && this.email.endsWith('iiit.ac.in')) {
        return value === 'IIIT';
    }
    return true;
}, 'Users with IIIT emails must select Participant Type: IIIT');

participantSchema.path('email').validate(function (email) {
    if (this.participantType === 'IIIT') {
        return email.endsWith('iiit.ac.in');
    }
    return true;
}, 'IIIT participants must use their institute email address.');

const Participant = User.discriminator('PARTICIPANT', participantSchema);

module.exports = Participant;