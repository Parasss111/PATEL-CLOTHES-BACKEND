const express = require("express");
const router = express.Router();

const {
  createProduct,
  getProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");

const { isAuth } = require("../middleware/auth.middleware");
const { isAdmin } = require("../middleware/admin.middleware");
const upload = require("../middleware/upload.middleware");

router.get("/", getProducts);
//for pagination
// router.get("/", async (req, res) => {
//   const page = Number(req.query.page) || 1;
//   const limit = 5;
//   const skip = (page - 1) * limit;

//   const products = await Product.find().skip(skip).limit(limit);
//   const total = await Product.countDocuments();

//   res.json({
//     products,
//     pages: Math.ceil(total / limit),
//   });
// });

router.get("/:id", getSingleProduct);

router.post("/", isAuth, isAdmin, upload.single("image"), createProduct);
console.log(
  "isAuth:", typeof isAuth,
  "isAdmin:", typeof isAdmin,
  "upload:", upload,
  "createProduct:", typeof createProduct
);

router.put("/:id", isAuth, isAdmin, upload.single("image"), updateProduct);
router.delete("/:id", isAuth, isAdmin, deleteProduct);

module.exports = router;
