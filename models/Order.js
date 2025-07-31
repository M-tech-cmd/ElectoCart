import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: String, // Perfect for Clerk user IDs
    required: true,
    index: true, // Added index for faster queries
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", // This now matches the fixed Product model name
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1, // Added validation
      },
    },
  ],
  amount: {
    type: Number,
    required: true,
    min: 0, // Added validation
  },
  address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address", // This matches your Address model
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: "Order Placed",
    enum: ["Order Placed", "Processing", "Shipped", "Delivered", "Cancelled"], // Added enum for valid statuses
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
}, { 
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Added compound index for efficient querying
orderSchema.index({ userId: 1, date: -1 });

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;