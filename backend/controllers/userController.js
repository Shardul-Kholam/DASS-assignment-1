const User = require('../models/user');
const logger = require('../utils/logger');

const getAllUsers = async (req, res) => {
    try {
        // SECURITY FIX: Only Admins should be able to view all users
        if (req.user.role !== 'ADMIN') {
            logger.warn(`Unauthorized access to getAllUsers by ${req.user.userID}`);
            return res.status(403).json({ error: "Access denied" });
        }

        // SECURITY FIX: Explicitly exclude password, even if using lean()
        const users = await User.find({}, '-password').lean();

        return res.status(200).json(users);
    } catch (err) {
        logger.error("Error fetching users", { error: err.message });
        return res.status(500).json({error: "Server Error"});
    }
}

module.exports = {getAllUsers};