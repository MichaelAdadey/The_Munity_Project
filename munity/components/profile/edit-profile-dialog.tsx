"use client"

import { useState } from "react"
import { Pencil } from "lucide-react"
import { Button } from "@/components/ui/Button"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Profile } from "@/lib/types"

export function EditProfileDialog({ user }: { user: Profile }) {
  const [fullName, setFullName] = useState(user.full_name)
  const [bio, setBio] = useState(user.bio ?? "")

  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" className="rounded-full" />}>
        <Pencil className="size-4" />
        Edit profile
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            This preview only updates your profile locally — connect Supabase to persist changes.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">Full name</Label>
            <Input id="full_name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="min-h-24 resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose render={<Button variant="outline" className="rounded-full" />}>
            Cancel
          </DialogClose>
          <DialogClose render={<Button className="rounded-full" />}>Save changes</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
