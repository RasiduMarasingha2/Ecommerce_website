const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Note: Provide SMTP credentials in .env
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE, // e.g., 'Gmail'
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: `Ecommerce Admin <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html // Optional HTML support
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
