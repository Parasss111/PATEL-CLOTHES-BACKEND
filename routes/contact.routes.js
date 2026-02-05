const express = require("express");
const router = express.Router();
const Contact = require("../model/Contact");
const sendEmail = require("../utils/senEmail");

router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Save in DB
    await Contact.create({ name, email, message });

    // 📩 Email to YOU (admin)
    await sendEmail({
      to: process.env.EMAIL,
      subject: "New Contact Message",
      html: `
        <h2>New Contact Message</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b></p>
        <p>${message}</p>
      `,
    });

    // 📬 AUTO REPLY to USER
    await sendEmail({
      to: email,
      subject: "We received your message – Patel Store",
      html: `
        <div style="font-family:Arial;line-height:1.6">
          <h2>Hi ${name}, 👋</h2>

          <p>Thank you for contacting <b>Patel Store</b>.</p>

          <p>We’ve received your message and our team will reply within 24 hours.</p>

          <hr />

          <p><b>Your Message:</b></p>
          <blockquote>${message}</blockquote>

          <p>Regards,<br/>
          Patel Store Support Team</p>
        </div>
      `,
    });

    res.json({ message: "Message sent successfully" });

  } catch (err) {
    console.error("CONTACT ERROR:", err);
    res.status(500).json({ message: "Failed to send message" });
  }
});

module.exports = router;
