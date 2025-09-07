"use client";

import { useState } from "react";
import { useSession } from "@/app/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Zap, Star } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function UpgradePage() {
  const { data: session } = useSession();
  const [isYearly, setIsYearly] = useState(false);

  const handleUpgrade = () => {
    if (!session?.user) return;
    
    // Navigate to checkout page with plan details
    const checkoutUrl = `/checkout?plan=pro&billing=${isYearly ? 'yearly' : 'monthly'}`;
    window.location.href = checkoutUrl;
  };

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

  const currentPlan = (session?.user as { plan?: string })?.plan || "free";

  if (currentPlan === "pro") {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <Crown className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">You&apos;re already Pro!</h1>
            <p className="text-muted-foreground">
              You have access to all Pro features. Thank you for your support!
            </p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-yellow-500" />
                Pro Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Upgrade to Pro</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Unlock premium features and take your projects to the next level
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <Label htmlFor="billing-toggle" className={!isYearly ? "font-semibold" : ""}>
              Monthly
            </Label>
            <Switch
              id="billing-toggle"
              checked={isYearly}
              onCheckedChange={setIsYearly}
            />
            <Label htmlFor="billing-toggle" className={isYearly ? "font-semibold" : ""}>
              Yearly
            </Label>
            {isYearly && (
              <Badge variant="secondary" className="ml-2">
                Save ${savings}
              </Badge>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Free Plan */}
          <Card className="relative">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Free Plan
              </CardTitle>
              <CardDescription>Perfect for getting started</CardDescription>
              <div className="text-3xl font-bold">
                $0<span className="text-base font-normal text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>1 project</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>1GB storage</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Basic support</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Standard features</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Badge variant="outline" className="w-full justify-center">
                Current Plan
              </Badge>
            </CardFooter>
          </Card>

          {/* Pro Plan */}
          <Card className="relative border-primary shadow-lg">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-primary text-primary-foreground px-4 py-1">
                <Star className="h-3 w-3 mr-1" />
                Most Popular
              </Badge>
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-yellow-500" />
                Pro Plan
              </CardTitle>
              <CardDescription>Everything you need to scale</CardDescription>
              <div className="text-3xl font-bold">
                ${isYearly ? yearlyMonthly : monthlyPrice}
                <span className="text-base font-normal text-muted-foreground">
                  /month
                </span>
              </div>
              {isYearly && (
                <div className="text-sm text-muted-foreground">
                  Billed annually (${yearlyPrice}/year)
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                size="lg"
                onClick={handleUpgrade}
              >
                Upgrade to Pro
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Features Comparison */}
        <div className="bg-muted/50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-8">Why choose Pro?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-primary/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Unlimited Projects</h3>
              <p className="text-sm text-muted-foreground">
                Create as many projects as you need without limitations
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Crown className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Premium Features</h3>
              <p className="text-sm text-muted-foreground">
                Access to advanced tools and analytics for better insights
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Star className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Priority Support</h3>
              <p className="text-sm text-muted-foreground">
                Get help faster with dedicated priority support
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
