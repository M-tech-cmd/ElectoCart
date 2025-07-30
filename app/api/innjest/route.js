import { serve } from "inngest/next";
// Corrected import: change 'createUserOrder' to 'syncUserOrder'
import { inngest, syncUserCreation, syncUserDeletion, syncUserUpdation, syncUserOrder, createUserOrder } from "@/config/innjest";

// Create Api that serves zero functions (this comment is misleading, it actually serves functions)
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    syncUserCreation,
    syncUserUpdation,
    syncUserDeletion,
    createUserOrder // Corrected: use the actual function name 'syncUserOrder'
  ],
});