const express = require("express");
const router = express.Router();
const Order = require("../model/Order");
const { isAuth } = require("../middleware/auth.middleware");
const sendEmail = require("../utils/senEmail");

router.post("/", isAuth, async (req, res) => {
  try {
    const { items, address, paymentMethod } = req.body;

    const total = items.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );

    const order = await Order.create({
      user: req.session.user._id,
      items,
      address,
      total,
      paymentMethod,
    });

    // 📧 Confirmation email
    await sendEmail({
      to: req.session.user.email,
      subject: "Order Confirmed 🎉",
      html: `
        <h2>Your order has been placed!</h2>
        <p>Total: ₹${total}</p>
        <p>We’ll notify you when shipped.</p>
      `,
    });

    res.status(201).json(order);

  } catch (err) {
    console.error("ORDER ERROR:", err);
    res.status(500).json({ message: "Order failed" });
  }
});

router.get("/my", isAuth, async (req,res)=>{
  const orders = await Order.find({ user: req.session.user._id })
    .populate("items.product");

  res.json(orders);
});

module.exports = router;
