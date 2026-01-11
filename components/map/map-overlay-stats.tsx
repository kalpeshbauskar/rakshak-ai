"use client"

import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { PulseIndicator } from "@/components/ui/pulse-indicator"
import { CloudRain, AlertTriangle, Activity, Thermometer } from "lucide-react"

interface MapOverlayStatsProps {
  stats: {
    totalRainfall: number
    activeAlerts: number
    monitoredDistricts: number
    avgTemperature: number
  }
}

export function MapOverlayStats({ stats }: MapOverlayStatsProps) {
  const statItems = [
    {
      icon: CloudRain,
      label: "Avg Rainfall",
      value: `${stats.totalRainfall.toFixed(1)}mm`,
      status: stats.totalRainfall > 50 ? "warning" : "active",
    },
    {
      icon: AlertTriangle,
      label: "Active Alerts",
      value: stats.activeAlerts.toString(),
      status: stats.activeAlerts > 5 ? "critical" : stats.activeAlerts > 0 ? "warning" : "active",
    },
    {
      icon: Activity,
      label: "Monitored",
      value: `${stats.monitoredDistricts} Districts`,
      status: "active",
    },
    {
      icon: Thermometer,
      label: "Avg Temp",
      value: `${stats.avgTemperature.toFixed(1)}°C`,
      status: "active",
    },
  ] as const

  return (
    <motion.div
      className="absolute top-4 right-4 flex flex-col gap-2"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
    >
      {statItems.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 + index * 0.1 }}
        >
          <GlassCard className="p-3 min-w-[140px]">
            <div className="flex items-center gap-3">
              <div className="relative">
                <item.icon className="w-4 h-4 text-muted-foreground" />
                <div className="absolute -top-1 -right-1">
                  <PulseIndicator status={item.status} size="sm" />
                </div>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{item.label}</p>
                <p className="text-sm font-semibold text-foreground font-mono">{item.value}</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      ))}
    </motion.div>
  )
}
