"use client"

import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { LiquidProgress } from "@/components/ui/liquid-progress"
import { PulseIndicator } from "@/components/ui/pulse-indicator"
import { TrustBadge } from "@/components/ui/trust-badge"
import { CloudRain, Droplets, Wind, AlertTriangle } from "lucide-react"
import type { WeatherData, DisasterAlert } from "@/lib/types"

interface DisasterOrganProps {
  weather: WeatherData[]
  alerts: DisasterAlert[]
  isLoading?: boolean
}

export function DisasterOrgan({ weather, alerts, isLoading }: DisasterOrganProps) {
  // Get top rainfall districts
  const topRainfallDistricts = [...weather].sort((a, b) => b.rainfall - a.rainfall).slice(0, 4)

  // Calculate flood risk based on rainfall
  const calculateFloodRisk = (rainfall: number) => {
    if (rainfall > 100) return { value: 95, variant: "danger" as const }
    if (rainfall > 50) return { value: 70, variant: "warning" as const }
    if (rainfall > 20) return { value: 40, variant: "default" as const }
    return { value: 15, variant: "success" as const }
  }

  const averageRainfall = weather.length > 0 ? weather.reduce((sum, w) => sum + w.rainfall, 0) / weather.length : 0

  const criticalAlerts = alerts.filter((a) => a.severity === "critical" || a.severity === "high")

  return (
    <GlassCard
      className="h-full"
      glow={criticalAlerts.length > 0 ? "destructive" : averageRainfall > 30 ? "warning" : "violet"}
      breathing={criticalAlerts.length > 0}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                <CloudRain className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1">
                <PulseIndicator status={criticalAlerts.length > 0 ? "critical" : "active"} size="sm" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Disaster Organ</h3>
              <p className="text-xs text-muted-foreground">Live Rainfall Monitoring</p>
            </div>
          </div>
          <TrustBadge variant="live" />
        </div>

        {/* Critical Alerts Banner */}
        {criticalAlerts.length > 0 && (
          <motion.div
            className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2 text-red-400">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">{criticalAlerts.length} Critical Alerts Active</span>
            </div>
          </motion.div>
        )}

        {/* Rainfall Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center p-3 rounded-xl bg-secondary/30">
            <Droplets className="w-4 h-4 text-blue-400 mx-auto mb-1" />
            <p className="text-lg font-bold font-mono text-foreground">{averageRainfall.toFixed(1)}</p>
            <p className="text-[10px] text-muted-foreground">AVG MM</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-secondary/30">
            <Wind className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
            <p className="text-lg font-bold font-mono text-foreground">
              {weather.length > 0 ? (weather.reduce((sum, w) => sum + w.windSpeed, 0) / weather.length).toFixed(0) : 0}
            </p>
            <p className="text-[10px] text-muted-foreground">KM/H</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-secondary/30">
            <AlertTriangle className="w-4 h-4 text-yellow-400 mx-auto mb-1" />
            <p className="text-lg font-bold font-mono text-foreground">{alerts.length}</p>
            <p className="text-[10px] text-muted-foreground">ALERTS</p>
          </div>
        </div>

        {/* District Rainfall */}
        <div className="flex-1 space-y-3 overflow-auto">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">District Flood Risk</p>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 rounded-lg bg-secondary/30 animate-pulse" />
              ))}
            </div>
          ) : (
            topRainfallDistricts.map((district, index) => {
              const risk = calculateFloodRisk(district.rainfall)
              return (
                <motion.div
                  key={district.district}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 rounded-xl bg-secondary/20 hover:bg-secondary/30 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">{district.district}</span>
                    <span className="text-xs font-mono text-muted-foreground">{district.rainfall.toFixed(1)}mm</span>
                  </div>
                  <LiquidProgress value={risk.value} max={100} variant={risk.variant} showValue={false} />
                </motion.div>
              )
            })
          )}
        </div>
      </div>
    </GlassCard>
  )
}
