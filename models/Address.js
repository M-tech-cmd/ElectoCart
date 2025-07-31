import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    userId: { 
        type: String, 
        required: true,
        index: true // Added index for faster user-specific queries
    },
    fullName: { 
        type: String, 
        required: true,
        trim: true // Removes whitespace
    },
    phoneNumber: { 
        type: String, 
        required: true,
        validate: {
            validator: function(v) {
                return /\d{10}/.test(v); // Basic phone validation
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    pincode: { 
        type: String, // Changed to String - postal codes can have letters/leading zeros
        required: true,
        trim: true
    },
    area: { 
        type: String, 
        required: true,
        trim: true
    },
    city: { 
        type: String, 
        required: true,
        trim: true
    },
    state: { 
        type: String, 
        required: true,
        trim: true
    },
    // Optional: Add country field for international support
    country: {
        type: String,
        default: "India", // Adjust based on your target market
        trim: true
    },
    // Optional: Mark default address
    isDefault: {
        type: Boolean,
        default: false
    }
}, { 
    timestamps: true 
});

// Ensure only one default address per user
addressSchema.pre('save', async function(next) {
    if (this.isDefault) {
        await mongoose.model('Address').updateMany(
            { userId: this.userId, _id: { $ne: this._id } },
            { isDefault: false }
        );
    }
    next();
});

const Address = mongoose.models.Address || mongoose.model("Address", addressSchema);
export default Address;