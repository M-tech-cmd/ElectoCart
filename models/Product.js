import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  userId: { type: String, required: true, ref: "User" }, // Fixed: Should ref "User" if you have a User model
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  offerPrice: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: Array, required: true },
  date: { type: Date, required: true, default: Date.now } // Fixed: Use Date type instead of Number
}, { timestamps: true }); // Added timestamps for better tracking

// CRITICAL FIX: Model name MUST be "Product" (capital P) to match ref in Order.js
const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;