"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface PulseIndicatorProps {
  status: "active" | "warning" | "critical" | "inactive"
  size?: "sm" | "md" | "lg"
  className?: string
}

export function PulseIndicator({ status, size = "md", className }: PulseIndicatorProps) {
  const statusColors = {
    active: "bg-emerald-500",
    warning: "bg-yellow-500",
    critical: "bg-red-500",
    inactive: "bg-gray-500",
  }

  const statusGlow = {
    active: "shadow-emerald-500",
    warning: "shadow-yellow-500",
    critical: "shadow-red-500",
    inactive: "shadow-gray-500",
  }

  const sizes = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  }

  return (
    <div className={cn("relative", className)}>
      {/* Ripple effect */}
      {status !== "inactive" && (
        <>
          <motion.div
            className={cn("absolute rounded-full", statusColors[status], sizes[size])}
            animate={{
              scale: [1, 2.5],
              opacity: [0.6, 0],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeOut",
            }}
          />
          <motion.div
            className={cn("absolute rounded-full", statusColors[status], sizes[size])}
            animate={{
              scale: [1, 2],
              opacity: [0.4, 0],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeOut",
              delay: 0.5,
            }}
          />
        </>
      )}
      {/* Core dot */}
      <motion.div
        className={cn("relative rounded-full shadow-lg", statusColors[status], statusGlow[status], sizes[size])}
        animate={status !== "inactive" ? { scale: [1, 1.1, 1] } : {}}
        transition={{
          duration: 1.5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
    </div>
  )
}
