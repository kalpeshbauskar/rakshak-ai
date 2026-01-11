"use client"

import { motion } from "framer-motion"
import { PulseIndicator } from "@/components/ui/pulse-indicator"
import { TrustBadge } from "@/components/ui/trust-badge"
import { Brain, Activity } from "lucide-react"

export function Header() {
  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 px-4 lg:px-8 py-4"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <div className="glass-card rounded-2xl px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <motion.div className="relative" whileHover={{ scale: 1.05 }}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -top-1 -right-1">
              <PulseIndicator status="active" size="sm" />
            </div>
          </motion.div>
          <div>
            <h1 className="text-lg font-bold text-foreground tracking-tight">
              AETHER<span className="text-primary">.AI</span>
            </h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Digital Nervous System</p>
          </div>
        </div>

        {/* Status */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Activity className="w-4 h-4" />
            <span className="font-mono">MAHARASHTRA</span>
          </div>
          <div className="h-6 w-px bg-border" />
          <TrustBadge variant="gov-verified" />
          <TrustBadge variant="live" />
        </div>

        {/* Time */}
        <div className="hidden lg:block text-right">
          <p className="text-xs text-muted-foreground">System Time</p>
          <p className="font-mono text-sm text-foreground">
            {new Date().toLocaleTimeString("en-IN", { hour12: false })}
          </p>
        </div>
      </div>
    </motion.header>
  )
}
