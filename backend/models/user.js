const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {
        type: String, required: true, unique: true, lowercase: true,
        validate: [
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
                message: 'Please enter a valid email, Syntax(example@domain)'
            }
        ]
    },
    password: {type: String, required: true, minlength: 3, select: false}
}, {discriminatorKey: 'role', timestamps: true});

// Password Encryption Middleware
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

const User = mongoose.model('User', userSchema);

module.exports = User;