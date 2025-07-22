// config/innjest.js

import User from "@/models/user";
import { Inngest } from "inngest";
// Import your dbConnect function. Adjust the path if your dbConnect.js is in a different location.
import dbConnect from "@/lib/dbConnect"; // Assuming dbConnect.js is in the 'lib' directory

// Create a client to send and receive events
export const inngest = new Inngest({ id: "electrocart-next" });

// Inngest Function to save user data to a database when a user is created
export const syncUserCreation = inngest.createFunction(
  { id: "sync-user-creation-clerk-event" }, // Unique ID for this function
  { event: "clerk/user.created" }
).on(async ({ event }) => {
  // Ensure database connection is established before any DB operations
  await dbConnect();

  const { id, first_name, last_name, email_addresses, image_url } = event.data;
  const userData = {
    _id: id,
    email: email_addresses[0].email_address, // Corrected typo: 'eail' to 'email'
    name: first_name + ' ' + last_name,
    image_url: image_url
  };

  try {
    // Create the user in the database
    await User.create(userData);
    console.log(`User created successfully: ${id}`);
  } catch (error) {
    console.error(`Error creating user ${id}:`, error);
    // You might want to rethrow the error or handle it based on your Inngest retry strategy
    throw error;
  }
});

// Inngest Function to update user data in the database when a user is updated
export const syncUserUpdation = inngest.createFunction(
  { id: "sync-user-updation-clerk-event" }, // Unique ID for this function
  { event: "clerk/user.updated" }
).on(async ({ event }) => {
  // Ensure database connection is established before any DB operations
  await dbConnect();

  const { id, first_name, last_name, email_addresses, image_url } = event.data;
  const userData = {
    _id: id,
    email: email_addresses[0].email_address, // Corrected typo: 'eail' to 'email'
    name: first_name + ' ' + last_name,
    image_url: image_url
  };

  try {
    // Find and update the user in the database
    // { new: true } returns the updated document
    await User.findByIdAndUpdate(id, userData, { new: true });
    console.log(`User updated successfully: ${id}`);
  } catch (error) {
    console.error(`Error updating user ${id}:`, error);
    throw error;
  }
});

// Inngest Function to delete user data from the database when a user is deleted
export const syncUserDeletion = inngest.createFunction(
  { id: "sync-user-deletion-clerk-event" }, // Unique ID for this function
  { event: "clerk/user.deleted" }
).on(async ({ event }) => {
  // Ensure database connection is established before any DB operations
  await dbConnect();

  const { id } = event.data;

  try {
    // Find and delete the user from the database
    await User.findByIdAndDelete(id);
    console.log(`User deleted successfully: ${id}`);
  } catch (error) {
    console.error(`Error deleting user ${id}:`, error);
    throw error;
  }
});
