// app/api/order/list/route.js

import connectDB from "@/config/db";
import Order from "@/models/Order";
import Product from "@/models/Product"; // For population
import Address from "@/models/Address"; // For population
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        await connectDB();

        const { userId } = getAuth(request);

        // --- CRITICAL DEBUGGING LOGS ---
        console.log("API /api/order/list: Request received.");
        console.log("API /api/order/list: Authenticated userId from Clerk:", userId);

        if (!userId) {
            console.log("API /api/order/list: No userId found. Returning empty array.");
            return NextResponse.json({ success: true, orders: [] });
        }

        // Fetch orders for the logged-in user (userId)
        const orders = await Order.find({ userId })
                                .populate({
                                    path: 'items.product',
                                    model: 'Product'
                                })
                                .populate({
                                    path: 'address',
                                    model: 'Address'
                                });

        // --- CRITICAL DEBUGGING LOGS ---
        console.log(`API /api/order/list: Querying for userId: ${userId}`);
        console.log(`API /api/order/list: Found ${orders.length} orders.`);
        // Log the actual orders array that is being sent
        console.log("API /api/order/list: Orders being sent to frontend:", JSON.stringify(orders, null, 2));

        return NextResponse.json({ success: true, orders });

    } catch (error) {
        console.error("API /api/order/list: Uncaught error:", error);
        return NextResponse.json(
            { success: false, message: error.message || "An unexpected error occurred while fetching orders." },
            { status: 500 }
        );
    }
}