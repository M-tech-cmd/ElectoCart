import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
     _id: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
  },
   cartItems: {
    type: Object,
    default: {},    // Assuming cartItems is an object with product IDs as keys and quantities as values
  },
}, { minimize: false }); // Setting minimize to false to allow empty objects

const User = mongoose.models.user || mongoose.model("user", userSchema);

export default User;
