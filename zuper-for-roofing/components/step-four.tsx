"use client"

import { useState, useRef, useMemo } from "react"
import { Calendar, ChevronLeft, ChevronRight, Clock } from "lucide-react"
import type { StepProps, ApiResponse, TimeSlot } from "@/types/booking"
import { ASSISTED_SCHEDULING_WEBHOOK, USER_DETAILS_WEBHOOK, ZUPER_API_KEY } from "@/configs"
import { useQueryParams } from "@/hooks/query-params.hooks"

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export default function StepFour({ formData, onUpdateFormData }: StepProps) {
  const [selectedDate, setSelectedDate]         = useState(formData.selectedDate ? new Date(formData.selectedDate) : null)
  const [availabilityData, setAvailabilityData] = useState<ApiResponse | null>(null)
  const [loading, setLoading]                   = useState(false)
  const [error, setError]                       = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const searchParams = useQueryParams()
  const COMPANY_UID = searchParams.get("company_uid") || ""

  const allDates = useMemo(() => {
    const today = new Date(); today.setHours(0, 0, 0, 0)
    const dates: Date[] = []
    for (let i = 0; i < 30; i++) {
      const d = new Date(today); d.setDate(today.getDate() + i)
      if (d.getDay() !== 0) dates.push(d)
    }
    return dates
  }, [])

  const scrollPrev = () => scrollRef.current?.scrollBy({ left: -320, behavior: "smooth" })
  const scrollNext = () => scrollRef.current?.scrollBy({ left: 320,  behavior: "smooth" })

  const fetchAvailability = async (date: string) => {
    setLoading(true); setError(null)
    try {
      const teamParam = formData.teamUids?.length
        ? `&team_uid=${formData.teamUids.join(",")}`
        : ""

      const res = await fetch(
        `${ASSISTED_SCHEDULING_WEBHOOK}?date=${date}&serviceType=${formData.serviceType}&company_uid=${COMPANY_UID}${teamParam}`
      )
      if (!res.ok) throw new Error("Failed to fetch availability")
      const data: ApiResponse = await res.json()
      if (!data.success) throw new Error(data.message)
      setAvailabilityData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    const ds = date.toISOString().split("T")[0]
    onUpdateFormData("selectedDate", ds)
    onUpdateFormData("selectedUser", "")
    onUpdateFormData("selectedSlot",  "")
    fetchAvailability(ds)
  }

  const handleSlotSelect = async (slot: TimeSlot) => {
    const parseUTC = (d: string) => new Date(d.replace(" ", "T") + "Z")
    const fmt = (d: string) =>
      parseUTC(d).toLocaleTimeString("en-US", {
        hour: "numeric", minute: "2-digit", hour12: true, timeZone: "America/New_York",
      })
    const display = `${fmt(slot.start_time)} - ${fmt(slot.end_time)}`

    onUpdateFormData("selectedSlot", display)
    onUpdateFormData("start_time",   slot.start_time)
    onUpdateFormData("end_time",     slot.end_time)

    // Fetch all user details in parallel to find the closest one
    const results = await Promise.allSettled(
      slot.users.map((uid) =>
        fetch(`${USER_DETAILS_WEBHOOK}/${uid}`, { headers: { "x-api-key": ZUPER_API_KEY } })
          .then((r) => r.json())
          .then((body): { uid: string; coords: [number, number] | null } => {
            const coords = body?.data?.meta_data?.base_location_geo?.coordinates
            // GeoJSON order: [longitude, latitude]
            return { uid, coords: Array.isArray(coords) && coords.length === 2 ? coords : null }
          })
          .catch(() => ({ uid, coords: null }))
      )
    )

    const customerLat = parseFloat(formData.latitude)
    const customerLng = parseFloat(formData.longitude)

    let pickedUid = ""
    let minDist   = Infinity

    for (const r of results) {
      if (r.status !== "fulfilled") continue
      const { uid, coords } = r.value
      if (!coords) continue
      const [lng, lat] = coords
      const dist = haversineKm(customerLat, customerLng, lat, lng)
      if (dist < minDist) { minDist = dist; pickedUid = uid }
    }

    // Fallback to random if no user had usable geo data
    if (!pickedUid) {
      pickedUid = slot.users[Math.floor(Math.random() * slot.users.length)] ?? ""
    }

    onUpdateFormData("selectedUser", pickedUid)
  }

  const getSlotsForDate = (): TimeSlot[] => {
    if (!availabilityData?.data) return []
    const dateData = availabilityData.data.availability.find(
      (i) => i.date === formData.selectedDate
    )
    return dateData?.slots ?? []
  }

  const slots  = getSlotsForDate()
  const today  = new Date(); today.setHours(0, 0, 0, 0)

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", {
      weekday: "long", month: "long", day: "numeric", timeZone: "America/New_York",
    })

  const parseUTC = (d: string) => new Date(d.replace(" ", "T") + "Z")
  const fmtTime  = (d: string) =>
    parseUTC(d).toLocaleTimeString("en-US", {
      hour: "numeric", minute: "2-digit", hour12: true, timeZone: "America/New_York",
    })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-2">
        <div
          className="mx-auto w-14 h-14 mb-4 rounded-full flex items-center justify-center"
          style={{ background: "var(--brand-forest-light)" }}
        >
          <Calendar className="w-6 h-6" style={{ color: "var(--brand-forest)" }} />
        </div>
        <h2 className="font-heading text-2xl font-semibold" style={{ color: "hsl(220,15%,14%)" }}>
          Pick a Date &amp; Time
        </h2>
        <p className="text-sm mt-2" style={{ color: "hsl(220,10%,52%)" }}>
          Let's find a time that works for you
        </p>
      </div>

      {/* ── Date Strip ───────────────────────────────── */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-semibold" style={{ color: "hsl(220,12%,28%)" }}>
          <Calendar className="w-4 h-4" style={{ color: "var(--brand-forest)" }} />
          Select a Date
        </label>

        <div className="flex items-center gap-2">
          <button
            onClick={scrollPrev}
            className="hidden sm:flex w-9 h-9 flex-shrink-0 items-center justify-center rounded-full border transition-all"
            style={{ borderColor: "hsl(40,18%,86%)", background: "white", color: "hsl(220,10%,50%)" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--brand-forest)"; e.currentTarget.style.color = "var(--brand-forest)" }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "hsl(40,18%,86%)"; e.currentTarget.style.color = "hsl(220,10%,50%)" }}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-2 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-1 flex-1 scrollbar-hide"
          >
            {allDates.map((date) => {
              const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString()
              const isToday    = date.toDateString() === today.toDateString()

              return (
                <button
                  key={date.toISOString()}
                  onClick={() => handleDateSelect(date)}
                  ref={(el) => isSelected && el?.scrollIntoView({ inline: "center", behavior: "smooth" })}
                  className="min-w-[72px] flex-shrink-0 p-2.5 rounded-xl snap-start transition-all duration-200 flex flex-col items-center gap-0.5"
                  style={isSelected ? {
                    background: "var(--brand-forest)",
                    border: "1.5px solid var(--brand-forest)",
                    boxShadow: "0 4px 12px rgba(46,96,78,0.22)",
                    color: "white",
                  } : {
                    background: "white",
                    border: `1.5px solid ${isToday ? "hsl(158,28%,74%)" : "hsl(40,18%,88%)"}`,
                    color: "hsl(220,12%,25%)",
                  }}
                  onMouseEnter={(e) => !isSelected && (e.currentTarget.style.borderColor = "var(--brand-forest-mid)")}
                  onMouseLeave={(e) => !isSelected && (e.currentTarget.style.borderColor = isToday ? "hsl(158,28%,74%)" : "hsl(40,18%,88%)")}
                >
                  <span className="text-[10px] font-medium uppercase tracking-wide" style={{ opacity: isSelected ? 0.75 : 0.6 }}>
                    {date.toLocaleDateString("en-US", { weekday: "short" })}
                  </span>
                  <span className="text-xl font-bold leading-none">{date.getDate()}</span>
                  <span className="text-[10px]" style={{ opacity: isSelected ? 0.7 : 0.55 }}>
                    {date.toLocaleDateString("en-US", { month: "short" })}
                  </span>
                  {isToday && !isSelected && (
                    <span
                      className="w-1 h-1 rounded-full mt-0.5"
                      style={{ background: "var(--brand-forest)" }}
                    />
                  )}
                </button>
              )
            })}
          </div>

          <button
            onClick={scrollNext}
            className="hidden sm:flex w-9 h-9 flex-shrink-0 items-center justify-center rounded-full border transition-all"
            style={{ borderColor: "hsl(40,18%,86%)", background: "white", color: "hsl(220,10%,50%)" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--brand-forest)"; e.currentTarget.style.color = "var(--brand-forest)" }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "hsl(40,18%,86%)"; e.currentTarget.style.color = "hsl(220,10%,50%)" }}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Time Slots ────────────────────────────────── */}
      {selectedDate && (
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 text-sm font-semibold" style={{ color: "hsl(220,12%,28%)" }}>
            <Clock className="w-4 h-4" style={{ color: "var(--brand-forest)" }} />
            Available Times — {formatDate(selectedDate)}
          </h3>

          {/* Skeleton */}
          {loading && (
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="skeleton h-10 w-36 rounded-full" />
              ))}
            </div>
          )}

          {/* Error */}
          {error && (
            <div
              className="px-4 py-3 rounded-xl text-sm font-medium"
              style={{ background: "hsl(0,60%,97%)", border: "1.5px solid hsl(0,55%,85%)", color: "hsl(0,60%,45%)" }}
            >
              {error}
            </div>
          )}

          {/* Empty */}
          {!loading && !error && slots.length === 0 && availabilityData && (
            <div className="text-center py-10 rounded-xl" style={{ background: "white", border: "1.5px solid hsl(40,18%,90%)" }}>
              <Calendar className="w-10 h-10 mx-auto mb-3" style={{ color: "hsl(220,8%,78%)" }} />
              <p className="font-semibold text-sm" style={{ color: "hsl(220,12%,28%)" }}>No availability for this date</p>
              <p className="text-xs mt-1" style={{ color: "hsl(220,8%,58%)" }}>Please select another day to continue.</p>
            </div>
          )}

          {/* Slot pills */}
          {!loading && slots.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {slots.map((slot, i) => {
                const display    = `${fmtTime(slot.start_time)} - ${fmtTime(slot.end_time)}`
                const isSelected = formData.selectedSlot === display

                return (
                  <button
                    key={i}
                    onClick={() => handleSlotSelect(slot)}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-200"
                    style={isSelected ? {
                      background: "var(--brand-terra)",
                      color: "white",
                      boxShadow: "0 3px 10px rgba(217,103,58,0.28)",
                      transform: "scale(1.03)",
                    } : {
                      background: "white",
                      border: "1.5px solid hsl(40,18%,86%)",
                      color: "hsl(220,10%,38%)",
                    }}
                    onMouseEnter={(e) => !isSelected && Object.assign(e.currentTarget.style, { borderColor: "var(--brand-terra)", color: "var(--brand-terra)", background: "hsl(18,65%,96%)" })}
                    onMouseLeave={(e) => !isSelected && Object.assign(e.currentTarget.style, { borderColor: "hsl(40,18%,86%)", color: "hsl(220,10%,38%)", background: "white" })}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    {display}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Booking summary ────────────────────────────── */}
      {formData.selectedSlot && (
        <div
          className="rounded-xl p-5 space-y-3 animate-scale-in"
          style={{
            background: "var(--brand-forest-light)",
            border: "1.5px solid hsl(158, 28%, 78%)",
          }}
        >
          <p className="font-heading text-base font-semibold" style={{ color: "var(--brand-forest)" }}>
            Booking Summary
          </p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            {[
              ["Name",    `${formData.firstName} ${formData.lastName}`],
              ["Phone",   formData.phone],
              ["Email",   formData.email],
              ["Service", formData.serviceType],
              ["Date",    formatDate(selectedDate!)],
              ["Time",    formData.selectedSlot],
            ].map(([label, value]) => (
              <div key={label} className="contents">
                <span style={{ color: "var(--brand-forest-mid)" }}>{label}</span>
                <span
                  className="font-medium capitalize"
                  style={{ color: label === "Time" ? "var(--brand-terra)" : "var(--brand-forest)" }}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
