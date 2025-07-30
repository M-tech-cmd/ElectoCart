// models/Order.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: String, // <<< CRITICAL: Must be String for Clerk user IDs. NO 'ref'.
    required: true,
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId, // <<< CRITICAL: MUST be ObjectId for population
        ref: "Product", // <<< This MUST match the model name in your Product.js (e.g., "Product")
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  amount: {
    type: Number,
    required: true,
  },
  address: {
    type: mongoose.Schema.Types.ObjectId, // <<< CRITICAL: MUST be ObjectId for population
    ref: "address", // <<< This MUST match the model name in your Address.js (e.g., "Address")
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: "Order Placed",
  },
  date: {
    type: Date, // Recommended: Use Date type for dates, better for sorting/querying
    required: true,
    default: Date.now, // Automatically set creation date
  },
}, { timestamps: true });

// CRITICAL: Prevents Mongoose from re-registering the model
const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;