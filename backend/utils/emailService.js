const nodemailer = require('nodemailer');
const logger = require('./logger');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendTicket = async (toEmail, eventDetails) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: toEmail,
            subject: `Ticket Confirmed: ${eventDetails.Name}`,
            text: `You have successfully registered for ${eventDetails.Name}. \n\nDate: ${eventDetails.startDate}\nTicket ID: ${eventDetails._id}`
        };

        await transporter.sendMail(mailOptions);
        logger.info(`Email sent to ${toEmail}`);
    } catch (error) {
        logger.error(`Failed to send email to ${toEmail}`, { error: error.message });
    }
};

module.exports = { sendTicket };