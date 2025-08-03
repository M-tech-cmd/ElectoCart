import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: String, // Clerk user IDs are strings, so this is correct. No 'ref'.
    required: true,
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId, // CRITICAL FIX: Changed to ObjectId
        ref: "Product", // This must match the model name in your Product.js
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
    type: mongoose.Schema.Types.ObjectId, // CRITICAL FIX: Changed to ObjectId
    ref: "Address", // This must match the model name in your Address.js
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: "Order Placed",
  },
  date: {
    type: Date, // CRITICAL FIX: Changed to Date
    required: true,
    default: Date.now,
  },
  // --- NEW FIELDS ADDED ---
  paymentType: {
    type: String,
    required: true,
    default: "COD" // Default to Cash On Delivery. Will be 'Stripe' for online payments.
  },
  isPaid: {
    type: Boolean,
    required: true,
    default: false // Default to false. Will be updated to true by Stripe webhook.
  }
  // --- END NEW FIELDS ---
}, { timestamps: true });

// CRITICAL FIX: Standardized model name to 'Order' (capital O)
const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
