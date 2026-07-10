"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/Button"
import { Wind } from "lucide-react"
import { cn } from "@/lib/utils"

type Phase = "in" | "hold" | "out"

const SEQUENCE: { phase: Phase; label: string; seconds: number }[] = [
  { phase: "in", label: "Breathe in", seconds: 4 },
  { phase: "hold", label: "Hold", seconds: 7 },
  { phase: "out", label: "Breathe out", seconds: 8 },
]

export function DailyAnchor() {
  const [active, setActive] = useState(false)
  const [step, setStep] = useState(0)
  const [count, setCount] = useState(SEQUENCE[0].seconds)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!active) return
    timer.current = setInterval(() => {
      setCount((c) => {
        if (c > 1) return c - 1
        setStep((s) => {
          const next = (s + 1) % SEQUENCE.length
          setCount(SEQUENCE[next].seconds)
          return next
        })
        return SEQUENCE[(step + 1) % SEQUENCE.length].seconds
      })
    }, 1000)
    return () => {
      if (timer.current) clearInterval(timer.current)
    }
  }, [active, step])

  const current = SEQUENCE[step]

  return (
    <Card className="bg-primary p-6 text-primary-foreground">
      <div className="flex items-center gap-2">
        <Wind className="size-5" />
        <h2 className="font-heading text-lg font-medium">Daily Anchor</h2>
      </div>
      <p className="mt-2 text-sm text-primary-foreground/80">
        Take 3 deep breaths. Focus on the sensation of air entering your lungs.
      </p>

      {active ? (
        <div className="mt-6 flex flex-col items-center">
          <div
            className={cn(
              "flex size-28 items-center justify-center rounded-full bg-primary-foreground/15 ring-1 ring-primary-foreground/30 transition-transform duration-1000 ease-in-out",
              current.phase === "in" && "scale-110",
              current.phase === "out" && "scale-90",
            )}
          >
            <span className="text-3xl font-semibold tabular-nums">{count}</span>
          </div>
          <p className="mt-4 text-sm font-medium">{current.label}</p>
          <Button
            variant="secondary"
            size="sm"
            className="mt-4"
            onClick={() => {
              setActive(false)
              setStep(0)
              setCount(SEQUENCE[0].seconds)
            }}
          >
            End session
          </Button>
        </div>
      ) : (
        <Button
          variant="secondary"
          className="mt-5 w-full"
          onClick={() => setActive(true)}
        >
          Start Breathing Exercise
        </Button>
      )}
    </Card>
  )
}
