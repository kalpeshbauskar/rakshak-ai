"use client"

import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { PulseIndicator } from "@/components/ui/pulse-indicator"
import { Wifi, WifiOff, RefreshCw, Clock, Database, Cpu } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatusOrganProps {
  status: "connected" | "reconnecting" | "error"
  lastUpdated: string
  onRefresh?: () => void
}

export function StatusOrgan({ status, lastUpdated, onRefresh }: StatusOrganProps) {
  const statusConfig = {
    connected: {
      icon: Wifi,
      label: "Connected",
      color: "text-emerald-400",
      indicator: "active" as const,
    },
    reconnecting: {
      icon: RefreshCw,
      label: "Reconnecting",
      color: "text-yellow-400",
      indicator: "warning" as const,
    },
    error: {
      icon: WifiOff,
      label: "Disconnected",
      color: "text-red-400",
      indicator: "critical" as const,
    },
  }

  const config = statusConfig[status]
  const Icon = config.icon

  const formatTime = (timestamp: string) => {
    if (!timestamp) return "—"
    return new Date(timestamp).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
  }

  return (
    <GlassCard className="h-full">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <motion.div
              animate={status === "reconnecting" ? { rotate: 360 } : {}}
              transition={{ duration: 1, repeat: status === "reconnecting" ? Number.POSITIVE_INFINITY : 0 }}
            >
              <Icon className={cn("w-5 h-5", config.color)} />
            </motion.div>
            <span className={cn("font-medium", config.color)}>{config.label}</span>
          </div>
          <PulseIndicator status={config.indicator} />
        </div>

        {/* Stats */}
        <div className="space-y-3 flex-1">
          <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Last Sync</span>
            </div>
            <span className="font-mono text-sm text-foreground">{formatTime(lastUpdated)}</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Data Sources</span>
            </div>
            <span className="font-mono text-sm text-foreground">3 Active</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">AI Engine</span>
            </div>
            <span className="font-mono text-sm text-emerald-400">Online</span>
          </div>
        </div>

        {/* Refresh Button */}
        {onRefresh && (
          <motion.button
            onClick={onRefresh}
            className="mt-4 w-full py-2 rounded-xl bg-secondary/50 hover:bg-secondary/70 text-sm text-foreground transition-colors flex items-center justify-center gap-2"
            whileTap={{ scale: 0.98 }}
          >
            <RefreshCw className="w-4 h-4" />
            Refresh Data
          </motion.button>
        )}
      </div>
    </GlassCard>
  )
}
