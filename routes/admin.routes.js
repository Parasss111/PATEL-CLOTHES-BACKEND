const express = require("express");
const router = express.Router();

const { isAuth } = require("../middleware/auth.middleware");
const { isAdmin } = require("../middleware/admin.middleware");

const Product = require("../model/Product");
const User = require("../model/User");
const Order = require("../model/Order");

// products
router.get("/products", isAuth, isAdmin, async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

router.post("/products", isAuth, isAdmin, async (req, res) => {
  const product = await Product.create(req.body);
  res.json(product);
});

router.put("/products/:id", isAuth, isAdmin, async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(product);
});

router.delete("/products/:id", isAuth, isAdmin, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted" });
});

// users
router.get("/users", isAuth, isAdmin, async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

// delete user
router.delete("/users/:id", isAuth, isAdmin, async (req,res)=>{
  await User.findByIdAndDelete(req.params.id);
  res.json({message:"User deleted"});
});

//block user
router.patch("/users/:id/block", isAuth, isAdmin, async (req, res) => {
  const user = await User.findById(req.params.id);
  user.isBlocked = !user.isBlocked;
  await user.save();

  res.json({ blocked: user.isBlocked });
});


// orders
router.get("/orders", isAuth, isAdmin, async (req, res) => {
  const orders = await Order.find().populate("user").populate("items.product");
  res.json(orders);
});

// dashboard
// router.get("/dashboard", isAuth, isAdmin, async (req, res) => {
//   const products = await Product.countDocuments();
//   const users = await User.countDocuments();
//   res.json({ products, users });
// });
router.get("/dashboard", isAuth, isAdmin, async (req, res) => {
  const products = await Product.countDocuments();
  const users = await User.countDocuments();
  const orders = await Order.countDocuments();

  const revenueAgg = await Order.aggregate([
    { $group: { _id: null, total: { $sum: "$total" } } }
  ]);

  const revenue = revenueAgg[0]?.total || 0;

  const recentOrders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("user");

  res.json({
    stats: {
      products,
      users,
      orders,
      revenue,
    },
    recentOrders,
  });
});


module.exports = router;
