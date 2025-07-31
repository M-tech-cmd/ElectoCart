import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  userId: { type: String, required: true, ref: "user" },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  offerPrice: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: Array, required: true },
  date: { type: Number, required: true } // Consistent with how you store it in product/add
});

// CRITICAL: Model name MUST be "Product" (capital P) to match 'ref: "Product"' in Order.js
const Product = mongoose.models.Product || mongoose.model("Product", productSchema)

export default Product;