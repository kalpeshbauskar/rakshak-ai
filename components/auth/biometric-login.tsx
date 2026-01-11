"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { TrustBadge } from "@/components/ui/trust-badge"
import { Button } from "@/components/ui/button"
import { Fingerprint, KeyRound, Shield, CheckCircle2, Brain, Loader2 } from "lucide-react"

interface BiometricLoginProps {
  onSuccess: () => void
}

export function BiometricLogin({ onSuccess }: BiometricLoginProps) {
  const [stage, setStage] = useState<"idle" | "scanning" | "verifying" | "success">("idle")

  const handleBiometricLogin = async () => {
    setStage("scanning")

    // Simulate biometric scan
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setStage("verifying")

    // Simulate verification
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setStage("success")

    // Proceed to dashboard
    await new Promise((resolve) => setTimeout(resolve, 800))
    onSuccess()
  }

  const handlePasskeyLogin = async () => {
    setStage("verifying")

    // Simulate passkey verification
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setStage("success")

    await new Promise((resolve) => setTimeout(resolve, 800))
    onSuccess()
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <GlassCard className="p-8" glow="violet">
          {/* Logo */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              AETHER<span className="text-primary">.AI</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Digital Nervous System of Maharashtra</p>
          </motion.div>

          {/* Trust Badges */}
          <div className="flex justify-center gap-2 mb-8">
            <TrustBadge variant="gov-verified" />
            <TrustBadge variant="blockchain" />
          </div>

          {/* Login Content */}
          <AnimatePresence mode="wait">
            {stage === "idle" && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <Button
                  onClick={handleBiometricLogin}
                  className="w-full h-14 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white border-0"
                >
                  <Fingerprint className="w-5 h-5 mr-3" />
                  Biometric Authentication
                </Button>

                <Button
                  onClick={handlePasskeyLogin}
                  variant="outline"
                  className="w-full h-14 bg-secondary/30 border-border hover:bg-secondary/50"
                >
                  <KeyRound className="w-5 h-5 mr-3" />
                  Passkey Login
                </Button>

                <p className="text-xs text-center text-muted-foreground mt-6">Authorized government personnel only</p>
              </motion.div>
            )}

            {stage === "scanning" && (
              <motion.div
                key="scanning"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-8"
              >
                <motion.div
                  className="w-24 h-24 mx-auto mb-4 rounded-full border-2 border-violet-500 flex items-center justify-center"
                  animate={{
                    boxShadow: [
                      "0 0 0 0 rgba(139, 92, 246, 0)",
                      "0 0 0 20px rgba(139, 92, 246, 0.1)",
                      "0 0 0 0 rgba(139, 92, 246, 0)",
                    ],
                  }}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                >
                  <Fingerprint className="w-12 h-12 text-violet-400" />
                </motion.div>
                <p className="text-foreground font-medium">Scanning biometric...</p>
                <p className="text-sm text-muted-foreground">Place your finger on the sensor</p>
              </motion.div>
            )}

            {stage === "verifying" && (
              <motion.div
                key="verifying"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-8"
              >
                <motion.div
                  className="w-24 h-24 mx-auto mb-4 rounded-full bg-secondary/30 flex items-center justify-center"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                >
                  <Loader2 className="w-12 h-12 text-violet-400" />
                </motion.div>
                <p className="text-foreground font-medium">Verifying credentials...</p>
                <p className="text-sm text-muted-foreground">Connecting to secure network</p>
              </motion.div>
            )}

            {stage === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-8"
              >
                <motion.div
                  className="w-24 h-24 mx-auto mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                </motion.div>
                <p className="text-foreground font-medium">Access Granted</p>
                <p className="text-sm text-muted-foreground">Initializing AETHER.AI...</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Security Notice */}
          <motion.div
            className="mt-8 p-3 rounded-xl bg-secondary/30 flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Shield className="w-5 h-5 text-violet-400 shrink-0" />
            <p className="text-xs text-muted-foreground">
              256-bit encrypted connection with zero-knowledge proof authentication
            </p>
          </motion.div>
        </GlassCard>
      </motion.div>
    </div>
  )
}
