// app/api/order/list/route.js

import connectDB from "@/config/db";
import Order from "@/models/Order";     // CRITICAL: Import the Order model
import Product from "@/models/Product"; // CRITICAL: Import the Product model for population
import Address from "@/models/Address"; // CRITICAL: Import the Address model for population
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        await connectDB(); // Ensure database connection is established

        const { userId } = getAuth(request); // Get the authenticated user's ID

        // --- DEBUGGING LOGS ---
        console.log("API /api/order/list: Request received.");
        console.log("API /api/order/list: Authenticated userId from Clerk:", userId);
        // --- END DEBUGGING LOGS ---

        // If no user is authenticated, return an empty array of orders.
        // The frontend will display "No orders found."
        if (!userId) {
            console.log("API /api/order/list: No userId found. Returning empty array.");
            return NextResponse.json({ success: true, orders: [] });
        }

        // Fetch orders for the logged-in user (userId)
        // CRITICAL: Populate 'items.product' to get full product details
        // CRITICAL: Populate 'address' to get full address details
        const orders = await Order.find({ userId })
                                .populate({
                                    path: 'items.product', // Path to the product field within the items array
                                    model: 'Product'       // The Mongoose model name for Product (MUST match models/Product.js)
                                })
                                .populate({
                                    path: 'address',       // Path to the address field
                                    model: 'Address'       // The Mongoose model name for Address (MUST match models/Address.js)
                                });

        // --- DEBUGGING LOGS ---
        console.log(`API /api/order/list: Querying for userId: ${userId}`);
        console.log(`API /api/order/list: Found ${orders.length} orders.`);
        console.log("API /api/order/list: Orders being sent to frontend:", JSON.stringify(orders, null, 2));
        // --- END DEBUGGING LOGS ---

        return NextResponse.json({ success: true, orders }); // Return the fetched orders

    } catch (error) {
        // Log the full error for server-side debugging
        console.error("API /api/order/list: Uncaught error:", error);
        
        // Return a 500 status code for server-side errors
        return NextResponse.json(
            { success: false, message: error.message || "An unexpected error occurred while fetching orders." },
            { status: 500 }
        );
    }
}
