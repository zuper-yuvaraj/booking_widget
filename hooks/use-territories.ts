"use client"

import { useState, useEffect } from "react"
import { ZUPER_API_BASE } from "@/configs"
import type { Territory } from "@/types/booking"

export function useTerritories() {
  const [territories, setTerritories] = useState<Territory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_ZUPER_API_KEY ?? ""
    fetch(
      `${ZUPER_API_BASE}/api/territory?count=200&page=1&sort=DESC&sort_by=territory_name&populate_owners=true&filter.is_active=true`,
      { headers: { "x-api-key": apiKey } }
    )
      .then((r) => r.json())
      .then((data) => {
        const list = data?.data ?? data ?? []
        const mapped: Territory[] = Array.isArray(list)
          ? list
              .map((t: Record<string, unknown>) => ({
                id: String(t.territory_uid ?? t.id ?? t._id ?? ""),
                name: String(t.territory_name ?? t.name ?? ""),
              }))
              .filter((t) => t.name)
          : []
        console.log("[useTerritories] loaded:", mapped.length, "territories")
        setTerritories(mapped)
      })
      .catch((err) => console.error("[useTerritories] failed:", err))
      .finally(() => setLoading(false))
  }, [])

  return { territories, loading }
}
