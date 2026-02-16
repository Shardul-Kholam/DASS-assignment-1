const mongoose = require('mongoose');
require('dotenv').config();

const organizer = new mongoose.Schema({
    category: {
        type: String,
        enum: ['Club', 'Council', 'Fest Team'],
        required: true
    },
    organizerName:{
        type: String,
        required: true
    },
    description : {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate:[
            {
                validator: (v) => {
                    try {
                        let pattern = process.env.EMAIL_REGEX || '^[\\w.+-]+@[\\w.-]+\\.[A-Za-z]{2,}$';
                        pattern = String(pattern).trim().replace(/^\/+|\/+;?$|;$/g, '');
                        const re = new RegExp(pattern);
                        return re.test(v);
                    } catch (e) {
                        return false;
                    }
                },
                message: 'Please enter a valid email address'
            }
        ]
    }
});

module.exports = organizer;