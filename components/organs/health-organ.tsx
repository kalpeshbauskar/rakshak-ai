"use client"

import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { PulseIndicator } from "@/components/ui/pulse-indicator"
import { TrustBadge } from "@/components/ui/trust-badge"
import { Activity, Bug, Sun, ShieldAlert } from "lucide-react"
import type { HealthData } from "@/lib/types"
import { cn } from "@/lib/utils"

interface HealthOrganProps {
  healthData: HealthData[]
  isLoading?: boolean
}

export function HealthOrgan({ healthData, isLoading }: HealthOrganProps) {
  const sortedData = [...healthData].sort((a, b) => b.outbreakRisk - a.outbreakRisk)
  const criticalDistricts = sortedData.filter((d) => d.outbreakRisk > 70)
  const avgRisk = healthData.length > 0 ? healthData.reduce((sum, d) => sum + d.outbreakRisk, 0) / healthData.length : 0

  const avgMalaria =
    healthData.length > 0
      ? healthData.reduce((sum, d) => sum + (d.diseaseRisk?.malaria || 0), 0) / healthData.length
      : 0
  const avgDengue =
    healthData.length > 0 ? healthData.reduce((sum, d) => sum + (d.diseaseRisk?.dengue || 0), 0) / healthData.length : 0
  const avgHeatStroke =
    healthData.length > 0
      ? healthData.reduce((sum, d) => sum + (d.diseaseRisk?.heatStroke || 0), 0) / healthData.length
      : 0

  const getRiskColor = (risk: number) => {
    if (risk > 80) return "text-red-400 bg-red-500/20"
    if (risk > 60) return "text-orange-400 bg-orange-500/20"
    if (risk > 40) return "text-yellow-400 bg-yellow-500/20"
    return "text-green-400 bg-green-500/20"
  }

  const getStatusIndicator = (risk: number): "critical" | "warning" | "active" => {
    if (risk > 70) return "critical"
    if (risk > 40) return "warning"
    return "active"
  }

  return (
    <GlassCard className="h-full" glow={criticalDistricts.length > 2 ? "warning" : "cobalt"}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1">
                <PulseIndicator status={criticalDistricts.length > 0 ? "warning" : "active"} size="sm" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Disease Surveillance</h3>
              <p className="text-xs text-muted-foreground">WHO/HDX Logic Model</p>
            </div>
          </div>
          <TrustBadge variant="gov-verified" />
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center p-3 rounded-xl bg-secondary/30">
            <Bug className="w-4 h-4 text-purple-400 mx-auto mb-1" />
            <p className="text-lg font-bold font-mono text-foreground">{avgMalaria.toFixed(0)}%</p>
            <p className="text-[10px] text-muted-foreground">MALARIA</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-secondary/30">
            <ShieldAlert className="w-4 h-4 text-orange-400 mx-auto mb-1" />
            <p className="text-lg font-bold font-mono text-foreground">{avgDengue.toFixed(0)}%</p>
            <p className="text-[10px] text-muted-foreground">DENGUE</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-secondary/30">
            <Sun className="w-4 h-4 text-yellow-400 mx-auto mb-1" />
            <p className="text-lg font-bold font-mono text-foreground">{avgHeatStroke.toFixed(0)}%</p>
            <p className="text-[10px] text-muted-foreground">HEAT</p>
          </div>
        </div>

        {/* District Heatmap */}
        <div className="flex-1 overflow-auto">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-3">
            District Risk Heatmap (Risk 1-10: {(avgRisk / 10).toFixed(1)})
          </p>
          {isLoading ? (
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="aspect-square rounded-xl bg-secondary/30 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {sortedData.slice(0, 9).map((district, index) => (
                <motion.div
                  key={district.district}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  className={cn(
                    "relative aspect-square rounded-xl p-2 flex flex-col items-center justify-center cursor-pointer transition-all",
                    getRiskColor(district.outbreakRisk),
                  )}
                >
                  {district.outbreakRisk > 70 && (
                    <motion.div
                      className="absolute inset-0 rounded-xl"
                      animate={{
                        boxShadow: [
                          "0 0 0 0 rgba(239, 68, 68, 0)",
                          "0 0 0 8px rgba(239, 68, 68, 0.2)",
                          "0 0 0 0 rgba(239, 68, 68, 0)",
                        ],
                      }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    />
                  )}
                  <div className="absolute top-1 right-1">
                    <PulseIndicator status={getStatusIndicator(district.outbreakRisk)} size="sm" />
                  </div>
                  <p className="text-xs font-medium truncate max-w-full">{district.district.slice(0, 6)}</p>
                  <p className="text-lg font-bold font-mono">{district.outbreakRisk}%</p>
                  <p className="text-[8px] opacity-70">
                    {district.diseaseRisk?.dengue > district.diseaseRisk?.malaria ? "Dengue" : "Malaria"}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </GlassCard>
  )
}
