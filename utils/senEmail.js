const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS
  }
});


const sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: `"Patel Store" <${process.env.EMAIL}>`,
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;
