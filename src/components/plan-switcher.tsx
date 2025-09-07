"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { authClient } from "@/app/lib/auth-client"

interface PlanSwitcherProps {
  currentPlan: "free" | "pro"
  onPlanChange?: (plan: "free" | "pro") => Promise<boolean> | void
  compact?: boolean
  disabled?: boolean
}

export function PlanSwitcher({ currentPlan, onPlanChange, compact = false, disabled = false }: PlanSwitcherProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const [isAnnual, setIsAnnual] = useState(false)

  const handlePlanChange = async (plan: "free" | "pro") => {
    if (disabled || loading) return

    setLoading(plan)
    try {
      if (plan === "pro") {
        // Use Better Auth Stripe client to upgrade to pro
        const { error } = await authClient.subscription.upgrade({
          plan: "pro",
          annual: isAnnual, // Use the annual toggle
          successUrl: `${window.location.origin}/dashboard?upgraded=true`,
          cancelUrl: `${window.location.origin}/pricing`,
        })
        
        if (error) {
          console.error("Error upgrading to pro:", error)
          return false
        }
        // The upgrade function redirects to Stripe Checkout, so we don't need to update local state
      } else {
        // For downgrading to free, we'd typically use the cancel subscription
        // For now, we'll call the onPlanChange if provided
        if (onPlanChange) {
          await onPlanChange(plan)
        }
      }
      return true
    } catch (error) {
      console.error("Error changing plan:", error)
      return false
    } finally {
      setLoading(null)
    }
  }

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        {/* Billing toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsAnnual(!isAnnual)}
          className="h-7 px-2 text-xs"
          title={`Switch to ${isAnnual ? 'Monthly' : 'Yearly'}`}
        >
          {isAnnual ? "Yearly" : "Monthly"}
        </Button>
        <Button
          variant={currentPlan === "free" ? "default" : "outline"}
          size="sm"
          onClick={() => handlePlanChange("free")}
          disabled={disabled || loading === "free"}
          className="h-7 px-2 text-xs"
        >
          {loading === "free" ? "..." : "Free"}
        </Button>
        <Button
          variant={currentPlan === "pro" ? "default" : "outline"}
          size="sm"
          onClick={() => handlePlanChange("pro")}
          disabled={disabled || loading === "pro"}
          className="h-7 px-2 text-xs"
        >
          {loading === "pro" ? "..." : `Pro ${isAnnual ? '$120/yr' : '$12/mo'}`}
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 p-4 border-b">
      <span className="text-sm font-medium">Test User Plan:</span>
      <Button
        variant={currentPlan === "free" ? "default" : "outline"}
        size="sm"
        onClick={() => handlePlanChange("free")}
        disabled={disabled || loading === "free"}
      >
        {loading === "free" ? "..." : "Free"}
      </Button>
      <Button
        variant={currentPlan === "pro" ? "default" : "outline"}
        size="sm"
        onClick={() => handlePlanChange("pro")}
        disabled={disabled || loading === "pro"}
      >
        {loading === "pro" ? "..." : "Pro"}
      </Button>
      <Badge variant={currentPlan === "pro" ? "default" : "secondary"}>
        Current: {currentPlan.toUpperCase()}
      </Badge>
    </div>
  )
}
