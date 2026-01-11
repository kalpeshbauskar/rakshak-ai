"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Header } from "@/components/layout/header"
import { BentoGrid, BentoItem } from "@/components/layout/bento-grid"
import { DigitalTwinMap } from "@/components/map/digital-twin-map"
import { MapOverlayStats } from "@/components/map/map-overlay-stats"
import { DisasterOrgan } from "@/components/organs/disaster-organ"
import { HealthOrgan } from "@/components/organs/health-organ"
import { AIReasoningOrgan } from "@/components/organs/ai-reasoning-organ"
import { StatusOrgan } from "@/components/organs/status-organ"
import { AlertsFeedOrgan } from "@/components/organs/alerts-feed-organ"
import { CropOrgan } from "@/components/organs/crop-organ"
import { CityDetailModal } from "@/components/organs/city-detail-modal"
import { BiometricLogin } from "@/components/auth/biometric-login"
import { useNervousSystem } from "@/hooks/use-nervous-system"
import type { WeatherData } from "@/lib/types"

export default function AetherDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [selectedCity, setSelectedCity] = useState<WeatherData | null>(null)

  const {
    weather,
    alerts,
    health,
    crops,
    status,
    lastUpdated,
    isLoading,
    refetch,
    rainfallByDistrict,
    averageRainfall,
    averageTemperature,
    activeAlertsCount,
    monitoredDistrictsCount,
  } = useNervousSystem({ enabled: isAuthenticated })

  if (!isAuthenticated) {
    return <BiometricLogin onSuccess={() => setIsAuthenticated(true)} />
  }

  const disasterData = {
    rainfall: rainfallByDistrict,
    alerts: alerts.map((a) => ({ district: a.district, severity: a.severity })),
  }

  const handleCityClick = (district: string) => {
    const city = weather.find((w) => w.district === district)
    if (city) setSelectedCity(city)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-8 px-4 lg:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground">Command Center</h2>
              <p className="text-muted-foreground text-sm mt-1">
                Real-time monitoring via Open-Meteo, wttr.in &amp; WHO/HDX logic
              </p>
            </motion.div>

            <BentoGrid>
              {/* Map - Large cell */}
              <BentoItem colSpan={3} rowSpan={3} delay={0}>
                <div className="relative h-full min-h-[400px] lg:min-h-[500px]">
                  <DigitalTwinMap className="h-full" disasterData={disasterData} onCityClick={handleCityClick} />
                  <MapOverlayStats
                    stats={{
                      totalRainfall: averageRainfall,
                      activeAlerts: activeAlertsCount,
                      monitoredDistricts: monitoredDistrictsCount,
                      avgTemperature: averageTemperature,
                    }}
                  />
                </div>
              </BentoItem>

              {/* Status Organ */}
              <BentoItem colSpan={1} rowSpan={1} delay={1}>
                <div className="h-full min-h-[200px]">
                  <StatusOrgan status={status} lastUpdated={lastUpdated} onRefresh={refetch} />
                </div>
              </BentoItem>

              {/* Alerts Feed */}
              <BentoItem colSpan={1} rowSpan={2} delay={2}>
                <div className="h-full min-h-[350px]">
                  <AlertsFeedOrgan alerts={alerts} isLoading={isLoading} />
                </div>
              </BentoItem>

              {/* Disaster Organ */}
              <BentoItem colSpan={1} rowSpan={2} delay={3}>
                <div className="h-full min-h-[350px]">
                  <DisasterOrgan weather={weather} alerts={alerts} isLoading={isLoading} />
                </div>
              </BentoItem>

              {/* Health/Disease Organ */}
              <BentoItem colSpan={1} rowSpan={2} delay={4}>
                <div className="h-full min-h-[350px]">
                  <HealthOrgan healthData={health} isLoading={isLoading} />
                </div>
              </BentoItem>

              <BentoItem colSpan={1} rowSpan={2} delay={5}>
                <div className="h-full min-h-[350px]">
                  <CropOrgan crops={crops} isLoading={isLoading} />
                </div>
              </BentoItem>

              {/* AI Reasoning Organ */}
              <BentoItem colSpan={2} rowSpan={2} delay={6}>
                <div className="h-full min-h-[350px]">
                  <AIReasoningOrgan weather={weather} selectedDistrict="Mumbai" />
                </div>
              </BentoItem>
            </BentoGrid>
          </motion.div>
        </AnimatePresence>
      </main>

      <CityDetailModal city={selectedCity} onClose={() => setSelectedCity(null)} />

      <div
        className="fixed inset-0 pointer-events-none opacity-[0.015] z-0"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />
    </div>
  )
}
