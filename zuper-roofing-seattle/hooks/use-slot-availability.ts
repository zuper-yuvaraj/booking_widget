"use client"

import { useState, useCallback } from "react"
import { SLOT_AVAILABILITY_WEBHOOK } from "@/configs"
import type { AvailabilityData, UserProfile } from "@/types/booking"

type SlotStatus = "idle" | "loading" | "loaded" | "error"

export function useSlotAvailability() {
  const [status, setStatus] = useState<SlotStatus>("idle")
  const [availability, setAvailability] = useState<AvailabilityData[]>([])
  const [users, setUsers] = useState<UserProfile[]>([])

  const fetchSlots = useCallback(async (date: string) => {
    setStatus("loading")
    setAvailability([])
    setUsers([])
    try {
      const res = await fetch(SLOT_AVAILABILITY_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, serviceType: "inspection" }),
      })
      const data = await res.json()
      // Handle both shapes: { data: { availability, users } } or { availability, users }
      const root = data?.data ?? data
      const list: AvailabilityData[] = root?.availability ?? []
      const userList: UserProfile[] = (root?.users ?? []).map((u: Record<string, unknown>) => ({
        user_uid: String(u.user_uid ?? ""),
        first_name: String(u.first_name ?? ""),
        last_name: String(u.last_name ?? ""),
        designation: String(u.designation ?? ""),
        profile_picture: String(u.profile_picture ?? ""),
        bio: String(u.bio ?? ""),
      }))
      setAvailability(list)
      setUsers(userList)
      setStatus("loaded")
    } catch (err) {
      console.error("[useSlotAvailability] error:", err)
      setStatus("error")
    }
  }, [])

  return { status, availability, users, fetchSlots }
}
