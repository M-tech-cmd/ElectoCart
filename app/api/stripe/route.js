// manage stripe webhooks
import Stripe from "stripe"
import connectDB from "@/config/db";
import User from "@/models/User";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(request){
    try{
        const body = await request.text(); // Get the raw body as text
        const sig = request.headers.get('stripe-signature'); // Get the Stripe signature from headers

        const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);

        const handlePaymentIntent = async (paymentIntentId, isPaid) => {
            const session = await stripe.checkout.sessions.list({
                payment_intent:paymentIntentId
            })

            const { orderId, userId } = session.data[0].metadata

            await connectDB()

            if (isPaid) {
                await Order.findByIdAndUpdate(orderId, {isPaid:true})
                await User.findByIdAndUpdate(userId, {cartItems:{}})
            } else {
                await Order.findByIdAndUpdate(orderId)
            }
        }
        

        switch (event.type) {
            case 'payment_intent.succeeded':{
                await handlePaymentIntent(event.data.object.id, true)
                break;
            }

            case 'payment_intent.canceled':{
                await handlePaymentIntent(event.data.object.id, false)
                break;
            }
            default:
                console.error(event.type)
                break;
        }

        return NextResponse.json({ received:true })
        
    } catch (error) {
        console.error(error)
         return NextResponse.json({ message:error.message})
    }

}
export const config = {
    api: { bodyparser: false } // Disable body parsing to handle raw body for Stripe webhooks
}