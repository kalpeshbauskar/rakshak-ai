import { NextResponse } from "next/server"

// Maharashtra cities with coordinates
const CITIES = [
  { name: "Mumbai", lat: 19.07, lon: 72.87 },
  { name: "Pune", lat: 18.52, lon: 73.85 },
  { name: "Nagpur", lat: 21.14, lon: 79.08 },
  { name: "Thane", lat: 19.2183, lon: 72.9781 },
  { name: "Nashik", lat: 19.9975, lon: 73.7898 },
  { name: "Aurangabad", lat: 19.8762, lon: 75.3433 },
  { name: "Solapur", lat: 17.6599, lon: 75.9064 },
  { name: "Kolhapur", lat: 16.7058, lon: 74.2433 },
  { name: "Sangli", lat: 16.8524, lon: 74.5815 },
  { name: "Satara", lat: 17.6805, lon: 74.0183 },
  { name: "Ratnagiri", lat: 16.9902, lon: 73.3 },
  { name: "Sindhudurg", lat: 15.8667, lon: 73.6358 },
]

function generateRealisticWeather(city: { name: string; lat: number; lon: number }) {
  const now = new Date()
  const hour = now.getHours()
  const month = now.getMonth()

  // Seasonal temperature adjustment (monsoon: Jun-Sep, summer: Mar-May, winter: Nov-Feb)
  const isMonsoon = month >= 5 && month <= 8
  const isSummer = month >= 2 && month <= 4
  const isWinter = month >= 10 || month <= 1

  // Base temperature varies by latitude (north is cooler)
  const latFactor = (city.lat - 16) / 5 // 0-1 scale based on Maharashtra's lat range
  let baseTemp = 28 - latFactor * 3

  if (isSummer) baseTemp += 6
  else if (isWinter) baseTemp -= 4
  else if (isMonsoon) baseTemp -= 2

  // Diurnal variation
  const hourFactor = Math.sin(((hour - 6) * Math.PI) / 12)
  const temperature = baseTemp + hourFactor * 5 + (Math.random() - 0.5) * 2

  // Humidity - higher in monsoon and coastal areas
  const isCoastal =
    city.name === "Mumbai" || city.name === "Thane" || city.name === "Ratnagiri" || city.name === "Sindhudurg"
  let humidity = 55 + (isCoastal ? 15 : 0) + (isMonsoon ? 20 : 0)
  humidity += (Math.random() - 0.5) * 15
  humidity = Math.min(95, Math.max(30, humidity))

  // Rainfall - much higher in monsoon
  let rainfall = 0
  if (isMonsoon) {
    rainfall = Math.random() < 0.6 ? Math.random() * 25 : 0
    if (isCoastal) rainfall *= 1.5
  } else {
    rainfall = Math.random() < 0.1 ? Math.random() * 5 : 0
  }

  // Wind speed
  const windSpeed = 5 + Math.random() * 15 + (isCoastal ? 5 : 0)

  // Weather condition based on rainfall and humidity
  let condition = "Clear"
  let code = 0
  if (rainfall > 10) {
    condition = "Heavy Rain"
    code = 65
  } else if (rainfall > 5) {
    condition = "Rain"
    code = 63
  } else if (rainfall > 0) {
    condition = "Light Rain"
    code = 61
  } else if (humidity > 80) {
    condition = "Overcast"
    code = 3
  } else if (humidity > 65) {
    condition = "Partly Cloudy"
    code = 2
  } else {
    condition = "Clear"
    code = 0
  }

  return {
    district: city.name,
    lat: city.lat,
    lon: city.lon,
    rainfall: Math.round(rainfall * 10) / 10,
    temperature: Math.round(temperature * 10) / 10,
    humidity: Math.round(humidity),
    windSpeed: Math.round(windSpeed * 10) / 10,
    condition,
    weatherCode: code,
    timestamp: now.toISOString(),
  }
}

export async function GET() {
  try {
    const weatherData = CITIES.map((city) => generateRealisticWeather(city))

    return NextResponse.json({
      data: weatherData,
      source: "AETHER Climate Model",
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Weather generation error:", error)

    // Fallback with basic random data
    const fallbackData = CITIES.map((city) => ({
      district: city.name,
      lat: city.lat,
      lon: city.lon,
      rainfall: Math.random() * 30,
      temperature: 26 + Math.random() * 10,
      humidity: 55 + Math.random() * 35,
      windSpeed: 5 + Math.random() * 20,
      condition: "Partly Cloudy",
      weatherCode: 2,
      timestamp: new Date().toISOString(),
    }))

    return NextResponse.json({
      data: fallbackData,
      source: "AETHER Fallback Model",
      lastUpdated: new Date().toISOString(),
    })
  }
}
