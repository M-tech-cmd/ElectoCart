import { serve } from "inngest/next";
// Corrected import: change 'createUserOrder' to 'syncUserOrder'
import { inngest, syncUserCreation, syncUserDeletion, syncUserUpdation, syncUserOrder } from "@/config/innjest";

// Create Api that serves zero functions (this comment is misleading, it actually serves functions)
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    syncUserCreation,
    syncUserUpdation,
    syncUserDeletion,
    syncUserOrder // Corrected: use the actual function name 'syncUserOrder'
  ],
});