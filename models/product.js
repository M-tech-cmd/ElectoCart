// models/product.js (Renamed file to lowercase 'p')
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  userId: { type: String, required: true, ref: "user" },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  offerPrice: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: Array, required: true },
  date: { type: Number, required: true }
});

// CRITICAL FIX: Model name MUST be "product" (lowercase p) to match the new file name and import paths
const Product = mongoose.models.product || mongoose.model("product", productSchema)

export default Product;