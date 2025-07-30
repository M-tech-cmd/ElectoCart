import connectDB from "@/config/db";
import Product from "@/models/Product";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function GET(request){
    try {
        await connectDB();
        const {userId} = getAuth(request);

        const products = await Product.find({ userId });
        return NextResponse.json({ success: true, products });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}