"use client"

import { ClipboardList, CheckCircle } from "lucide-react"
import type { StepProps } from "@/types/booking"

const SERVICES = [
  { id: "total_exterior_inspection", label: "Total Exterior Inspection", icon: "🏠" },
  { id: "roof_inspection",           label: "Roof Inspection",           icon: "🔍" },
  { id: "gutter_inspection",         label: "Gutter Inspection",         icon: "🌧️" },
  { id: "siding_inspection",         label: "Siding Inspection",         icon: "🪟" },
  { id: "storm_damage",              label: "Storm Damage",              icon: "⛈️" },
  { id: "insurance_claim",           label: "Insurance Claim",           icon: "📋" },
]

export default function StepThree({ formData, onUpdateFormData }: StepProps) {
  const selected: string[] = formData.services ?? []

  const toggle = (id: string) => {
    const next = selected.includes(id)
      ? selected.filter((s) => s !== id)
      : [...selected, id]
    onUpdateFormData("services", next)
  }

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 pt-6">

      {/* STEP INDICATOR */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <div className="w-2 h-2 rounded-full bg-orange/40" />
        <div className="w-2 h-2 rounded-full bg-orange/40" />
        <div className="w-2 h-2 rounded-full bg-orange" />
        <span className="text-xs text-slate-500 ml-1">Step 3 of 3</span>
      </div>

      {/* HEADER */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-navy rounded-full mb-4">
          <ClipboardList className="w-7 h-7 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-navy">What can we help with?</h2>
        <p className="text-slate-500 text-sm mt-2">
          Select all services you&apos;re interested in
        </p>
      </div>

      {/* SERVICE TILES */}
      <div className="grid grid-cols-2 gap-3">
        {SERVICES.map(({ id, label, icon }) => {
          const isSelected = selected.includes(id)
          return (
            <button
              key={id}
              type="button"
              onClick={() => toggle(id)}
              className={`relative flex flex-col items-center justify-center gap-2 p-5 rounded-2xl border-2 text-center transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-orange/30 ${
                isSelected
                  ? "border-orange bg-orange/5 shadow-sm"
                  : "border-slate-200 bg-white hover:border-orange/40 hover:bg-orange/5"
              }`}
            >
              {isSelected && (
                <CheckCircle className="absolute top-2.5 right-2.5 w-4 h-4 text-orange" />
              )}
              <span className="text-2xl leading-none">{icon}</span>
              <span className={`text-sm font-semibold leading-snug ${isSelected ? "text-navy" : "text-slate-700"}`}>
                {label}
              </span>
            </button>
          )
        })}
      </div>

      {selected.length > 0 && (
        <p className="mt-4 text-center text-xs text-slate-500">
          {selected.length} service{selected.length > 1 ? "s" : ""} selected
        </p>
      )}

      <div className="pb-4" />
    </div>
  )
}
