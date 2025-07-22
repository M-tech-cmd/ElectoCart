import User from "@/models/user";
import { Inngest } from "inngest";
import { connectDB } from "mongoose";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "electrocart-next" });

// Injest Function to save user data to a database
export const syncUserCreation = inngest.createFunction(
    { id: "sync-user-from-clerk" },
    { event: "clerk/user.created" }
)

async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data
    const userData = {
        _id: id,
        eail: email_addresses[0].email_address,
        name: first_name + ' ' + last_name,
        image_url: image_url
    }
    await connectDB(
        await User.create(userData)
    )
}

// Injest Function to UpdateUsericon user data to a database
export const syncUserUpdateicon = inngest.createFunction(
    { id: "sync-user-from-clerk" },
    { event: "clerk/user.updated" }
)

async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data
    const userData = {
        _id: id,
        eail: email_addresses[0].email_address,
        name: first_name + ' ' + last_name,
        image_url: image_url
    }
    await connectDB(
        await User.findByIdAndUpdate(id,userData)
    )

}
// Injest Function to delete user data to a database
export const syncUserDeletion = inngest.createFunction(
    { id: "sync-user-from-clerk" },
    { event: "clerk/user.deleted" }
)

async ({ event }) => {
    const { id } = event.data
    await connectDB(
        await User.findByIdAndDelete(id)
    )
}