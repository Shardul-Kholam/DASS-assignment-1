const User = require('../models/user');
const logger = require('../utils/logger');

const getAllUsers = async (req, res) => {
    try {
        if (req.user.role !== 'ADMIN') {
            logger.warn(`Unauthorized access to getAllUsers by ${req.user.userID}`);
            return res.status(403).json({error: "Access denied"});
        }

        const users = await User.find({}, '-password', 'lean: true');

        return res.status(200).json(users);
    } catch (err) {
        logger.error("Error fetching users", {error: err.message});
        return res.status(500).json({error: "Server Error"});
    }
}

const getUserById = async (req, res) => {
    try {
        const { userId } = req.params;
        if (req.user.role !== 'ADMIN' && req.user.userID !== userId) {
            return res.status(403).json({ error: "Access denied" });
        }

        const user = await User.findById(userId, '-password').lean();
        if (!user) return res.status(404).json({ error: "User not found" });

        res.status(200).json(user);
    } catch (err) {
        logger.error("Error fetching user profile", { error: err.message });
        res.status(500).json({ error: "Server Error" });
    }
};

module.exports = { getAllUsers, getUserById };