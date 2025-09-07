import { auth } from "@/app/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

// The Better Auth stripe plugin automatically handles webhooks through this route
// It will update user subscriptions, handle payment success/failure, etc.
export const { POST } = toNextJsHandler(auth);