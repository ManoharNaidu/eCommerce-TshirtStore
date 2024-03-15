const nodemailer = require('nodemailer');
require('dotenv').config();

var transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "6b75c36478093d",
      pass: "b5086934e884e1"
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