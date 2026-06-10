"use client"

import { useState } from "react"
import { Calendar, CheckCircle, AlertTriangle } from "lucide-react"
import type { StepProps, TimeSlot } from "@/types/booking"
import { useSlotAvailability } from "@/hooks/use-slot-availability"
import { SHOW_USER_SELECTION } from "@/configs"
import type { UserProfile } from "@/types/booking"

/* ---------- helpers ---------- */

function generateNext14Days(): Date[] {
  const days: Date[] = []
  const start = new Date()
  start.setDate(start.getDate() + 1)
  start.setHours(0, 0, 0, 0)
  for (let i = 0; i < 14; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    days.push(d)
  }
  return days
}

function toDateString(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

function formatTime(raw: string): string {
  // "2026-04-24 14:00:00" → "2:00 PM"
  const parts = raw.split(" ")
  if (parts.length < 2) return raw
  const [h, m] = parts[1].split(":").map(Number)
  const ampm = h >= 12 ? "PM" : "AM"
  const hour = h % 12 || 12
  return `${hour}:${String(m).padStart(2, "0")} ${ampm}`
}

function getInitials(first: string, last: string): string {
  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase()
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

/* ---------- component ---------- */

export default function StepFour({ formData, onUpdateFormData }: StepProps) {
  const dates = generateNext14Days()
  const [selectedDate, setSelectedDate] = useState(formData.selectedDate || "")
  const [selectedSlotKey, setSelectedSlotKey] = useState(formData.start_time || "")
  const [selectedUserId, setSelectedUserId] = useState(formData.selectedUser || "")

  const { status: slotsStatus, availability, users: allUsers, fetchSlots } = useSlotAvailability()
  const [slotProfiles, setSlotProfiles] = useState<UserProfile[]>([])

  // Find slots for the selected date from availability response
  const dayData = availability.find((a) => a.date === selectedDate)
  const slots: TimeSlot[] = dayData?.slots ?? []

  const handleDateClick = (date: Date) => {
    const ds = toDateString(date)
    setSelectedDate(ds)
    setSelectedSlotKey("")
    setSelectedUserId("")
    setSlotProfiles([])
    onUpdateFormData("selectedDate", ds)
    onUpdateFormData("selectedSlot", "")
    onUpdateFormData("start_time", "")
    onUpdateFormData("end_time", "")
    onUpdateFormData("selectedUser", "")
    fetchSlots(ds)
  }

  const handleSlotClick = (slot: TimeSlot) => {
    const display = `${formatTime(slot.start_time)} – ${formatTime(slot.end_time)}`
    setSelectedSlotKey(slot.start_time)
    setSelectedUserId("")
    onUpdateFormData("start_time", slot.start_time)
    onUpdateFormData("end_time", slot.end_time)
    onUpdateFormData("selectedSlot", display)
    onUpdateFormData("selectedUser", "")
    if (SHOW_USER_SELECTION && slot.users.length > 0) {
      setSlotProfiles(allUsers.filter((u) => slot.users.includes(u.user_uid)))
    } else {
      setSlotProfiles([])
    }
  }

  const handleUserClick = (uid: string) => {
    const next = selectedUserId === uid ? "" : uid
    setSelectedUserId(next)
    onUpdateFormData("selectedUser", next)
  }

  const selectedSlotObj = slots.find((s) => s.start_time === selectedSlotKey) ?? null

  /* ---------- UI ---------- */

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 pt-6">

      {/* STEP INDICATOR */}
      <div className="flex items-center justify-center gap-2 mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-2 h-2 rounded-full bg-orange/40" />
        ))}
        <div className="w-2 h-2 rounded-full bg-orange" />
        <span className="text-xs text-slate-500 ml-1">Step 4 of 4</span>
      </div>

      {/* HEADER */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-navy rounded-full mb-4">
          <Calendar className="w-7 h-7 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-navy">Choose Your Inspection Time</h2>
        <p className="text-slate-500 text-sm mt-2">
          Pick a date and we&apos;ll show available slots
        </p>
      </div>

      {/* DATE STRIP */}
      <div className="mb-6">
        <p className="text-xs font-semibold text-navy uppercase tracking-wide mb-3">Select a Date</p>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {dates.map((date) => {
            const ds = toDateString(date)
            const isSelected = ds === selectedDate
            return (
              <button
                key={ds}
                type="button"
                onClick={() => handleDateClick(date)}
                className={`flex-shrink-0 w-14 flex flex-col items-center py-2.5 rounded-xl border-2 transition-all focus:outline-none ${
                  isSelected
                    ? "border-orange bg-orange text-white shadow-md"
                    : "border-slate-200 bg-white text-navy hover:border-orange/40"
                }`}
              >
                <span className="text-xs font-medium opacity-80">{DAYS[date.getDay()]}</span>
                <span className="text-lg font-bold leading-tight">{date.getDate()}</span>
                <span className="text-xs opacity-70">{MONTHS[date.getMonth()]}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* SLOT GRID */}
      {selectedDate && (
        <div className="mb-6">
          <p className="text-xs font-semibold text-navy uppercase tracking-wide mb-3">
            Available Time Slots
          </p>

          {slotsStatus === "loading" && (
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 rounded-xl bg-slate-100 animate-pulse" />
              ))}
            </div>
          )}

          {slotsStatus === "error" && (
            <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              Failed to load slots. Please try again.
            </div>
          )}

          {slotsStatus === "loaded" && slots.length === 0 && (
            <div className="flex items-center gap-2 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-600" />
              No slots available for this day. Please pick another date.
            </div>
          )}

          {slotsStatus === "loaded" && slots.length > 0 && (
            <div className="grid grid-cols-2 gap-3">
              {slots.map((slot) => {
                const isSelected = slot.start_time === selectedSlotKey
                const label = `${formatTime(slot.start_time)} – ${formatTime(slot.end_time)}`
                return (
                  <button
                    key={slot.start_time}
                    type="button"
                    onClick={() => handleSlotClick(slot)}
                    className={`relative px-3 py-3 rounded-xl border-2 text-sm font-medium transition-all focus:outline-none ${
                      isSelected
                        ? "border-orange bg-orange text-white shadow-md"
                        : "border-slate-200 bg-white text-navy hover:border-orange/40"
                    }`}
                  >
                    {isSelected && (
                      <CheckCircle className="absolute top-1.5 right-1.5 w-3.5 h-3.5 text-white/80" />
                    )}
                    {label}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* INSPECTOR CARDS */}
      {SHOW_USER_SELECTION && selectedSlotObj && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <p className="text-xs font-semibold text-navy uppercase tracking-wide">
              Choose Your Inspector
            </p>
            <span className="text-xs text-slate-400 font-normal">(optional)</span>
          </div>

          {slotProfiles.length > 0 && (
            <div className="flex flex-col gap-3">
              {slotProfiles.map((profile) => {
                const isSelected = selectedUserId === profile.user_uid
                const fullName = `${profile.first_name} ${profile.last_name}`.trim()
                return (
                  <button
                    key={profile.user_uid}
                    type="button"
                    onClick={() => handleUserClick(profile.user_uid)}
                    className={`relative text-left rounded-2xl border-2 p-4 transition-all focus:outline-none ${
                      isSelected
                        ? "border-orange bg-orange/5 shadow-sm"
                        : "border-slate-200 bg-white hover:border-orange/40"
                    }`}
                  >
                    {isSelected && (
                      <CheckCircle className="absolute top-4 right-4 w-4 h-4 text-orange" />
                    )}

                    <div className="flex items-start gap-4">
                      {profile.profile_picture ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={profile.profile_picture}
                          alt={fullName}
                          className="w-14 h-14 rounded-full object-cover flex-shrink-0 border border-slate-200"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-navy flex items-center justify-center flex-shrink-0 text-white font-bold">
                          {getInitials(profile.first_name, profile.last_name)}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-navy">{fullName}</p>
                        {profile.designation && (
                          <p className="text-xs text-orange font-medium mb-2">{profile.designation}</p>
                        )}
                        {profile.bio && (
                          <p className="text-xs text-slate-600 leading-relaxed">{profile.bio}</p>
                        )}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          )}

          {slotProfiles.length === 0 && (
            <p className="text-sm text-slate-500 text-center py-2">
              Inspector info unavailable for this slot.
            </p>
          )}
        </div>
      )}

      <div className="pb-4" />
    </div>
  )
}
