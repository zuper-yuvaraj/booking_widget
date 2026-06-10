"use client"

import { useState, useCallback } from "react"
import { ZUPER_API_BASE } from "@/configs"

export interface UserProfile {
  user_uid: string
  first_name: string
  last_name: string
  designation: string
  profile_picture: string
  bio: string
}

function extractBio(data: Record<string, unknown>): string {
  // Primary: find custom field by label (case-insensitive)
  const fields = data?.custom_fields as Record<string, unknown>[] | undefined
  if (Array.isArray(fields)) {
    const match = fields.find(
      (f) => typeof f.label === "string" &&
        f.label.toLowerCase().includes("biography")
    )
    if (match && typeof match.value === "string" && match.value.trim()) {
      return match.value.trim()
    }
  }

  // Fallback: check custom_field_internal_object for any key containing "biography"
  const internal = data?.custom_field_internal_object as Record<string, unknown> | undefined
  if (internal) {
    const key = Object.keys(internal).find((k) => k.includes("biography"))
    if (key && typeof internal[key] === "string" && (internal[key] as string).trim()) {
      return (internal[key] as string).trim()
    }
  }

  return ""
}

export function useUserProfiles() {
  const [profiles, setProfiles] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(false)

  const fetchProfiles = useCallback(async (userUids: string[]) => {
    if (userUids.length === 0) return
    setLoading(true)
    setProfiles([])
    try {
      const apiKey = process.env.NEXT_PUBLIC_ZUPER_API_KEY ?? ""
      const results = await Promise.all(
        userUids.map(async (uid) => {
          try {
            const res = await fetch(`${ZUPER_API_BASE}/api/user/${uid}`, {
              headers: { "x-api-key": apiKey },
            })
            const json = await res.json()
            const data = (json?.data ?? json) as Record<string, unknown>
            const bio = extractBio(data)
            console.log(`[useUserProfiles] uid=${uid} bio="${bio}"`, "custom_fields:", data?.custom_fields)
            return {
              user_uid: (data?.user_uid as string) ?? uid,
              first_name: (data?.first_name as string) ?? "",
              last_name: (data?.last_name as string) ?? "",
              designation: (data?.designation as string) ?? "",
              profile_picture: (data?.profile_picture as string) ?? "",
              bio,
            } satisfies UserProfile
          } catch {
            return null
          }
        })
      )
      setProfiles(results.filter(Boolean) as UserProfile[])
    } finally {
      setLoading(false)
    }
  }, [])

  return { profiles, loading, fetchProfiles }
}
