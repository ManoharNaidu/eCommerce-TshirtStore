const nodemailer = require('nodemailer');
require('dotenv').config();

var transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

const sendEmail = async (options) => {

    let message = {
        from: 'ABC@email.com',
        to : options.email,
        subject: options.subject,
        text: options.message,
        html : options.html
      }
    await transporter.sendMail(message)
}

module.exports = sendEmail;