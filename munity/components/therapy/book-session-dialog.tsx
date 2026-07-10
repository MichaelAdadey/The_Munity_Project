"use client"

import { useState } from "react"
import { CalendarCheck2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import type { Therapist } from "@/lib/types"

export function BookSessionDialog({ therapist }: { therapist: Therapist }) {
  const [sessionType, setSessionType] = useState(therapist.session_types[0])
  const [confirmed, setConfirmed] = useState(false)

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) setConfirmed(false)
      }}
    >
      <DialogTrigger render={<Button className="w-full rounded-full" size="lg" />}>
        <CalendarCheck2 className="size-4" />
        Book a session
      </DialogTrigger>
      <DialogContent>
        {confirmed ? (
          <div className="py-4 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <CalendarCheck2 className="size-6" />
            </div>
            <h2 className="mt-4 font-semibold">Session requested</h2>
            <p className="mt-1 text-sm text-pretty text-muted-foreground">
              {therapist.full_name} will confirm your {sessionType.toLowerCase()} session for{" "}
              {therapist.next_available}. You'll get a message once it's confirmed.
            </p>
            <div className="mt-5">
              <DialogClose
                render={<Button variant="outline" className="w-full rounded-full" />}
              >
                Done
              </DialogClose>
            </div>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Book a session with {therapist.full_name}</DialogTitle>
              <DialogDescription>
                Next available: {therapist.next_available} · ${therapist.hourly_rate}/session
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3">
              <Label>Session type</Label>
              <div className="flex flex-wrap gap-2">
                {therapist.session_types.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSessionType(type)}
                    className={cn(
                      "rounded-full border px-4 py-1.5 text-sm transition-colors",
                      sessionType === type
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-muted-foreground hover:bg-muted",
                    )}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <DialogFooter>
              <DialogClose render={<Button variant="outline" className="rounded-full" />}>
                Cancel
              </DialogClose>
              <Button className="rounded-full" onClick={() => setConfirmed(true)}>
                Request session
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
