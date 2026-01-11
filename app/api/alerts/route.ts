import { NextResponse } from "next/server"

// Real NDMA SACHET RSS feed endpoints
const SACHET_FEEDS = ["https://sachet.ndma.gov.in/cap_public_website/FetchCAPAlert"]

interface NDMAAlert {
  identifier: string
  sent: string
  headline: string
  description: string
  severity: string
  urgency: string
  areaDesc: string
  event: string
}

async function fetchNDMAAlerts(): Promise<NDMAAlert[]> {
  try {
    // NDMA SACHET provides CAP (Common Alerting Protocol) format
    const response = await fetch("https://sachet.ndma.gov.in/cap_public_website/FetchCAPAlert", {
      headers: {
        Accept: "application/json",
      },
      next: { revalidate: 60 }, // Cache for 60 seconds
    })

    if (response.ok) {
      const data = await response.json()
      return data.alerts || []
    }
  } catch (error) {
    console.error("NDMA SACHET fetch error:", error)
  }
  return []
}

async function fetchEarthquakeAlerts() {
  try {
    // USGS Earthquake API - free, no key needed
    // Filter for India region (rough bounding box for Maharashtra area)
    const response = await fetch(
      "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&minlatitude=15&maxlatitude=22&minlongitude=72&maxlongitude=81&minmagnitude=3&limit=10&orderby=time",
      { next: { revalidate: 300 } }, // Cache for 5 minutes
    )

    if (response.ok) {
      const data = await response.json()
      return data.features.map(
        (eq: {
          id: string
          properties: { title: string; mag: number; place: string; time: number }
          geometry: { coordinates: number[] }
        }) => ({
          id: `eq-${eq.id}`,
          title: eq.properties.title,
          district: eq.properties.place,
          severity: eq.properties.mag >= 5 ? "critical" : eq.properties.mag >= 4 ? "high" : "medium",
          type: "earthquake" as const,
          description: `Magnitude ${eq.properties.mag} earthquake detected`,
          source: "USGS",
          timestamp: new Date(eq.properties.time).toISOString(),
          coordinates: eq.geometry.coordinates,
        }),
      )
    }
  } catch (error) {
    console.error("USGS earthquake fetch error:", error)
  }
  return []
}

// Maharashtra districts for weather-based alerts
const MAHARASHTRA_COORDS = [
  { name: "Mumbai", lat: 19.076, lon: 72.8777 },
  { name: "Pune", lat: 18.5204, lon: 73.8567 },
  { name: "Kolhapur", lat: 16.7058, lon: 74.2433 },
  { name: "Ratnagiri", lat: 16.9902, lon: 73.3 },
]

async function fetchWeatherAlerts() {
  const alerts = []

  for (const city of MAHARASHTRA_COORDS) {
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=precipitation,weather_code&timezone=Asia/Kolkata`,
        { next: { revalidate: 60 } },
      )

      if (response.ok) {
        const data = await response.json()
        const precipitation = data.current.precipitation || 0
        const weatherCode = data.current.weather_code

        // Heavy rain alert (>50mm)
        if (precipitation > 50) {
          alerts.push({
            id: `rain-${city.name}-${Date.now()}`,
            title: "Heavy Rainfall Warning",
            district: city.name,
            severity: precipitation > 100 ? "critical" : "high",
            type: "flood" as const,
            description: `Heavy rainfall of ${precipitation}mm recorded. Risk of waterlogging in low-lying areas.`,
            source: "Open-Meteo",
            timestamp: new Date().toISOString(),
          })
        }

        // Thunderstorm alert
        if (weatherCode >= 95) {
          alerts.push({
            id: `storm-${city.name}-${Date.now()}`,
            title: "Thunderstorm Alert",
            district: city.name,
            severity: weatherCode >= 99 ? "high" : "medium",
            type: "cyclone" as const,
            description: "Thunderstorm activity detected. Stay indoors and avoid open areas.",
            source: "Open-Meteo",
            timestamp: new Date().toISOString(),
          })
        }
      }
    } catch (error) {
      console.error(`Weather alert fetch error for ${city.name}:`, error)
    }
  }

  return alerts
}

export async function GET() {
  try {
    // Fetch all alert types in parallel
    const [earthquakeAlerts, weatherAlerts] = await Promise.all([fetchEarthquakeAlerts(), fetchWeatherAlerts()])

    // Combine all alerts
    const allAlerts = [...earthquakeAlerts, ...weatherAlerts]

    return NextResponse.json({
      alerts: allAlerts,
      sources: ["USGS Earthquake API", "Open-Meteo Weather API"],
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Alerts API error:", error)
    return NextResponse.json({ error: "Failed to fetch alerts" }, { status: 500 })
  }
}
