import { Inngest } from "inngest";
import connectDB from "./db";
// REVERTED: Using relative path that should be correct based on your project structure
import User from '../models/User'; // <--- CHANGE THIS LINE BACK TO THIS

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
            image_url: image_url
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
            image_url: image_url
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