const jwt = require('jsonwebtoken');

const verifyToken = async (req, res, next) => {
    const token = req.cookies?.authToken || req.headers['authorization']?.split(' ')[1];

    if (!token) return res.status(401).json({error: "Token is missing. Please log in."});

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({error: "Invalid or expired token"});
        req.user = user;
        next();
    });
};

module.exports = verifyToken;