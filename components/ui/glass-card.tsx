"use client"

import { motion, type HTMLMotionProps } from "framer-motion"
import { cn } from "@/lib/utils"
import { forwardRef } from "react"

interface GlassCardProps extends HTMLMotionProps<"div"> {
  variant?: "default" | "elevated" | "subtle"
  glow?: "none" | "violet" | "cobalt" | "success" | "warning" | "destructive"
  breathing?: boolean
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = "default", glow = "none", breathing = false, children, ...props }, ref) => {
    const glowColors = {
      none: "",
      violet: "shadow-[0_0_30px_rgba(139,92,246,0.15)]",
      cobalt: "shadow-[0_0_30px_rgba(59,130,246,0.15)]",
      success: "shadow-[0_0_30px_rgba(34,197,94,0.15)]",
      warning: "shadow-[0_0_30px_rgba(234,179,8,0.15)]",
      destructive: "shadow-[0_0_30px_rgba(239,68,68,0.15)]",
    }

    const variants = {
      default: "glass-card",
      elevated: "glass-card shadow-2xl",
      subtle: "bg-card/30 backdrop-blur-sm",
    }

    return (
      <motion.div
        ref={ref}
        className={cn(
          "rounded-[24px] p-6 transition-all duration-300",
          variants[variant],
          glowColors[glow],
          breathing && "breathing",
          "glass-card-hover",
          className,
        )}
        whileHover={{ y: -2, scale: 1.005 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        {...props}
      >
        {children}
      </motion.div>
    )
  },
)
GlassCard.displayName = "GlassCard"

export { GlassCard }
