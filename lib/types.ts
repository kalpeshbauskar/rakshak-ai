export interface WeatherData {
  district: string
  rainfall: number
  temperature: number
  humidity: number
  windSpeed: number
  condition: string
  timestamp: string
  lat: number
  lon: number
}

export interface DisasterAlert {
  id: string
  title: string
  district: string
  severity: "low" | "medium" | "high" | "critical"
  type: "flood" | "cyclone" | "earthquake" | "heatwave" | "outbreak" | "drought"
  description: string
  timestamp: string
  source: string
}

export interface HealthData {
  district: string
  outbreakRisk: number
  condition: string
  diseaseRisk: {
    malaria: number
    dengue: number
    heatStroke: number
  }
  healthIndicators: {
    temperature: number
    humidity: number
    feelsLike: number
  }
  lastUpdated: string
}

export interface CropData {
  district: string
  soilMoisture: number // m³/m³
  soilTemperature: number // °C
  evapotranspiration: number // mm
  cropHealth: "excellent" | "good" | "stressed" | "critical"
  alerts: string[]
  crops: string[]
  lastUpdated: string
}

export interface ForecastDay {
  date: string
  maxTemp: number
  minTemp: number
  condition: string
  rainfall: number
  humidity: number
  icon: string
}

export interface CityForecast {
  district: string
  forecast: ForecastDay[]
  lastUpdated: string
}

export interface NervousSystemData {
  weather: WeatherData[]
  alerts: DisasterAlert[]
  health: HealthData[]
  crops: CropData[]
  lastUpdated: string
  status: "connected" | "reconnecting" | "error"
}

export interface AIReasoningRequest {
  currentRainfall: number
  district: string
  historicalAverage: number
  temperature: number
}

export interface AIReasoningResponse {
  analysis: string
  riskLevel: "low" | "medium" | "high" | "critical"
  recommendations: string[]
  curePlan: {
    english: string
    marathi: string
  }
}
