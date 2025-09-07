"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Crown, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CheckoutSuccessPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Give a moment for the session to update after payment
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
          <p className="text-muted-foreground">
            Welcome to Pro! Your account has been upgraded successfully.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 justify-center">
              <Crown className="h-5 w-5 text-yellow-500" />
              Pro Plan Activated
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                You now have access to all Pro features including:
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>• Unlimited projects</div>
                <div>• 10GB storage per project</div>
                <div>• Priority support</div>
                <div>• Advanced analytics</div>
                <div>• Custom domains</div>
                <div>• Collaboration tools</div>
                <div>• Export functionality</div>
                <div>• API access</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Button asChild className="w-full" size="lg">
            <Link href="/dashboard">
              Get Started
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
          
          <p className="text-xs text-muted-foreground">
            You will receive a confirmation email shortly with your receipt and subscription details.
          </p>
        </div>
      </div>
    </div>
  );
}