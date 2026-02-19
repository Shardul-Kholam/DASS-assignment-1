const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

let emailPattern = process.env.EMAIL_REGEX;

emailPattern = String(emailPattern).trim().replace(/^\/+|\/+;?$|;$/g, '');
const emailRegex = new RegExp(emailPattern);

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: [
            {
                validator: (v) => emailRegex.test(v),
                message: 'Please enter a valid email, Syntax(example@domain)'
            }
        ]
    },
    password: {type: String, required: true, minlength: 3, select: false}
}, {discriminatorKey: 'role', timestamps: true});

// Password Encryption Middleware
userSchema.pre('save', async function() {
    if (!this.isModified('password')) return;
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (err) {
        throw err;
    }
})

const User = mongoose.model('User', userSchema);

module.exports = User;