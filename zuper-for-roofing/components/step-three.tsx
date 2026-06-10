"use client"

import { Home, CloudRain, Layers, HardHat, CloudLightning, FileText, Search, Check } from "lucide-react"
import { useState } from "react"
import type { StepProps } from "@/types/booking"

const serviceTypes = [
  {
    uiId: "total_exterior_inspection",
    title: "Total Exterior Inspection",
    description: "Full assessment of all exterior components",
    icon: Search,
  },
  {
    uiId: "roof_inspection",
    title: "Roof Inspection",
    description: "Comprehensive roof condition evaluation",
    icon: Home,
  },
  {
    uiId: "gutter_inspection",
    title: "Gutter Inspection",
    description: "Gutter integrity & drainage assessment",
    icon: CloudRain,
  },
  {
    uiId: "siding_inspection",
    title: "Siding Inspection",
    description: "Siding condition & damage evaluation",
    icon: Layers,
  },
  {
    uiId: "storm_damage",
    title: "Storm Damage",
    description: "Post-storm damage inspection & documentation",
    icon: CloudLightning,
  },
  {
    uiId: "insurance_claim",
    title: "Insurance Claim",
    description: "Damage assessment to support your claim",
    icon: FileText,
  },
]

export default function StepThree({ formData, onUpdateFormData }: StepProps) {
  const [selectedUiIds, setSelectedUiIds] = useState<string[]>(formData.selectedServices || [])

  const handleServiceToggle = (uiId: string) => {
    const next = selectedUiIds.includes(uiId)
      ? selectedUiIds.filter((id) => id !== uiId)
      : [...selectedUiIds, uiId]
    setSelectedUiIds(next)
    onUpdateFormData("serviceType", next.length > 0 ? "inspection" : "")
    onUpdateFormData("selectedServices", next)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div
          className="mx-auto w-14 h-14 mb-4 rounded-full flex items-center justify-center"
          style={{ background: "var(--brand-forest-light)" }}
        >
          <HardHat className="w-6 h-6" style={{ color: "var(--brand-forest)" }} />
        </div>
        <h2 className="font-heading text-2xl font-semibold" style={{ color: "hsl(220,15%,14%)" }}>
          Select Your Service
        </h2>
        <p className="text-sm mt-2" style={{ color: "hsl(220,10%,52%)" }}>
          Select all that apply — we'll cover everything in one visit
        </p>
      </div>

      {/* Service grid */}
      <div className="grid grid-cols-2 gap-3">
        {serviceTypes.map((service) => {
          const Icon       = service.icon
          const isSelected = selectedUiIds.includes(service.uiId)

          return (
            <div
              key={service.uiId}
              onClick={() => handleServiceToggle(service.uiId)}
              className="relative card-selectable p-4 flex flex-col items-center text-center gap-3 select-none"
              style={isSelected ? {
                borderColor: "var(--brand-forest)",
                background: "var(--brand-forest-light)",
                boxShadow: "0 4px 16px rgba(46,96,78,0.12)",
              } : {}}
            >
              {/* Checkmark badge */}
              {isSelected && (
                <div
                  className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full flex items-center justify-center animate-scale-in"
                  style={{ background: "var(--brand-forest)" }}
                >
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}

              {/* Icon */}
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200"
                style={isSelected ? {
                  background: "var(--brand-forest)",
                } : {
                  background: "hsl(40,18%,92%)",
                }}
              >
                <Icon
                  className="w-5 h-5 transition-colors duration-200"
                  style={{ color: isSelected ? "white" : "hsl(220,10%,50%)" }}
                />
              </div>

              {/* Text */}
              <div>
                <h3
                  className="text-sm font-semibold leading-snug"
                  style={{ color: isSelected ? "var(--brand-forest)" : "hsl(220,15%,20%)" }}
                >
                  {service.title}
                </h3>
                <p
                  className="text-xs mt-0.5 leading-snug"
                  style={{ color: isSelected ? "var(--brand-forest-mid)" : "hsl(220,8%,58%)" }}
                >
                  {service.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Selection summary */}
      {selectedUiIds.length > 0 && (
        <div
          className="px-4 py-3 rounded-xl text-sm font-medium animate-scale-in flex items-center gap-2"
          style={{
            background: "var(--brand-forest-light)",
            border: "1.5px solid hsl(158,28%,80%)",
            color: "var(--brand-forest)",
          }}
        >
          <Check className="w-4 h-4 flex-shrink-0" />
          <span>
            {selectedUiIds.length === 1 ? "1 service selected" : `${selectedUiIds.length} services selected`}
            {" — "}our team will assess everything during your free inspection.
          </span>
        </div>
      )}
    </div>
  )
}
