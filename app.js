const express = require("express");
const cookieSession = require("cookie-session");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(
  cookieSession({
    name: "session",
    keys: [process.env.SESSION_SECRET],
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    maxAge: 24 * 60 * 60 * 1000,
  })
);

app.get("/debug-session", (req,res)=>{
  console.log("DEBUG SESSION:", req.session);
  res.json(req.session);
});


app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/products", require("./routes/product.routes"));
app.use("/api/admin", require("./routes/admin.routes"));
app.use("/api/orders", require("./routes/order.routes"));
app.use("/api/contact", require("./routes/contact.routes"));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Server error" });
});




module.exports = app;
