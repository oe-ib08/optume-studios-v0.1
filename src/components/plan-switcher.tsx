"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface PlanSwitcherProps {
  currentPlan: "free" | "pro"
  onPlanChange?: (plan: "free" | "pro") => Promise<boolean> | void
  compact?: boolean
  disabled?: boolean
}

export function PlanSwitcher({ currentPlan, onPlanChange, compact = false, disabled = false }: PlanSwitcherProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const router = useRouter()

  const handleUpgrade = () => {
    if (disabled || loading) return
    router.push('/upgrade')
  }

  const handleDowngrade = async () => {
    if (disabled || loading) return
    
    setLoading("free")
    try {
      if (onPlanChange) {
        await onPlanChange("free")
      }
    } catch (error) {
      console.error("Error downgrading plan:", error)
    } finally {
      setLoading(null)
    }
  }

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        <Button
          variant={currentPlan === "free" ? "default" : "outline"}
          size="sm"
          onClick={handleDowngrade}
          disabled={disabled || loading === "free" || currentPlan === "free"}
          className="h-7 px-2 text-xs"
        >
          {loading === "free" ? "..." : "Free"}
        </Button>
        <Button
          variant={currentPlan === "pro" ? "default" : "outline"}
          size="sm"
          onClick={handleUpgrade}
          disabled={disabled || loading === "pro" || currentPlan === "pro"}
          className="h-7 px-2 text-xs"
        >
          {currentPlan === "pro" ? "Pro" : "Upgrade"}
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 p-4 border-b">
      <span className="text-sm font-medium">Plan:</span>
      <Button
        variant={currentPlan === "free" ? "default" : "outline"}
        size="sm"
        onClick={handleDowngrade}
        disabled={disabled || loading === "free" || currentPlan === "free"}
      >
        {loading === "free" ? "..." : "Free"}
      </Button>
      <Button
        variant={currentPlan === "pro" ? "default" : "outline"}
        size="sm"
        onClick={handleUpgrade}
        disabled={disabled || currentPlan === "pro"}
      >
        {currentPlan === "pro" ? "Pro" : "Upgrade to Pro"}
      </Button>
      <Badge variant={currentPlan === "pro" ? "default" : "secondary"}>
        Current: {currentPlan.toUpperCase()}
      </Badge>
    </div>
  )
}
