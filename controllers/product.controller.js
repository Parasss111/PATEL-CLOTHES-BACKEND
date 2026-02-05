const Product = require("../model/Product");
const cloudinary = require("../config/cloudinary");

exports.createProduct = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const product = await Product.create({
      name: req.body.name,
      price: req.body.price,
      image: {
        url: req.file.path,
        public_id: req.file.filename,
      },
    });

    res.status(201).json(product);
  } catch (err) {
    console.error("CREATE PRODUCT ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};


exports.getProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};

exports.getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(400).json({ message: "Invalid product ID" });
  }
};

// exports.updateProduct = async (req, res) => {
//   const product = await Product.findById(req.params.id);

//   if (req.file) {
//     await cloudinary.uploader.destroy(product.image.public_id);
//     product.image = {
//       url: req.file.path,
//       public_id: req.file.filename,
//     };
//   }

//   Object.assign(product, req.body);
//   await product.save();

//   res.json(product);
// };

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    product.name = req.body.name;
    product.price = req.body.price;

    if (req.file) {
      await cloudinary.uploader.destroy(product.image.public_id);

      product.image = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }

    await product.save();

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  await cloudinary.uploader.destroy(product.image.public_id);
  await product.deleteOne();

  res.json({ message: "Product deleted" });
};
