"use client"

import { useState, useCallback } from "react"
import { SERVICE_AREA_CHECK_WEBHOOK } from "@/configs"
import type { ServiceAreaStatus } from "@/types/booking"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseResponse(body: any): { matched: boolean | null; territoryName: string } {
  if (!body || typeof body !== "object") return { matched: null, territoryName: "" }
  const obj = Array.isArray(body) ? body[0] : body
  if (!obj) return { matched: null, territoryName: "" }
  const root = obj.data ?? obj

  // n8n returns { "success": true/false, "territory_name": "...", "message": "..." }
  const raw = root.success ?? root.matched ?? root.is_serviced ?? root.serviced ?? undefined
  const territoryName = String(root.territory_name ?? root.territoryName ?? root.territory ?? "")

  if (raw === true || raw === "true" || raw === 1) return { matched: true, territoryName }
  if (raw === false || raw === "false" || raw === 0) return { matched: false, territoryName }
  return { matched: null, territoryName }
}

export function useServiceAreaCheck() {
  const [status, setStatus] = useState<ServiceAreaStatus>("idle")
  const [territoryName, setTerritoryName] = useState("")

  const checkServiceArea = useCallback(
    async (address: string, latitude: string, longitude: string, zipcode = "") => {
      setStatus("checking")
      try {
        const res = await fetch(SERVICE_AREA_CHECK_WEBHOOK, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address, latitude, longitude, zipcode }),
        })
        if (!res.ok) {
          console.error("[serviceAreaCheck] HTTP error:", res.status)
          setStatus("unknown")
          return
        }
        const data = await res.json()
        const { matched, territoryName: name } = parseResponse(data)
        setTerritoryName(name)
        if (matched === true) setStatus("serviced")
        else if (matched === false) setStatus("not_serviced")
        else setStatus("unknown")
      } catch (err) {
        console.error("[serviceAreaCheck] fetch error:", err)
        setStatus("unknown")
      }
    },
    []
  )

  return { status, territoryName, checkServiceArea }
}
