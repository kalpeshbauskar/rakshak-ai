"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import type { NervousSystemData, WeatherData, DisasterAlert, HealthData, CropData } from "@/lib/types"

interface UseNervousSystemOptions {
  refreshInterval?: number
  enabled?: boolean
}

export function useNervousSystem(options: UseNervousSystemOptions = {}) {
  const { refreshInterval = 600000, enabled = true } = options // 10 min refresh as per prompt

  const [data, setData] = useState<NervousSystemData>({
    weather: [],
    alerts: [],
    health: [],
    crops: [],
    lastUpdated: "",
    status: "reconnecting",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const fetchData = useCallback(async () => {
    if (!enabled) return

    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    abortControllerRef.current = new AbortController()

    try {
      setData((prev) => ({ ...prev, status: "reconnecting" }))

      const [weatherRes, alertsRes, healthRes, cropsRes] = await Promise.all([
        fetch("/api/weather", { signal: abortControllerRef.current.signal }),
        fetch("/api/alerts", { signal: abortControllerRef.current.signal }),
        fetch("/api/health", { signal: abortControllerRef.current.signal }),
        fetch("/api/crops", { signal: abortControllerRef.current.signal }),
      ])

      if (!weatherRes.ok || !alertsRes.ok || !healthRes.ok) {
        throw new Error("Failed to fetch nervous system data")
      }

      const [weatherData, alertsData, healthData, cropsData] = await Promise.all([
        weatherRes.json(),
        alertsRes.json(),
        healthRes.json(),
        cropsRes.ok ? cropsRes.json() : { data: [] },
      ])

      setData({
        weather: weatherData.data as WeatherData[],
        alerts: alertsData.alerts as DisasterAlert[],
        health: healthData.data as HealthData[],
        crops: cropsData.data as CropData[],
        lastUpdated: new Date().toISOString(),
        status: "connected",
      })
      setError(null)
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return
      console.error("Nervous system fetch error:", err)
      setError(err instanceof Error ? err : new Error("Unknown error"))
      setData((prev) => ({ ...prev, status: "error" }))
    } finally {
      setIsLoading(false)
    }
  }, [enabled])

  useEffect(() => {
    fetchData()
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [fetchData])

  useEffect(() => {
    if (!enabled) return
    const interval = setInterval(fetchData, refreshInterval)
    return () => clearInterval(interval)
  }, [fetchData, refreshInterval, enabled])

  // Computed values
  const rainfallByDistrict = data.weather.reduce(
    (acc, w) => {
      acc[w.district] = w.rainfall
      return acc
    },
    {} as Record<string, number>,
  )

  const alertsByDistrict = data.alerts.reduce(
    (acc, a) => {
      if (!acc[a.district]) acc[a.district] = []
      acc[a.district].push(a)
      return acc
    },
    {} as Record<string, DisasterAlert[]>,
  )

  const averageRainfall =
    data.weather.length > 0 ? data.weather.reduce((sum, w) => sum + w.rainfall, 0) / data.weather.length : 0

  const averageTemperature =
    data.weather.length > 0 ? data.weather.reduce((sum, w) => sum + w.temperature, 0) / data.weather.length : 0

  const criticalAlerts = data.alerts.filter((a) => a.severity === "critical" || a.severity === "high")

  const cropHealthSummary = {
    critical: data.crops.filter((c) => c.cropHealth === "critical").length,
    stressed: data.crops.filter((c) => c.cropHealth === "stressed").length,
    good: data.crops.filter((c) => c.cropHealth === "good").length,
    excellent: data.crops.filter((c) => c.cropHealth === "excellent").length,
  }

  return {
    ...data,
    isLoading,
    error,
    refetch: fetchData,
    rainfallByDistrict,
    alertsByDistrict,
    averageRainfall,
    averageTemperature,
    criticalAlerts,
    activeAlertsCount: data.alerts.length,
    monitoredDistrictsCount: data.weather.length,
    cropHealthSummary,
  }
}
