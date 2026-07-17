"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

const initialToggles = [
  {
    key: "email_digest",
    label: "Weekly email digest",
    description: "A summary of activity in your communities.",
    defaultChecked: true,
  },
  {
    key: "message_notifications",
    label: "Message notifications",
    description: "Get notified when someone sends you a message.",
    defaultChecked: true,
  },
  {
    key: "post_replies",
    label: "Replies to your posts",
    description: "Get notified when someone comments or supports your post.",
    defaultChecked: true,
  },
  {
    key: "anonymous_default",
    label: "Post anonymously by default",
    description: "New posts start with anonymous posting turned on.",
    defaultChecked: false,
  },
] as const

export function SettingsToggles() {
  const [state, setState] = useState<Record<string, boolean>>(
    Object.fromEntries(initialToggles.map((t) => [t.key, t.defaultChecked])),
  )

  return (
    <Card className="divide-y divide-border p-0">
      {initialToggles.map((toggle) => (
        <div key={toggle.key} className="flex items-center justify-between gap-4 p-5">
          <div className="min-w-0">
            <Label htmlFor={toggle.key} className="font-medium">
              {toggle.label}
            </Label>
            <p className="mt-0.5 text-sm text-muted-foreground">{toggle.description}</p>
          </div>
          <Switch
            id={toggle.key}
            checked={state[toggle.key]}
            onCheckedChange={(checked) =>
              setState((prev) => ({ ...prev, [toggle.key]: checked }))
            }
          />
        </div>
      ))}
    </Card>
  )
}
