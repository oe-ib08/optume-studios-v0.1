// Update the import path to the correct location of drizzle.ts
import { db } from "../../db/drizzle";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { stripe } from "@better-auth/stripe";
import Stripe from "stripe";

// Only initialize Stripe if we have the required environment variables
const stripeClient = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-08-27.basil",
    })
  : null;

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg", // or "mysql", "sqlite"
    }),
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false, // Set to true if you want email verification
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
    },
    session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        updateAge: 60 * 60 * 24, // 1 day
    },
    plugins: [
        // Only add Stripe plugin if we have the required configuration
        ...(stripeClient && process.env.STRIPE_WEBHOOK_SECRET ? [
            stripe({
                stripeClient,
                stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
                createCustomerOnSignUp: true,
                subscription: {
                    enabled: true,
                    plans: [
                        {
                            name: "free",
                            priceId: "", // Free plan doesn't need a price ID
                            limits: {
                                projects: 1,
                                storage: 1
                            }
                        },
                        {
                            name: "pro",
                            priceId: process.env.STRIPE_PRO_PRICE_ID || "price_placeholder",
                            limits: {
                                projects: 10,
                                storage: 10
                            }
                        }
                    ]
                }
            })
        ] : [])
    ]
});

export default auth;