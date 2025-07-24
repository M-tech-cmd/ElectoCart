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
            // CHANGE THIS LINE: Use 'imageUrl' to match your schema
            imageUrl: image_url // Corrected assignment
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
            // CHANGE THIS LINE: Use 'imageUrl' to match your schema
            imageUrl: image_url // Corrected assignment
        };
        await connectDB();
        await User.findOneAndUpdate({ _id: id }, userData);
    }
);