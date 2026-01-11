"use client"

import { useState, useCallback } from "react"
import type { AIReasoningResponse } from "@/lib/types"

interface UseAIReasoningOptions {
  onComplete?: (response: AIReasoningResponse) => void
}

export function useAIReasoning(options: UseAIReasoningOptions = {}) {
  const { onComplete } = options

  const [response, setResponse] = useState<AIReasoningResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const analyze = useCallback(
    async (params: { currentRainfall: number; district: string; historicalAverage?: number; temperature?: number }) => {
      setIsLoading(true)
      setError(null)

      try {
        const res = await fetch("/api/reasoning", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            currentRainfall: params.currentRainfall,
            district: params.district,
            historicalAverage: params.historicalAverage || 45,
            temperature: params.temperature || 28,
          }),
        })

        if (!res.ok) {
          throw new Error("Failed to get AI analysis")
        }

        const data = (await res.json()) as AIReasoningResponse
        setResponse(data)
        onComplete?.(data)
        return data
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Unknown error")
        setError(error)
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [onComplete],
  )

  const reset = useCallback(() => {
    setResponse(null)
    setError(null)
  }, [])

  return {
    response,
    isLoading,
    error,
    analyze,
    reset,
  }
}
