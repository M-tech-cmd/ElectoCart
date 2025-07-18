import { serve } from "inngest/next";
import { syncUserCreation, syncUserDeletion, syncUserUpdateicon } from "@/config/innjest";

// Create Api that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    syncUserCreation,
    syncUserUpdateicon,
    syncUserDeletion
  ],
});
