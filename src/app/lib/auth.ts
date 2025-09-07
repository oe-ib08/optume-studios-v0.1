// Update the import path to the correct location of drizzle.ts
import { db } from "../../db/drizzle";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { stripe } from "@better-auth/stripe";
import Stripe from "stripe";

// Auth configuration with Stripe integration

// Initialize Stripe client with environment variable
const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
    apiVersion: "2025-08-27.basil",
});

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
        stripe({
            stripeClient,
            stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "whsec_placeholder",
            createCustomerOnSignUp: true, // Enable automatic customer creation
            onCustomerCreate: async ({ stripeCustomer, user }) => {
                // Do something with the newly created customer
                console.log(`Stripe customer ${stripeCustomer.id} created for user ${user.id}`);
            },

            getCustomerCreateParams: async ({ user }) => {
                // Customize the Stripe customer creation parameters
                return {
                    name: user.name,
                    email: user.email,
                    metadata: {
                        userId: user.id,
                        referralSource: "direct" // You can customize this based on your needs
                    }
                };
            },
            subscription: {
                enabled: true,
                plans: [
                    {
                        name: "free",
                        priceId: "", 
                        limits: {
                            projects: 1,
                            storage: 1
                        }
                    },
                    {
                        name: "pro",
                        priceId: process.env.STRIPE_PRO_MONTHLY_PRICE_ID || "price_1S4YsEBCVKaOb1T6YCZhPodW",
                        annualDiscountPriceId: process.env.STRIPE_PRO_YEARLY_PRICE_ID || "price_1S4YsTBCVKaOb1T6NbvpojYC",
                        limits: {
                            projects: 10,
                            storage: 10
                        }
                    }
                ]
            }
        })
    ]
});

export default auth;