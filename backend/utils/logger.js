const winston = require('winston');

// Keys to redact from logs
const SENSITIVE_KEYS = ['password', 'confirmPassword', 'pwd', 'token', 'authorization'];

const redactFormat = winston.format((info) => {
    const redact = (obj) => {
        if (!obj || typeof obj !== 'object') return obj;

        // Handle arrays
        if (Array.isArray(obj)) {
            return obj.map(item => redact(item));
        }

        // Handle objects
        const newObj = { ...obj };
        Object.keys(newObj).forEach((key) => {
            if (SENSITIVE_KEYS.includes(key)) {
                newObj[key] = '[REDACTED]';
            } else if (typeof newObj[key] === 'object') {
                newObj[key] = redact(newObj[key]);
            }
        });
        return newObj;
    };

    // Redact the whole info object (message + meta)
    const redactedInfo = redact(info);

    // Winiston mutability requirement: copy properties back to info
    Object.assign(info, redactedInfo);
    return info;
});

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        redactFormat(),
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })
    ]
});

module.exports = logger;