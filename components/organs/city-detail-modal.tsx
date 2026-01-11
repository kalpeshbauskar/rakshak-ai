"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Droplets, Wind, Thermometer, Calendar } from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import type { WeatherData, ForecastDay } from "@/lib/types"

interface CityDetailModalProps {
  city: WeatherData | null
  onClose: () => void
}

export function CityDetailModal({ city, onClose }: CityDetailModalProps) {
  const [forecast, setForecast] = useState<ForecastDay[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (city) {
      setIsLoading(true)
      fetch(`/api/forecast?city=${encodeURIComponent(city.district)}`)
        .then((res) => res.json())
        .then((data) => {
          setForecast(data.forecast || [])
          setIsLoading(false)
        })
        .catch(() => setIsLoading(false))
    }
  }, [city])

  if (!city) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />

        {/* Modal */}
        <motion.div
          className="relative w-full max-w-2xl"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25 }}
        >
          <GlassCard className="p-6" glow="violet">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-secondary/50 hover:bg-secondary transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>

            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground">{city.district}</h2>
              <p className="text-muted-foreground text-sm">
                {city.condition} • Updated {new Date(city.timestamp).toLocaleTimeString()}
              </p>
            </div>

            {/* Current Stats */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 rounded-xl bg-secondary/30">
                <Thermometer className="w-5 h-5 text-orange-400 mx-auto mb-2" />
                <p className="text-2xl font-bold font-mono text-foreground">{city.temperature.toFixed(1)}°</p>
                <p className="text-xs text-muted-foreground">Temperature</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-secondary/30">
                <Droplets className="w-5 h-5 text-blue-400 mx-auto mb-2" />
                <p className="text-2xl font-bold font-mono text-foreground">{city.humidity}%</p>
                <p className="text-xs text-muted-foreground">Humidity</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-secondary/30">
                <Wind className="w-5 h-5 text-cyan-400 mx-auto mb-2" />
                <p className="text-2xl font-bold font-mono text-foreground">{city.windSpeed.toFixed(0)}</p>
                <p className="text-xs text-muted-foreground">km/h Wind</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-secondary/30">
                <Droplets className="w-5 h-5 text-indigo-400 mx-auto mb-2" />
                <p className="text-2xl font-bold font-mono text-foreground">{city.rainfall.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground">mm Rain</p>
              </div>
            </div>

            {/* 7-Day Forecast */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-4 h-4 text-violet-400" />
                <h3 className="font-semibold text-foreground">7-Day Forecast</h3>
                <span className="text-xs text-muted-foreground">(via wttr.in)</span>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-7 gap-2">
                  {[...Array(7)].map((_, i) => (
                    <div key={i} className="h-24 rounded-lg bg-secondary/30 animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-7 gap-2">
                  {forecast.map((day, index) => (
                    <motion.div
                      key={day.date}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="text-center p-3 rounded-xl bg-secondary/20 hover:bg-secondary/30 transition-colors"
                    >
                      <p className="text-xs text-muted-foreground mb-1">
                        {new Date(day.date).toLocaleDateString("en", { weekday: "short" })}
                      </p>
                      <p className="text-xl mb-1">{day.icon}</p>
                      <p className="text-sm font-bold text-foreground">{day.maxTemp}°</p>
                      <p className="text-xs text-muted-foreground">{day.minTemp}°</p>
                      {day.rainfall > 0 && <p className="text-[10px] text-blue-400 mt-1">{day.rainfall}mm</p>}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
