"use client"

import { motion, AnimatePresence } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { PulseIndicator } from "@/components/ui/pulse-indicator"
import { TrustBadge } from "@/components/ui/trust-badge"
import { AlertTriangle, Waves, Wind, Thermometer, Bug, MapPin } from "lucide-react"
import type { DisasterAlert } from "@/lib/types"
import { cn } from "@/lib/utils"

interface AlertsFeedOrganProps {
  alerts: DisasterAlert[]
  isLoading?: boolean
}

export function AlertsFeedOrgan({ alerts, isLoading }: AlertsFeedOrganProps) {
  const alertIcons = {
    flood: Waves,
    cyclone: Wind,
    earthquake: AlertTriangle,
    heatwave: Thermometer,
    outbreak: Bug,
  }

  const severityColors = {
    low: "border-green-500/30 bg-green-500/5",
    medium: "border-yellow-500/30 bg-yellow-500/5",
    high: "border-orange-500/30 bg-orange-500/5",
    critical: "border-red-500/30 bg-red-500/5",
  }

  const severityIndicators: Record<string, "active" | "warning" | "critical"> = {
    low: "active",
    medium: "warning",
    high: "warning",
    critical: "critical",
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  }

  return (
    <GlassCard className="h-full" glow={alerts.some((a) => a.severity === "critical") ? "destructive" : "none"}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              {alerts.length > 0 && (
                <div className="absolute -top-1 -right-1">
                  <PulseIndicator
                    status={alerts.some((a) => a.severity === "critical") ? "critical" : "warning"}
                    size="sm"
                  />
                </div>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Alert Feed</h3>
              <p className="text-xs text-muted-foreground">{alerts.length} Active Alerts</p>
            </div>
          </div>
          <TrustBadge variant="live" />
        </div>

        {/* Alerts List */}
        <div className="flex-1 overflow-auto space-y-3">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 rounded-xl bg-secondary/30 animate-pulse" />
              ))}
            </div>
          ) : alerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <AlertTriangle className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-sm">No active alerts</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {alerts.map((alert, index) => {
                const Icon = alertIcons[alert.type] || AlertTriangle
                return (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: -20, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 20, scale: 0.95 }}
                    transition={{ delay: index * 0.1 }}
                    className={cn("p-3 rounded-xl border transition-colors", severityColors[alert.severity])}
                  >
                    <div className="flex items-start gap-3">
                      <div className="shrink-0">
                        <Icon className="w-5 h-5 text-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm text-foreground truncate">{alert.title}</h4>
                          <PulseIndicator status={severityIndicators[alert.severity]} size="sm" />
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">{alert.description}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {alert.district}
                          </span>
                          <span>{formatTime(alert.timestamp)}</span>
                          <span className="text-violet-400">{alert.source}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          )}
        </div>
      </div>
    </GlassCard>
  )
}
