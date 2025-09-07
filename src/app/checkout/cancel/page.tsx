"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function CheckoutCancelPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Payment Cancelled</h1>
          <p className="text-muted-foreground">
            Your payment was cancelled. No charges have been made to your account.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>What happened?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                You cancelled the payment process before it was completed. This is completely normal and no charges have been made.
              </p>
              <p>
                If you experienced any issues during checkout, please try again or contact our support team.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild variant="outline" className="flex-1">
              <Link href="/upgrade">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Plans
              </Link>
            </Button>
            
            <Button asChild className="flex-1">
              <Link href="/checkout">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Link>
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground">
            Need help? <Link href="/contact" className="underline">Contact our support team</Link>
          </p>
        </div>
      </div>
    </div>
  );
}