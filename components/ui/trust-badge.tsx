"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Shield, Lock, CheckCircle2 } from "lucide-react"

interface TrustBadgeProps {
  variant: "gov-verified" | "blockchain" | "live"
  className?: string
}

export function TrustBadge({ variant, className }: TrustBadgeProps) {
  const badges = {
    "gov-verified": {
      icon: Shield,
      label: "Gov Node Verified",
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    blockchain: {
      icon: Lock,
      label: "Blockchain Secured",
      color: "text-violet-400",
      bg: "bg-violet-500/10",
      border: "border-violet-500/20",
    },
    live: {
      icon: CheckCircle2,
      label: "Live Data",
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
  }

  const badge = badges[variant]
  const Icon = badge.icon

  return (
    <motion.div
      className={cn(
        "relative inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border overflow-hidden",
        badge.bg,
        badge.border,
        badge.color,
        className,
      )}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
    >
      {/* Shimmer overlay */}
      <div className="absolute inset-0 shimmer pointer-events-none" />

      <Icon className="w-3 h-3" />
      <span className="relative z-10">{badge.label}</span>
    </motion.div>
  )
}
