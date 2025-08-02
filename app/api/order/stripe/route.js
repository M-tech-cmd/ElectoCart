// app/api/order/stripe/route.js

import Order from "@/models/Order";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Product from "@/models/Product";
import Stripe from "stripe";
import { inngest } from "@/config/innjest";
import connectDB from "@/config/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
    try {
        await connectDB();

        const { userId } = getAuth(request);
        const { address, items } = await request.json();

        let origin = request.headers.get('origin');
        if (origin && !origin.startsWith('http://') && !origin.startsWith('https://')) {
            origin = `http://${origin}`;
        }

        if (!address || items.length === 0) {
            return NextResponse.json({ success: false, message: "Invalid data" });
        }

        let productData = [];

        // --- CRITICAL FIX: Correct asynchronous amount calculation ---
        const itemAmounts = await Promise.all(items.map(async (item) => {
            const product = await Product.findById(item.product);
            if (!product) {
                throw new Error(`Product with ID ${item.product} not found.`);
            }
            productData.push({
                name: product.name,
                price: product.offerPrice,
                quantity: item.quantity
            });
            return product.offerPrice * item.quantity;
        }));

        let amount = itemAmounts.reduce((sum, currentAmount) => sum + currentAmount, 0);
        // --- END CRITICAL FIX ---

        amount += Math.floor(amount * 0.02);

        const newOrder = await Order.create({
            userId,
            address,
            items: items.map(item => ({
                product: item.product,
                quantity: item.quantity
            })),
            amount: amount, // Use the calculated 'amount' directly here
            status: 'Order Placed',
            date: Date.now(),
            paymentType: 'Stripe',
            isPaid: false
        });
        console.log("Order successfully saved to DB:", newOrder);

        await inngest.send({
            name: "order/created",
            data: {
                userId,
                address,
                items,
                amount: amount,
                date: Date.now(),
                paymentType: 'Stripe',
            }
        });

        const line_items = productData.map(item => {
            return {
                price_data: {
                    currency: 'kes',
                    product_data: {
                        name: item.name,
                    },
                    unit_amount: item.price * 100,
                },
                quantity: item.quantity
            };
        });

        const session = await stripe.checkout.sessions.create({
            line_items,
            mode: 'payment',
            success_url: `${origin}/order-placed`,
            cancel_url: `${origin}/cart`,
            metadata: {
                orderId: newOrder._id.toString(),
                userId: userId,
            }
        });

        const url = session.url;

        return NextResponse.json({ success: true, url });

    } catch (error) {
        console.error("Stripe API error:", error);
        return NextResponse.json({ success: false, message: error.message || "An error occurred while processing the order with Stripe." });
    }
}