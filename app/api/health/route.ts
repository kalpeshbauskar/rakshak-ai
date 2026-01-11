import { NextResponse } from "next/server"

// Maharashtra districts
const DISTRICTS = [
  { name: "Mumbai", lat: 19.07, lon: 72.87, coastal: true },
  { name: "Pune", lat: 18.52, lon: 73.85, coastal: false },
  { name: "Nagpur", lat: 21.14, lon: 79.08, coastal: false },
  { name: "Thane", lat: 19.2183, lon: 72.9781, coastal: true },
  { name: "Nashik", lat: 19.9975, lon: 73.7898, coastal: false },
  { name: "Aurangabad", lat: 19.8762, lon: 75.3433, coastal: false },
  { name: "Solapur", lat: 17.6599, lon: 75.9064, coastal: false },
  { name: "Kolhapur", lat: 16.7058, lon: 74.2433, coastal: false },
  { name: "Sangli", lat: 16.8524, lon: 74.5815, coastal: false },
  { name: "Satara", lat: 17.6805, lon: 74.0183, coastal: false },
  { name: "Ratnagiri", lat: 16.9902, lon: 73.3, coastal: true },
  { name: "Sindhudurg", lat: 15.8667, lon: 73.6358, coastal: true },
]

function calculateDiseaseRisk(temp: number, humidity: number, isCoastal: boolean) {
  // Malaria risk: High humidity (>70%) + temp between 20-35°C
  let malariaRisk = 0
  if (humidity > 70 && temp >= 20 && temp <= 35) {
    malariaRisk = Math.min(100, (humidity - 50) * 1.5 + (isCoastal ? 15 : 0))
  } else if (humidity > 60) {
    malariaRisk = (humidity - 50) * 0.8
  }

  // Dengue risk: Peaks with humidity >80% and temp 25-30°C (Aedes breeding)
  let dengueRisk = 0
  if (humidity > 75 && temp >= 25 && temp <= 32) {
    dengueRisk = Math.min(100, (humidity - 60) * 2 + (temp > 28 ? 20 : 0))
  } else if (humidity > 65) {
    dengueRisk = (humidity - 55) * 1.2
  }

  // Heat stroke risk: temp > 35 or feels like > 40
  const feelsLike = temp + (humidity > 70 ? (humidity - 70) * 0.2 : 0)
  let heatStrokeRisk = 0
  if (feelsLike > 42) heatStrokeRisk = 90
  else if (feelsLike > 38) heatStrokeRisk = 60
  else if (feelsLike > 35) heatStrokeRisk = 35
  else if (temp > 32) heatStrokeRisk = 20

  return {
    malaria: Math.round(Math.max(0, Math.min(100, malariaRisk))),
    dengue: Math.round(Math.max(0, Math.min(100, dengueRisk))),
    heatStroke: Math.round(Math.max(0, Math.min(100, heatStrokeRisk))),
  }
}

function getSimulatedHealthData() {
  const hour = new Date().getHours()
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)

  // Seasonal patterns
  const isMonsoon = dayOfYear > 150 && dayOfYear < 270
  const isWinter = dayOfYear < 60 || dayOfYear > 320
  const isSummer = dayOfYear > 90 && dayOfYear < 150

  return DISTRICTS.map((district, index) => {
    // Temperature with regional and diurnal variation
    let baseTemp = 28 + (index % 5) * 1.5
    if (isSummer) baseTemp += 10
    if (isWinter) baseTemp -= 8
    if (isMonsoon) baseTemp -= 3

    const hourFactor = Math.sin(((hour - 6) * Math.PI) / 12) * 6
    const temp = baseTemp + hourFactor

    // Humidity - coastal regions higher
    let humidity = district.coastal ? 78 : 55
    if (isMonsoon) humidity += 22
    if (isWinter) humidity -= 18
    humidity = Math.min(98, Math.max(25, humidity + ((index * 4) % 12)))

    const feelsLike = Math.round(temp + (humidity > 70 ? 4 : 0) + (temp > 35 ? 3 : 0))
    const diseaseRisk = calculateDiseaseRisk(temp, humidity, district.coastal)

    // Overall outbreak risk (weighted average)
    const outbreakRisk = Math.round(
      diseaseRisk.malaria * 0.35 + diseaseRisk.dengue * 0.4 + diseaseRisk.heatStroke * 0.25,
    )

    let condition = "Normal"
    if (outbreakRisk > 70) condition = "Critical"
    else if (outbreakRisk > 50) condition = "Warning"
    else if (outbreakRisk > 35) condition = "Elevated"

    return {
      district: district.name,
      outbreakRisk,
      condition,
      diseaseRisk,
      healthIndicators: {
        temperature: Math.round(temp),
        humidity: Math.round(humidity),
        feelsLike,
      },
      lastUpdated: new Date().toISOString(),
    }
  })
}

export async function GET() {
  try {
    const healthData = getSimulatedHealthData()

    return NextResponse.json({
      data: healthData,
      source: "AETHER Disease Surveillance (WHO/HDX Logic)",
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Health API error:", error)
    return NextResponse.json({ error: "Failed to fetch health data" }, { status: 500 })
  }
}
