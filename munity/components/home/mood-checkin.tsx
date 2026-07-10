"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"

const FEELINGS = ["Calm", "Anxious", "Optimistic", "Tired", "Grateful", "Overwhelmed"]

export function MoodCheckin() {
  const [value, setValue] = useState([50])
  const [selected, setSelected] = useState<string[]>([])
  const [saved, setSaved] = useState(false)

  function toggle(feeling: string) {
    setSelected((prev) =>
      prev.includes(feeling) ? prev.filter((f) => f !== feeling) : [...prev, feeling],
    )
  }

  const label = value[0] < 33 ? "Struggling" : value[0] < 66 ? "Balanced" : "Thriving"

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">How are you feeling today?</h2>
          <p className="text-sm text-muted-foreground">Track your nurtured stability to see patterns over time.</p>
        </div>
        <Badge variant="secondary" className="shrink-0">
          Daily Check-in
        </Badge>
      </div>

      <div className="mt-6">
        <Slider
          value={value}
          onValueChange={(next) => setValue(Array.isArray(next) ? [...next] : [next])}
          max={100}
          step={1}
          aria-label="Mood level"
        />
        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          <span>Struggling</span>
          <span className="font-medium text-foreground">{label}</span>
          <span>Thriving</span>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {FEELINGS.map((feeling) => (
          <button
            key={feeling}
            type="button"
            onClick={() => toggle(feeling)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm transition-colors",
              selected.includes(feeling)
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-foreground hover:bg-muted",
            )}
          >
            {feeling}
          </button>
        ))}
      </div>

      <Button
        className="mt-6 w-full sm:w-auto"
        onClick={() => setSaved(true)}
        disabled={saved}
      >
        {saved ? "Check-in saved" : "Save today's check-in"}
      </Button>
    </Card>
  )
}
