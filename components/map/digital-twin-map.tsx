"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { motion } from "framer-motion"
import maplibregl from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"
import { cn } from "@/lib/utils"

const MAHARASHTRA_DISTRICTS = [
  { name: "Mumbai", coords: [72.8777, 19.076], population: 12442373 },
  { name: "Pune", coords: [73.8567, 18.5204], population: 3124458 },
  { name: "Nagpur", coords: [79.0882, 21.1458], population: 2405421 },
  { name: "Thane", coords: [72.9781, 19.2183], population: 1841488 },
  { name: "Nashik", coords: [73.7898, 19.9975], population: 1486053 },
  { name: "Aurangabad", coords: [75.3433, 19.8762], population: 1175116 },
  { name: "Solapur", coords: [75.9064, 17.6599], population: 951118 },
  { name: "Kolhapur", coords: [74.2433, 16.7058], population: 549283 },
  { name: "Sangli", coords: [74.5815, 16.8524], population: 436781 },
  { name: "Satara", coords: [74.0183, 17.6805], population: 120000 },
  { name: "Ratnagiri", coords: [73.3, 16.9902], population: 76239 },
  { name: "Sindhudurg", coords: [73.6358, 15.8667], population: 48500 },
] as const

interface DigitalTwinMapProps {
  className?: string
  disasterData?: {
    rainfall: Record<string, number>
    alerts: Array<{ district: string; severity: "low" | "medium" | "high" | "critical" }>
  }
  onCityClick?: (district: string) => void
}

export function DigitalTwinMap({ className, disasterData, onCityClick }: DigitalTwinMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<maplibregl.Map | null>(null)
  const markersRef = useRef<maplibregl.Marker[]>([])
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapError, setMapError] = useState<string | null>(null)

  const getSeverityColor = useCallback(
    (district: string) => {
      const alert = disasterData?.alerts?.find((a) => a.district === district)
      if (!alert) return "rgba(139, 92, 246, 0.8)"
      const colors = {
        low: "rgba(34, 197, 94, 0.8)",
        medium: "rgba(234, 179, 8, 0.8)",
        high: "rgba(249, 115, 22, 0.8)",
        critical: "rgba(239, 68, 68, 0.8)",
      }
      return colors[alert.severity]
    },
    [disasterData?.alerts],
  )

  const getPulseIntensity = useCallback(
    (district: string) => {
      const rainfall = disasterData?.rainfall?.[district] || 0
      if (rainfall > 100) return 1.5
      if (rainfall > 50) return 1.2
      if (rainfall > 20) return 1
      return 0.8
    },
    [disasterData?.rainfall],
  )

  useEffect(() => {
    if (!mapContainer.current || map.current) return

    try {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: "https://tiles.openfreemap.org/styles/positron",
        center: [76.5, 19.0],
        zoom: 6,
        pitch: 45,
        bearing: -10,
        antialias: true,
      })

      map.current.on("error", (e) => {
        console.error("MapLibre error:", e)
        setMapError("Map failed to load")
      })

      map.current.on("load", () => {
        setMapLoaded(true)
      })

      map.current.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), "top-right")
    } catch (err) {
      console.error("Map initialization error:", err)
      setMapError("Failed to initialize map")
    }

    return () => {
      markersRef.current.forEach((marker) => marker.remove())
      map.current?.remove()
      map.current = null
    }
  }, [])

  useEffect(() => {
    if (!mapLoaded || !map.current) return

    markersRef.current.forEach((marker) => marker.remove())
    markersRef.current = []

    MAHARASHTRA_DISTRICTS.forEach((district) => {
      const color = getSeverityColor(district.name)
      const intensity = getPulseIntensity(district.name)

      const el = document.createElement("div")
      el.className = "district-marker"
      el.innerHTML = `
        <div class="marker-pulse" style="
          width: ${30 * intensity}px;
          height: ${30 * intensity}px;
          background: ${color};
          border-radius: 50%;
          animation: marker-pulse 2s ease-in-out infinite;
          box-shadow: 0 0 ${20 * intensity}px ${color};
        "></div>
        <div class="marker-core" style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: ${12 * intensity}px;
          height: ${12 * intensity}px;
          background: ${color};
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.3);
        "></div>
      `
      el.style.cssText = `
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      `

      el.addEventListener("click", (e) => {
        e.stopPropagation()
        onCityClick?.(district.name)
      })

      const popup = new maplibregl.Popup({ offset: 25, closeButton: false }).setHTML(`
        <div style="
          background: rgba(10, 10, 20, 0.95);
          padding: 12px 16px;
          border-radius: 12px;
          border: 1px solid rgba(139, 92, 246, 0.3);
          backdrop-filter: blur(10px);
        ">
          <h3 style="color: #fff; font-weight: 600; margin: 0 0 4px 0;">${district.name}</h3>
          <p style="color: rgba(255,255,255,0.6); font-size: 12px; margin: 0;">
            Rainfall: ${disasterData?.rainfall?.[district.name]?.toFixed(1) || 0}mm
          </p>
          <p style="color: rgba(139,92,246,0.8); font-size: 11px; margin: 4px 0 0 0; cursor: pointer;">
            Click for 7-day forecast →
          </p>
        </div>
      `)

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat(district.coords as [number, number])
        .setPopup(popup)
        .addTo(map.current!)

      markersRef.current.push(marker)
    })

    if (!document.getElementById("marker-animation-styles")) {
      const style = document.createElement("style")
      style.id = "marker-animation-styles"
      style.textContent = `
        @keyframes marker-pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.5); opacity: 0.3; }
        }
        .maplibregl-popup-content {
          background: transparent !important;
          padding: 0 !important;
          box-shadow: none !important;
        }
        .maplibregl-popup-tip {
          display: none !important;
        }
      `
      document.head.appendChild(style)
    }
  }, [mapLoaded, disasterData, getSeverityColor, getPulseIntensity, onCityClick])

  return (
    <motion.div
      className={cn("relative w-full h-full rounded-[24px] overflow-hidden", className)}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div ref={mapContainer} className="absolute inset-0" />

      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-background/80 via-transparent to-transparent" />

      {mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/90 backdrop-blur-sm">
          <div className="text-center p-6 max-w-md">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-violet-500/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
            </div>
            <p className="text-foreground font-medium mb-2">Map Loading Issue</p>
            <p className="text-sm text-muted-foreground">{mapError}</p>
          </div>
        </div>
      )}

      {!mapLoaded && !mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            <p className="text-sm text-muted-foreground">Initializing Digital Twin...</p>
          </div>
        </div>
      )}

      {mapLoaded && (
        <motion.div
          className="absolute bottom-4 left-4 glass-card rounded-xl p-4 text-xs"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-muted-foreground mb-2 font-medium">Severity Index</p>
          <div className="space-y-1.5">
            {[
              { label: "Critical", color: "bg-red-500" },
              { label: "High", color: "bg-orange-500" },
              { label: "Medium", color: "bg-yellow-500" },
              { label: "Low", color: "bg-green-500" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <div className={cn("w-2 h-2 rounded-full", item.color)} />
                <span className="text-foreground">{item.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
