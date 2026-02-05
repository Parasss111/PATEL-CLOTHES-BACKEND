const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  image: {
    url: String,
    public_id: String,
  },
});

module.exports = mongoose.model("Product", productSchema);
