"use client"

import { Wrench, HomeIcon, ShieldAlert, Search } from "lucide-react"
import { useState } from "react"
import type { StepProps } from "@/types/booking"

export default function StepThree({ formData, onUpdateFormData }: StepProps) {
  const serviceTypes = [
    { uiId: "roof_replacement", title: "Roof Replacement", description: "Complete roof replacement service", icon: HomeIcon },
    { uiId: "roof_repair", title: "Roof Repair", description: "Professional roof repair service", icon: Wrench },
    { uiId: "gutters", title: "Gutters", description: "Gutter installation and maintenance", icon: ShieldAlert },
    { uiId: "siding", title: "Siding", description: "Siding installation and repair", icon: HomeIcon },
    { uiId: "soffit_fascia", title: "Soffit/Fascia", description: "Soffit and fascia services", icon: ShieldAlert },
    { uiId: "windows_doors", title: "Windows/Doors", description: "Window and door installation", icon: HomeIcon },
    { uiId: "general_construction", title: "General Construction/Remodeling", description: "Construction and remodeling services", icon: Search },
    { uiId: "decks", title: "Decks", description: "Deck building and repair", icon: ShieldAlert },
    { uiId: "siding_repair", title: "Siding Repair", description: "Repair damaged siding", icon: HomeIcon },
  ]

  const [selectedUiIds, setSelectedUiIds] = useState<string[]>([])

  const handleServiceToggle = (uiId: string) => {
    let newSelectedUiIds: string[] = []
    if (selectedUiIds.includes(uiId)) {
      // Remove from selection
      newSelectedUiIds = selectedUiIds.filter((id) => id !== uiId)
    } else {
      // Add to selection
      newSelectedUiIds = [...selectedUiIds, uiId]
    }
    setSelectedUiIds(newSelectedUiIds)

    // Determine API ID logic
    let apiId = "inspection"
    if (newSelectedUiIds.length === 1 && newSelectedUiIds[0] === "roof_repair") {
      apiId = "repair"
    }

    // Update formData
    onUpdateFormData("serviceType", apiId) // For API
    onUpdateFormData("selectedServices", newSelectedUiIds) // Exact tiles selected
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <div className="mx-auto w-12 h-12 mb-4 bg-green-100 rounded-full flex items-center justify-center">
          <Wrench className="w-6 h-6 text-green-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Choose type of service</h2>
        <p className="text-gray-600 mt-2">Select one or more services</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {serviceTypes.map((service) => {
          const Icon = service.icon
          const isSelected = selectedUiIds.includes(service.uiId)

          return (
            <div
              key={service.uiId}
              onClick={() => handleServiceToggle(service.uiId)}
              className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all duration-200 hover:shadow-md ${
                isSelected ? "border-green-500 bg-green-50 shadow-md" : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              {isSelected && (
                <div className="absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center bg-green-500">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}

              <div className="flex flex-col items-center text-center">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 ${isSelected ? "bg-green-100" : "bg-gray-100"}`}>
                  <Icon className={`w-7 h-7 ${isSelected ? "text-green-600" : "text-gray-600"}`} />
                </div>

                <h3 className={`text-md font-semibold mb-1 ${isSelected ? "text-green-900" : "text-gray-900"}`}>
                  {service.title}
                </h3>

                <p className={`text-sm ${isSelected ? "text-green-700" : "text-gray-600"}`}>
                  {service.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}