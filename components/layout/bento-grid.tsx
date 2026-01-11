"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface BentoGridProps {
  children: ReactNode
  className?: string
}

export function BentoGrid({ children, className }: BentoGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 auto-rows-[minmax(120px,auto)] gap-4 lg:gap-6",
        className,
      )}
    >
      {children}
    </div>
  )
}

interface BentoItemProps {
  children: ReactNode
  className?: string
  colSpan?: 1 | 2 | 3 | 4
  rowSpan?: 1 | 2 | 3 | 4 | 5 | 6
  delay?: number
}

export function BentoItem({ children, className, colSpan = 1, rowSpan = 1, delay = 0 }: BentoItemProps) {
  const colSpanClasses = {
    1: "lg:col-span-1",
    2: "lg:col-span-2",
    3: "lg:col-span-3",
    4: "lg:col-span-4",
  }

  const rowSpanClasses = {
    1: "lg:row-span-1",
    2: "lg:row-span-2",
    3: "lg:row-span-3",
    4: "lg:row-span-4",
    5: "lg:row-span-5",
    6: "lg:row-span-6",
  }

  return (
    <motion.div
      className={cn(colSpanClasses[colSpan], rowSpanClasses[rowSpan], className)}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 20,
        delay: delay * 0.1,
      }}
    >
      {children}
    </motion.div>
  )
}
