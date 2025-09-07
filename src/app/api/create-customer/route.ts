import { auth, createStripeCustomer } from "@/app/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Get the current session
    const session = await auth.api.getSession({
      headers: req.headers
    });
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Create Stripe customer for the user
    const customer = await createStripeCustomer({
      id: session.user.id,
      email: session.user.email,
      name: session.user.name || "Unknown User"
    });
    
    return NextResponse.json({ 
      success: true, 
      customerId: customer?.id || null 
    });
  } catch (error) {
    console.error("Error creating Stripe customer:", error);
    return NextResponse.json({ 
      error: "Failed to create customer",
      success: false 
    }, { status: 500 });
  }
}
