"use client"

import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { LiquidProgress } from "@/components/ui/liquid-progress"
import { PulseIndicator } from "@/components/ui/pulse-indicator"
import { TrustBadge } from "@/components/ui/trust-badge"
import { Sprout, Droplets, Thermometer, AlertTriangle } from "lucide-react"
import type { CropData } from "@/lib/types"

interface CropOrganProps {
  crops: CropData[]
  isLoading?: boolean
}

export function CropOrgan({ crops, isLoading }: CropOrganProps) {
  const criticalCrops = crops.filter((c) => c.cropHealth === "critical" || c.cropHealth === "stressed")

  const getHealthColor = (health: string) => {
    switch (health) {
      case "excellent":
        return "text-emerald-400"
      case "good":
        return "text-green-400"
      case "stressed":
        return "text-yellow-400"
      case "critical":
        return "text-red-400"
      default:
        return "text-muted-foreground"
    }
  }

  const getMoistureVariant = (moisture: number) => {
    if (moisture < 0.15) return "danger"
    if (moisture < 0.2) return "warning"
    if (moisture < 0.25) return "default"
    return "success"
  }

  return (
    <GlassCard
      className="h-full"
      glow={criticalCrops.length > 0 ? "warning" : "violet"}
      breathing={criticalCrops.length > 0}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-400 flex items-center justify-center">
                <Sprout className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1">
                <PulseIndicator status={criticalCrops.length > 0 ? "warning" : "active"} size="sm" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Crop Vitality</h3>
              <p className="text-xs text-muted-foreground">Open-Meteo Agriculture</p>
            </div>
          </div>
          <TrustBadge variant="live" />
        </div>

        {/* Drought Alert Banner */}
        {criticalCrops.length > 0 && (
          <motion.div
            className="mb-4 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2 text-yellow-400">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">{criticalCrops.length} Districts Under Stress</span>
            </div>
          </motion.div>
        )}

        {/* Crop Grid */}
        <div className="flex-1 space-y-3 overflow-auto">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-20 rounded-lg bg-secondary/30 animate-pulse" />
              ))}
            </div>
          ) : (
            crops.slice(0, 4).map((crop, index) => (
              <motion.div
                key={crop.district}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-3 rounded-xl bg-secondary/20 hover:bg-secondary/30 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-sm font-medium text-foreground">{crop.district}</span>
                    <span className={`ml-2 text-xs font-medium ${getHealthColor(crop.cropHealth)}`}>
                      {crop.cropHealth.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Droplets className="w-3 h-3" />
                    <span>{(crop.soilMoisture * 100).toFixed(1)}%</span>
                  </div>
                </div>

                <LiquidProgress
                  value={crop.soilMoisture * 100}
                  max={50}
                  variant={getMoistureVariant(crop.soilMoisture) as "default" | "success" | "warning" | "danger"}
                  showValue={false}
                />

                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Thermometer className="w-3 h-3" />
                    <span>{crop.soilTemperature}°C soil</span>
                  </div>
                  <div className="flex gap-1">
                    {crop.crops.slice(0, 2).map((c) => (
                      <span key={c} className="text-[10px] px-1.5 py-0.5 rounded bg-secondary/50 text-muted-foreground">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                {crop.alerts[0] &&
                  crop.alerts[0] !== "Optimal growing conditions" &&
                  crop.alerts[0] !== "Normal conditions" && (
                    <p className="text-[10px] text-yellow-400 mt-1">{crop.alerts[0]}</p>
                  )}
              </motion.div>
            ))
          )}
        </div>
      </div>
    </GlassCard>
  )
}
