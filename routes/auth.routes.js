const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  logout,
} = require("../controllers/auth.controller");
const User = require("../model/User");


//  AUTH ROUTES
//  /api/auth
// router.get("/me", (req, res) => {
//   if (!req.session.user) {
//     return res.status(401).json({ user: null });
//   }

//   res.json({ user: req.session.user });
// });

router.get("/me",async (req, res) => {
  console.log(req.session)
  try{

    const data = await User.find({email:req.session.email})
    console.log("db",data)
    res.json({
      user: data.role
    });
  } catch(err){
    console.error("ME ROUTE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

 

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

module.exports = router;
