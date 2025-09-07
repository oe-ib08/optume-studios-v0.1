"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "@/app/lib/auth-client";
import { authClient } from "@/app/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, ArrowLeft, CreditCard } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  const { data: session, isPending } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const plan = searchParams.get("plan") || "pro";
  const billing = searchParams.get("billing") || "monthly";
  const isYearly = billing === "yearly";
  
  // Price information
  const monthlyPrice = 12;
  const yearlyPrice = 120;
  const yearlyMonthly = Math.round(yearlyPrice / 12);
  const savings = monthlyPrice * 12 - yearlyPrice;
  
  const features = [
    "Unlimited projects",
    "10GB storage per project",
    "Priority support",
    "Advanced analytics",
    "Custom domains",
    "Collaboration tools",
    "Export functionality",
    "API access",
  ];

  // Redirect if not authenticated (only after loading is complete)
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login?redirect=/checkout");
    }
  }, [session, isPending, router]);

  const handleCheckout = async () => {
    if (!session?.user) {
      router.push("/login");
      return;
    }
    
    setIsProcessing(true);
    try {
      // Use the better-auth stripe plugin to create checkout session
      const result = await authClient.subscription.upgrade({
        plan: "pro",
        annual: isYearly,
      });
      
      if (result.data?.url) {
        // Redirect to Stripe Checkout
        window.location.href = result.data.url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      alert("Failed to start checkout process. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Development helper to test plan updates
  const handleDevUpgrade = async () => {
    try {
      const response = await fetch('/api/dev/update-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan: 'pro' }),
      });
      
      if (response.ok) {
        alert('Plan updated to Pro! (Development mode)');
        window.location.href = '/dashboard';
      } else {
        alert('Failed to update plan');
      }
    } catch (error) {
      console.error('Error updating plan:', error);
      alert('Error updating plan');
    }
  };

  // Show loading state while session is being fetched
  if (isPending) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-48 mx-auto mb-4"></div>
            <div className="h-4 bg-muted rounded w-32 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="text-muted-foreground mb-6">
            Please sign in to continue with your purchase.
          </p>
          <Button asChild>
            <Link href="/login?redirect=/checkout">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/upgrade">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Plans
            </Link>
          </Button>
          <h1 className="text-3xl font-bold mb-2">Complete Your Purchase</h1>
          <p className="text-muted-foreground">
            You&apos;re upgrading to Pro {isYearly ? "(Yearly)" : "(Monthly)"}
          </p>
        </div>

        {/* Order Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-500" />
              Pro Plan - {isYearly ? "Yearly" : "Monthly"}
            </CardTitle>
            <CardDescription>
              {isYearly ? "Billed annually" : "Billed monthly"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Price Summary */}
              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-medium">
                  Pro Plan ({isYearly ? "Annual" : "Monthly"})
                </span>
                <span className="font-bold">
                  ${isYearly ? yearlyPrice : monthlyPrice}
                  {isYearly ? "/year" : "/month"}
                </span>
              </div>
              
              {isYearly && (
                <div className="flex justify-between items-center py-2 text-green-600">
                  <span>Annual Discount</span>
                  <span>-${savings}</span>
                </div>
              )}
              
              <div className="flex justify-between items-center py-2 border-t font-bold text-lg">
                <span>Total</span>
                <span>
                  ${isYearly ? yearlyPrice : monthlyPrice}
                  {isYearly ? "/year" : "/month"}
                </span>
              </div>
              
              {isYearly && (
                <Badge variant="secondary" className="w-fit">
                  Save ${savings} per year
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Features Included */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>What&apos;s included</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {features.map((feature) => (
                <div key={feature} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Checkout Button */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  You&apos;ll be redirected to Stripe to complete your payment securely.
                </p>
              </div>
              
              <Button 
                className="w-full" 
                size="lg"
                onClick={handleCheckout}
                disabled={isProcessing}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                {isProcessing ? "Creating checkout session..." : "Continue to Payment"}
              </Button>
              
              {/* Development helper button - remove in production */}
              {process.env.NODE_ENV === 'development' && (
                <Button 
                  variant="outline" 
                  className="w-full" 
                  size="lg"
                  onClick={handleDevUpgrade}
                >
                  [DEV] Skip Payment & Upgrade
                </Button>
              )}
              
              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  Secure payment processing by Stripe. Cancel anytime.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
