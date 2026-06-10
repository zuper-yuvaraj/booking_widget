"use client"

import { MapPin, Calendar, User, Phone, Mail, Clock } from "lucide-react"
import type { FormData } from "@/types/booking"

interface BookingConfirmationProps {
  formData: FormData
}

export default function BookingConfirmation({ formData }: BookingConfirmationProps) {

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Date not selected"
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return "Date not selected"
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "America/New_York",
    })
  }

  const formatSelectedDate = (ds?: string) => {
    if (!ds) return ""
    // ds is "2026-04-23" — parse without timezone shift
    const [y, m, d] = ds.split("-").map(Number)
    const date = new Date(y, m - 1, d)
    return date.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
  }

  const allDetails = [
    { icon: User,    label: "Name",               value: `${formData.firstName} ${formData.lastName}` },
    { icon: Phone,   label: "Phone",              value: formData.phone },
    { icon: Mail,    label: "Email",              value: formData.email },
    { icon: MapPin,  label: "Address",            value: formData.address },
    { icon: Calendar,label: "Inspection Date",   value: formatSelectedDate(formData.selectedDate) },
    { icon: Clock,   label: "Time Slot",         value: formData.selectedSlot },
    { icon: User,    label: "Inspector",          value: formData.selectedUser ? "Assigned" : "" },
  ]

  const details = allDetails.filter((d) => d.value)

  return (
    <div className="min-h-screen bg-slate-50">

      {/* HERO BANNER */}
      <div className="bg-gradient-to-br from-navy-dark via-navy to-navy-light px-6 py-16 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-xl mb-6">
          <svg
            className="w-10 h-10 text-orange"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-white mb-3">You&apos;re All Set!</h1>
        <p className="text-slate-300 text-lg max-w-md mx-auto">
          A member of our team will reach out within 24 hours to confirm your inspection.
        </p>
      </div>

      <div className="max-w-lg mx-auto px-4 sm:px-6 -mt-8">

        {/* SUMMARY CARD */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100">
            <h2 className="text-lg font-bold text-navy">Booking Summary</h2>
          </div>
          <div className="divide-y divide-slate-50">
            {details.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3 px-6 py-4">
                <div className="flex-shrink-0 w-8 h-8 bg-orange/10 rounded-lg flex items-center justify-center mt-0.5">
                  <Icon className="w-4 h-4 text-orange" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{label}</p>
                  <p className="text-sm font-semibold text-navy mt-0.5 break-words">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TRUST + CONTACT */}
        <div className="mt-6 text-center space-y-4">
          <div className="flex justify-center gap-8">
            {[
              { emoji: "🛡️", label: "Licensed" },
              { emoji: "⭐", label: "5-Star Rated" },
              { emoji: "📞", label: "Local Team" },
            ].map(({ emoji, label }) => (
              <div key={label} className="text-center">
                <div className="text-2xl mb-1">{emoji}</div>
                <div className="text-xs text-slate-500 font-medium">{label}</div>
              </div>
            ))}
          </div>
          <p className="text-sm text-slate-600">
            Questions?{" "}
            <a href="tel:+12065550000" className="text-orange font-semibold hover:text-orange-dark underline">
              Call us at (206) 555-0000
            </a>
          </p>
        </div>

        <div className="pb-10" />
      </div>
    </div>
  )
}
