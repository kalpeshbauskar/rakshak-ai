"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface LiquidProgressProps {
  value: number
  max?: number
  variant?: "default" | "danger" | "warning" | "success"
  label?: string
  showValue?: boolean
  className?: string
}

export function LiquidProgress({
  value,
  max = 100,
  variant = "default",
  label,
  showValue = true,
  className,
}: LiquidProgressProps) {
  const percentage = Math.min((value / max) * 100, 100)

  const variantColors = {
    default: "from-violet-500 to-blue-500",
    danger: "from-red-500 to-orange-500",
    warning: "from-yellow-500 to-orange-400",
    success: "from-emerald-500 to-teal-400",
  }

  const variantGlow = {
    default: "shadow-[0_0_20px_rgba(139,92,246,0.4)]",
    danger: "shadow-[0_0_20px_rgba(239,68,68,0.4)]",
    warning: "shadow-[0_0_20px_rgba(234,179,8,0.4)]",
    success: "shadow-[0_0_20px_rgba(16,185,129,0.4)]",
  }

  return (
    <div className={cn("space-y-2", className)}>
      {(label || showValue) && (
        <div className="flex justify-between items-center text-sm">
          {label && <span className="text-muted-foreground">{label}</span>}
          {showValue && (
            <span className="font-mono text-foreground">
              {value.toFixed(1)}/{max}
            </span>
          )}
        </div>
      )}
      <div className="relative h-3 rounded-full bg-secondary/50 overflow-hidden">
        {/* Wave effect background */}
        <div className="absolute inset-0 opacity-30">
          <svg className="w-full h-full" preserveAspectRatio="none">
            <defs>
              <pattern id="wave" x="0" y="0" width="100" height="20" patternUnits="userSpaceOnUse">
                <path
                  d="M0 10 Q 25 0, 50 10 T 100 10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-white/20"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#wave)" />
          </svg>
        </div>

        {/* Progress bar */}
        <motion.div
          className={cn(
            "absolute inset-y-0 left-0 rounded-full bg-gradient-to-r",
            variantColors[variant],
            variantGlow[variant],
          )}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
          {/* Liquid shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: ["-100%", "200%"] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, ease: "linear" }}
          />
        </motion.div>
      </div>
    </div>
  )
}
