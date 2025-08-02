
import connectDB from "@/config/db"; // Assuming you have this for DB connection
import Product from "@/models/Product"; // Ensure this path and casing is correct (Capital P)
import Order from "@/models/Order";     // CRITICAL: Import the Order model
import { inngest } from "@/config/innjest";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import User from "@/models/User";

export async function POST(request) {
    try {
        await connectDB(); // Ensure DB connection is established

        const { userId } = getAuth(request);
        const { address, items } = await request.json();

        if (!address || items.length === 0) {
            return NextResponse.json({ success: false, message: "Invalid data" });
        }

        // calculate amount using items
        const amount = await items.reduce(async (acc, item) => {
            // Ensure Product.findById works with the correct casing and ObjectId
            const product = await Product.findById(item.product);
            // Handle case where product might not be found (optional, but good practice)
            if (!product) {
                throw new Error(`Product with ID ${item.product} not found.`);
            }
            return acc + product.offerPrice * item.quantity;
        }, 0);

        // CRITICAL FIX: Create and save the order to the database
        const newOrder = await Order.create({
            userId,
            address, // This should be the ObjectId of the Address document
            items: items.map(item => ({
                product: item.product, // This should be the ObjectId of the Product document
                quantity: item.quantity
            })),
            amount: amount + Math.floor(amount * 0.02), // Your existing amount calculation
            // status and date will default based on your Order schema if not provided here
        });
        console.log("Order successfully saved to DB:", newOrder); // Log for debugging

        // You can keep the Inngest event if you have an Inngest function handling it
        // Otherwise, you might consider removing it if it's not actively used for persistence
        await inngest.send({
            name: "order/created",
            data: {
                userId,
                address,
                items,
                amount: amount + Math.floor(amount * 0.02), // Match your existing amount calculation
                date: Date.now(),
            }
        });

        // clear user cart
        const user = await User.findById(userId);
        if (user) { // Add a check if user exists
            user.cartItems = {};
            await user.save();
        } else {
            console.warn(`User with ID ${userId} not found when trying to clear cart.`);
        }

        return NextResponse.json({ success: true, message: "Order Placed", orderId: newOrder._id });

    } catch (error) {
        console.error("Error during order creation:", error); // More specific error logging
        return NextResponse.json({ success: false, message: error.message || "An unexpected error occurred during order creation." });
    }
}
