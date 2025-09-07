// Update the import path to the correct location of drizzle.ts
import { db } from "../../db/drizzle";
import { user } from "../../db/schema";
import { eq } from "drizzle-orm";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { stripe } from "@better-auth/stripe";
import Stripe from "stripe";

// Auth configuration with Stripe integration

// Initialize Stripe client with environment variable
const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
    apiVersion: "2025-08-27.basil",
});

// Helper function to create Stripe customer after user signup
export async function createStripeCustomer(userData: { id: string; email: string; name: string }) {
    try {
        // Only create if Stripe is properly configured
        if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === "sk_test_placeholder") {
            console.log("Stripe not configured, skipping customer creation");
            return null;
        }

        // Check if user already has a customer ID in the database
        const existingUser = await db.select().from(user).where(eq(user.id, userData.id)).limit(1);
        if (existingUser[0]?.stripeCustomerId) {
            console.log(`User ${userData.id} already has Stripe customer ${existingUser[0].stripeCustomerId}`);
            return { id: existingUser[0].stripeCustomerId };
        }

        const customer = await stripeClient.customers.create({
            email: userData.email,
            name: userData.name,
            metadata: {
                userId: userData.id,
                referralSource: "direct"
            }
        });
        
        // Update the user record with the Stripe customer ID
        await db.update(user).set({ 
            stripeCustomerId: customer.id 
        }).where(eq(user.id, userData.id));
        
        console.log(`Stripe customer ${customer.id} created and saved for user ${userData.id}`);
        return customer;
    } catch (error) {
        console.error("Failed to create Stripe customer:", error);
        // Don't throw error to prevent user signup failure
        return null;
    }
}

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
            createCustomerOnSignUp: true, // Re-enable customer creation
            onCustomerCreate: async ({ stripeCustomer, user }) => {
                console.log(`Stripe customer ${stripeCustomer.id} created for user ${user.id}`);
            },
            getCustomerCreateParams: async ({ user }) => {
                return {
                    name: user.name,
                    email: user.email,
                    metadata: {
                        userId: user.id,
                        referralSource: "direct"
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