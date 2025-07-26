import { Inngest } from "inngest";
import connectDB from "./db"; // Assuming this path is correct relative to this file
import User from '@/models/User';
import Order from "@/models/Order";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "electrocart-next" });

// Inngest Function to save user data to a database
export const syncUserCreation = inngest.createFunction(
    { id: "sync-user-from-clerk" },
    { event: "clerk/user.created" },
    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data;
        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            name: first_name + ' ' + last_name,
            imageUrl: image_url
        };
        await connectDB();
        await User.create(userData);
    }
);

// Inngest Function to update user data in database
export const syncUserUpdation = inngest.createFunction(
    { id: "update-user-from-clerk" },
    { event: "clerk/user.updated" },
    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data;
        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            name: first_name + ' ' + last_name,
            imageUrl: image_url
        };
        await connectDB();
        await User.findOneAndUpdate({ _id: id }, userData);
    }
);

// Inngest Function to delete user data from database
export const syncUserDeletion = inngest.createFunction(
    { id: "delete-user-with-clerk" },
    { event: "clerk/user.deleted" },
    async ({ event }) => {
        const { id } = event.data;
        await connectDB();
        await User.findByIdAndDelete(id);
    }
);

// Inngest Function to handle user's order in database
export const syncUserOrder = inngest.createFunction(
    {
        id: "create-user-order",
        batchEvents: {
            maxSize: 25,
            timeout: '5s'
        }
    }, // <-- REMOVED THE COMMA HERE
    { event: "order/created" },
    async ({ events }) => {

        const orders = events.map((event) => {
            return {
                userId: event.data.userId,
                address: event.data.address,
                items: event.data.items,
                amount: event.data.amount,
                date: event.data.date
            }
        })

        await connectDB();
        await Order.insertMany(orders);

        return { success: true, processed: orders.length };
    }
); // <-- Also, ensure you don't have an extra semicolon here if it causes issues.