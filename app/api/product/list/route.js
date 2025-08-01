import connectDB from "@/config/db";
import Product from "@/models/Product"; // Ensure this import path is correct (Product vs product)
import { getAuth } from "@clerk/nextjs/server"; // getAuth might not be needed if not filtering by userId
import { NextResponse } from "next/server";

export async function GET(request){
    try {
        await connectDB();

        // REMOVE THE userId FILTER to fetch ALL products for the homepage
        const products = await Product.find({}); // This will fetch all products

        // You might not need getAuth(request) if you're not using userId for filtering here
        // const {userId} = getAuth(request); // This line can be removed if not used

        return NextResponse.json({ success: true, products });

    } catch (error) {
        console.error("Error fetching products for list:", error); // Add console.error for better debugging
        return NextResponse.json({ success: false, message: error.message || "An unexpected error occurred." });
    }
}