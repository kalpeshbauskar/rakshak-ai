"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { Typewriter } from "@/components/ui/typewriter"
import { PulseIndicator } from "@/components/ui/pulse-indicator"
import { TrustBadge } from "@/components/ui/trust-badge"
import { Brain, Sparkles, RefreshCw, AlertCircle, CheckCircle2, Languages } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAIReasoning } from "@/hooks/use-ai-reasoning"
import type { WeatherData } from "@/lib/types"
import { cn } from "@/lib/utils"

interface AIReasoningOrganProps {
  weather: WeatherData[]
  selectedDistrict?: string
}

export function AIReasoningOrgan({ weather, selectedDistrict = "Mumbai" }: AIReasoningOrganProps) {
  const { response, isLoading, error, analyze, reset } = useAIReasoning()
  const [showMarathi, setShowMarathi] = useState(false)

  const districtWeather = weather.find((w) => w.district === selectedDistrict)

  const handleAnalyze = async () => {
    if (!districtWeather) return

    await analyze({
      currentRainfall: districtWeather.rainfall,
      district: selectedDistrict,
      historicalAverage: 45,
      temperature: districtWeather.temperature,
    })
  }

  const riskColors = {
    low: "text-green-400",
    medium: "text-yellow-400",
    high: "text-orange-400",
    critical: "text-red-400",
  }

  const riskIndicators: Record<string, "active" | "warning" | "critical"> = {
    low: "active",
    medium: "warning",
    high: "warning",
    critical: "critical",
  }

  return (
    <GlassCard className="h-full" glow="violet">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <motion.div
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center"
                animate={isLoading ? { rotate: [0, 360] } : {}}
                transition={{ duration: 2, repeat: isLoading ? Number.POSITIVE_INFINITY : 0, ease: "linear" }}
              >
                <Brain className="w-5 h-5 text-white" />
              </motion.div>
              <div className="absolute -top-1 -right-1">
                <PulseIndicator status={isLoading ? "warning" : response ? "active" : "inactive"} size="sm" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">AETHER Brain</h3>
              <p className="text-xs text-muted-foreground">AI Reasoning Engine</p>
            </div>
          </div>
          <TrustBadge variant="blockchain" />
        </div>

        {/* District Selector */}
        <div className="mb-4 p-3 rounded-xl bg-secondary/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Analyzing</p>
              <p className="font-medium text-foreground">{selectedDistrict}</p>
            </div>
            {districtWeather && (
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Current Rainfall</p>
                <p className="font-mono font-bold text-foreground">{districtWeather.rainfall.toFixed(1)}mm</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        {!response && !isLoading && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Button
              onClick={handleAnalyze}
              disabled={!districtWeather}
              className="w-full mb-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white border-0"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Analysis
            </Button>
          </motion.div>
        )}

        {/* Loading State */}
        <AnimatePresence mode="wait">
          {isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex items-center justify-center"
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
                <p className="text-sm text-muted-foreground">AETHER Brain Processing...</p>
                <p className="text-xs text-muted-foreground mt-1">Analyzing Sahyadri historical data</p>
              </div>
            </motion.div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex items-center justify-center"
            >
              <div className="text-center">
                <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-2" />
                <p className="text-sm text-red-400">Analysis failed</p>
                <Button variant="ghost" size="sm" onClick={reset} className="mt-2">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retry
                </Button>
              </div>
            </motion.div>
          )}

          {/* Results */}
          {response && !isLoading && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex-1 overflow-auto space-y-4"
            >
              {/* Risk Level */}
              <div className="flex items-center gap-2">
                <PulseIndicator status={riskIndicators[response.riskLevel]} />
                <span className={cn("font-semibold uppercase text-sm", riskColors[response.riskLevel])}>
                  {response.riskLevel} Risk
                </span>
              </div>

              {/* Analysis */}
              <div className="p-3 rounded-xl bg-secondary/30">
                <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">Analysis</p>
                <Typewriter text={response.analysis} speed={15} className="text-sm text-foreground leading-relaxed" />
              </div>

              {/* Recommendations */}
              <div>
                <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">Recommendations</p>
                <div className="space-y-2">
                  {response.recommendations.map((rec, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.2 }}
                      className="flex items-start gap-2 p-2 rounded-lg bg-secondary/20"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                      <span className="text-sm text-foreground">{rec}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Cure Plan Toggle */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Cure Plan</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowMarathi(!showMarathi)}
                    className="h-6 text-xs"
                  >
                    <Languages className="w-3 h-3 mr-1" />
                    {showMarathi ? "English" : "मराठी"}
                  </Button>
                </div>
                <motion.div
                  key={showMarathi ? "marathi" : "english"}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/20"
                >
                  <p className="text-sm text-foreground leading-relaxed">
                    {showMarathi ? response.curePlan.marathi : response.curePlan.english}
                  </p>
                </motion.div>
              </div>

              {/* Reset Button */}
              <Button variant="outline" size="sm" onClick={reset} className="w-full bg-transparent">
                <RefreshCw className="w-4 h-4 mr-2" />
                New Analysis
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </GlassCard>
  )
}
