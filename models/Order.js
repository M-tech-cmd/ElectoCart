import mongoose from "mongoose";


const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  items: [{
    product: {
      type: String,
      ref: "Product",
      required: true
    },
    quantity: {
      type: Number,
      required: true,
    }
  }],
  amount: {
    type: Number,
    required: true,
  },
  address: { type: String, ref: "Address", required: true },
  ammount: {type: Number, required: true},
    status: { type: String, required: true, default: "Order Placed" },
    date: { type: String, required: true }
});

const Order = mongoose.models.order || mongoose.model("order", orderSchema);
export default Order;
