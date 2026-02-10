const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


// noinspection JSUnusedGlobalSymbols
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate : [
            {
                validator : (v) => RegExp(process.env.EMAIL_REGEX).test(v),
                message : 'Please enter a valid email, Syntax(example@domain)'
            }
        ]
    },
    password: {
        type: String,
        required: true,
        minlength: 3,
        select: false
    }
}, {discriminatorKey: 'role', timestamps: true });

// Password Encryption Middleware
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try{
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch(err) {
        next(err);
    }
})

const User = mongoose.model('User', userSchema);

module.exports = User;





