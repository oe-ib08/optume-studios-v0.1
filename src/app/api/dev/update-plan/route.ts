// For development testing - manual plan update
import { db } from "@/db/drizzle";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";

export async function POST(req: Request) {
  // Only allow in development
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: "Not available in production" }, { status: 404 });
  }
  
  try {
    const { plan } = await req.json();
    
    if (!plan || (plan !== 'free' && plan !== 'pro')) {
      return NextResponse.json({ error: "Invalid plan. Must be 'free' or 'pro'" }, { status: 400 });
    }
    
    // This is a development helper - remove in production
    const session = await auth.api.getSession({
      headers: req.headers
    });
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Check if database is available
    if (!db || typeof db.update !== 'function') {
      return NextResponse.json({ error: "Database not available" }, { status: 500 });
    }
    
    // Update user plan directly in database (development only)
    await db
      .update(user)
      .set({ plan: plan })
      .where(eq(user.id, session.user.id));
    
    return NextResponse.json({ success: true, message: `Plan updated to ${plan}` });
  } catch (error) {
    console.error("Error updating plan:", error);
    return NextResponse.json({ 
      error: "Failed to update plan", 
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
