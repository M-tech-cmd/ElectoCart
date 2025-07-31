// models/Address.js
import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    userId: { type: String, required: true }, // Assuming Clerk userId
    fullName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    pincode: { type: Number, required: true }, // Or zipCode if that's what you intend
    area: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
}, { timestamps: true });

// CRITICAL: Prevents Mongoose from re-registering the model
const Address = mongoose.models.address || mongoose.model("address", addressSchema);
export default Address;