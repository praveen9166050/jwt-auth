const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASS
  }
});

const mailer = async (email, subject, content) => {
  try {
    const sentMessageInfo = await transporter.sendMail({
      from: process.env.SMTP_MAIL,
      to: email,
      subject: subject,
      html: content
    });
    return sentMessageInfo;
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = mailer;