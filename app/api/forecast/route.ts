import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const city = searchParams.get("city") || "Mumbai"

  try {
    // wttr.in provides free weather data with JSON format
    const response = await fetch(
      `https://wttr.in/${encodeURIComponent(city)},Maharashtra?format=j1`,
      { next: { revalidate: 3600 } }, // Cache for 1 hour
    )

    if (!response.ok) {
      throw new Error("wttr.in API failed")
    }

    const data = await response.json()

    // Parse wttr.in response into our forecast format
    const forecast =
      data.weather?.map(
        (day: {
          date: string
          maxtempC: string
          mintempC: string
          hourly: Array<{
            weatherDesc: Array<{ value: string }>
            precipMM: string
            humidity: string
            weatherCode: string
          }>
        }) => {
          const avgHumidity =
            day.hourly.reduce((sum: number, h: { humidity: string }) => sum + Number.parseInt(h.humidity), 0) /
            day.hourly.length
          const totalRain = day.hourly.reduce(
            (sum: number, h: { precipMM: string }) => sum + Number.parseFloat(h.precipMM),
            0,
          )

          return {
            date: day.date,
            maxTemp: Number.parseInt(day.maxtempC),
            minTemp: Number.parseInt(day.mintempC),
            condition: day.hourly[4]?.weatherDesc?.[0]?.value || "Clear",
            rainfall: Math.round(totalRain * 10) / 10,
            humidity: Math.round(avgHumidity),
            icon: getWeatherIcon(day.hourly[4]?.weatherCode || "113"),
          }
        },
      ) || []

    return NextResponse.json({
      district: city,
      forecast,
      current: {
        temp: Number.parseInt(data.current_condition?.[0]?.temp_C || "28"),
        feelsLike: Number.parseInt(data.current_condition?.[0]?.FeelsLikeC || "30"),
        humidity: Number.parseInt(data.current_condition?.[0]?.humidity || "65"),
        condition: data.current_condition?.[0]?.weatherDesc?.[0]?.value || "Clear",
      },
      source: "wttr.in (Free)",
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Forecast API error:", error)
    // Fallback forecast
    const fallback = Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() + i * 86400000).toISOString().split("T")[0],
      maxTemp: 32 + Math.floor(Math.random() * 5),
      minTemp: 24 + Math.floor(Math.random() * 4),
      condition: ["Clear", "Partly Cloudy", "Cloudy", "Rain"][Math.floor(Math.random() * 4)],
      rainfall: Math.random() * 20,
      humidity: 60 + Math.floor(Math.random() * 25),
      icon: "☀️",
    }))

    return NextResponse.json({
      district: city,
      forecast: fallback,
      source: "AETHER Fallback",
      lastUpdated: new Date().toISOString(),
    })
  }
}

function getWeatherIcon(code: string): string {
  const icons: Record<string, string> = {
    "113": "☀️",
    "116": "⛅",
    "119": "☁️",
    "122": "☁️",
    "143": "🌫️",
    "176": "🌧️",
    "179": "🌨️",
    "182": "🌧️",
    "200": "⛈️",
    "227": "🌨️",
    "230": "❄️",
    "248": "🌫️",
    "260": "🌫️",
    "263": "🌧️",
    "266": "🌧️",
    "293": "🌧️",
    "296": "🌧️",
    "299": "🌧️",
    "302": "🌧️",
    "305": "🌧️",
    "308": "🌧️",
    "311": "🌧️",
    "314": "🌧️",
    "317": "🌧️",
    "320": "🌨️",
    "323": "🌨️",
    "326": "🌨️",
    "329": "❄️",
    "332": "❄️",
    "335": "❄️",
    "338": "❄️",
    "350": "🌧️",
    "353": "🌧️",
    "356": "🌧️",
    "359": "🌧️",
    "362": "🌧️",
    "365": "🌧️",
    "368": "🌨️",
    "371": "🌨️",
    "374": "🌧️",
    "377": "🌧️",
    "386": "⛈️",
    "389": "⛈️",
    "392": "⛈️",
    "395": "❄️",
  }
  return icons[code] || "☀️"
}
