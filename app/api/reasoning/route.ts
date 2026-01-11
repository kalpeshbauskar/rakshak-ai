import { NextResponse } from "next/server"

function generateReasoning(data: {
  currentRainfall: number
  district: string
  historicalAverage: number
  temperature: number
}) {
  const { currentRainfall, district, historicalAverage, temperature } = data
  const rainfallRatio = currentRainfall / historicalAverage

  // Determine risk level based on rainfall ratio and temperature
  let riskLevel: "low" | "medium" | "high" | "critical"
  if (rainfallRatio > 2.0 || currentRainfall > 150) {
    riskLevel = "critical"
  } else if (rainfallRatio > 1.5 || currentRainfall > 100) {
    riskLevel = "high"
  } else if (rainfallRatio > 1.0 || currentRainfall > 50) {
    riskLevel = "medium"
  } else {
    riskLevel = "low"
  }

  // Generate analysis based on conditions
  const analyses = {
    critical: `CRITICAL ALERT: ${district} is experiencing extreme rainfall at ${currentRainfall}mm, which is ${(rainfallRatio * 100).toFixed(0)}% of historical average. Immediate action required. Flash flood risk is very high with current temperature at ${temperature}°C accelerating snowmelt in higher elevations.`,
    high: `HIGH RISK: Rainfall in ${district} has reached ${currentRainfall}mm, exceeding normal patterns by ${((rainfallRatio - 1) * 100).toFixed(0)}%. Water logging expected in low-lying areas. Current temperature of ${temperature}°C indicates humid conditions that may persist.`,
    medium: `MODERATE RISK: ${district} is receiving steady rainfall at ${currentRainfall}mm. This is ${rainfallRatio > 1 ? "slightly above" : "within"} the historical average of ${historicalAverage}mm. Standard monsoon protocols should remain active.`,
    low: `LOW RISK: Current rainfall in ${district} at ${currentRainfall}mm is within normal parameters. Temperature at ${temperature}°C. Conditions are stable but continued monitoring is advised during monsoon season.`,
  }

  const recommendations = {
    critical: [
      "Initiate immediate evacuation of flood-prone zones",
      "Deploy NDRF teams to high-risk areas",
      "Activate all emergency shelters and relief camps",
    ],
    high: [
      "Alert all emergency response teams for deployment",
      "Clear and inspect drainage systems in urban areas",
      "Issue public advisory through all channels",
    ],
    medium: [
      "Ensure drainage systems are clear and functional",
      "Keep emergency response teams on standby",
      "Monitor river water levels every 6 hours",
    ],
    low: [
      "Continue routine weather monitoring",
      "Verify emergency communication systems are operational",
      "Update district preparedness inventory",
    ],
  }

  const curePlans = {
    critical: {
      english:
        "Evacuate all residents from flood zones immediately. Deploy rescue boats and helicopters. Set up medical camps at relief centers. Coordinate with Army and NDRF for large-scale rescue operations.",
      marathi:
        "पूरग्रस्त भागातील सर्व रहिवाशांना तात्काळ स्थलांतरित करा. बचाव बोटी आणि हेलिकॉप्टर तैनात करा. मदत केंद्रांवर वैद्यकीय शिबिरे उभारा. मोठ्या प्रमाणावर बचाव कार्यासाठी सेना आणि NDRF शी समन्वय साधा.",
    },
    high: {
      english:
        "Pre-position relief supplies at district headquarters. Alert hospitals for potential casualties. Establish communication links with all gram panchayats. Prepare evacuation transport.",
      marathi:
        "जिल्हा मुख्यालयात मदत साहित्य तयार ठेवा. संभाव्य जखमींसाठी रुग्णालयांना सतर्क करा. सर्व ग्रामपंचायतींशी संपर्क प्रस्थापित करा. स्थलांतर वाहतूक तयार करा.",
    },
    medium: {
      english:
        "Deploy mobile weather stations to monitor conditions. Coordinate with local authorities for evacuation route planning. Ensure relief supplies are stocked and accessible.",
      marathi:
        "परिस्थितीवर लक्ष ठेवण्यासाठी मोबाईल हवामान केंद्रे तैनात करा. स्थलांतर मार्ग नियोजनासाठी स्थानिक अधिकाऱ्यांशी समन्वय साधा. मदत साहित्य तयार आणि उपलब्ध असल्याची खात्री करा.",
    },
    low: {
      english:
        "Maintain regular monitoring schedule. Verify all emergency equipment is functional. Conduct routine checks on dam water levels and spillway conditions.",
      marathi:
        "नियमित देखरेख वेळापत्रक कायम ठेवा. सर्व आपत्कालीन उपकरणे कार्यरत असल्याची पडताळणी करा. धरणाच्या पाण्याची पातळी आणि सांडव्याच्या स्थितीची नियमित तपासणी करा.",
    },
  }

  return {
    analysis: analyses[riskLevel],
    riskLevel,
    recommendations: recommendations[riskLevel],
    curePlan: curePlans[riskLevel],
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { currentRainfall, district, historicalAverage, temperature } = body

    const result = generateReasoning({
      currentRainfall: currentRainfall || 0,
      district: district || "Unknown District",
      historicalAverage: historicalAverage || 85,
      temperature: temperature || 25,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Reasoning error:", error)

    // Fallback response
    return NextResponse.json({
      analysis:
        "The current rainfall levels are within expected parameters. Continued monitoring is recommended as monsoon patterns can shift rapidly in the Sahyadri region.",
      riskLevel: "medium",
      recommendations: [
        "Ensure drainage systems are clear and functional",
        "Alert emergency response teams for standby",
        "Monitor river water levels in the next 6 hours",
      ],
      curePlan: {
        english:
          "Deploy mobile weather stations to affected areas. Coordinate with local authorities for evacuation routes. Prepare relief supplies.",
        marathi:
          "प्रभावित भागात मोबाईल हवामान केंद्रे तैनात करा. स्थलांतर मार्गांसाठी स्थानिक अधिकाऱ्यांशी समन्वय साधा. मदत साहित्य तयार ठेवा.",
      },
    })
  }
}
