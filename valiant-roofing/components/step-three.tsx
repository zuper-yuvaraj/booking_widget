"use client"

import { Wrench, HomeIcon, ShieldAlert, Search } from "lucide-react"
import { useState } from "react"
import type { StepProps } from "@/types/booking"

export default function StepThree({ formData, onUpdateFormData }: StepProps) {

  // ✅ Service tiles (display names = stored values)
  const serviceTypes = [
    { title: "Roof Replacement", description: "Complete roof replacement service", icon: HomeIcon },
    { title: "Roof Repair", description: "Professional roof repair service", icon: Wrench },
    { title: "Siding Replacement", description: "Siding installation service", icon: HomeIcon },
    { title: "Siding Repairs", description: "Repair damaged siding", icon: ShieldAlert },
    { title: "New Construction", description: "Construction services", icon: Search },
    { title: "Gutters", description: "Gutter installation and maintenance", icon: ShieldAlert },
    { title: "Windows", description: "Window installation services", icon: HomeIcon },
    { title: "Painting", description: "Interior & exterior painting", icon: Wrench },
    { title: "Decks", description: "Deck building and repair", icon: ShieldAlert },
    { title: "Tarp", description: "Emergency tarp installation", icon: ShieldAlert },
  ]

  // ✅ Persist selections if user comes back to this step
  const [selectedServices, setSelectedServices] = useState<string[]>(
    formData.selectedServices || []
  )

  // ✅ Toggle selection
  const handleServiceToggle = (title: string) => {
    let updatedSelections: string[]

    if (selectedServices.includes(title)) {
      updatedSelections = selectedServices.filter((s) => s !== title)
    } else {
      updatedSelections = [...selectedServices, title]
    }

    setSelectedServices(updatedSelections)

    // ✅ Backend always receives inspection
    onUpdateFormData("serviceType", "inspection")

    // ✅ Store readable values
    onUpdateFormData("selectedServices", updatedSelections)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="mx-auto w-12 h-12 mb-4 bg-green-100 rounded-full flex items-center justify-center">
          <Wrench className="w-6 h-6 text-green-600" />
        </div>

        <h2 className="text-xl font-semibold text-gray-900">
          Choose type of service
        </h2>

        <p className="text-gray-600 mt-2">
          Select one or more services
        </p>
      </div>

      {/* Tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {serviceTypes.map((service) => {
          const Icon = service.icon
          const isSelected = selectedServices.includes(service.title)

          return (
            <div
              key={service.title}
              onClick={() => handleServiceToggle(service.title)}
              className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all duration-200 hover:shadow-md ${
                isSelected
                  ? "border-green-500 bg-green-50 shadow-md"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              {/* Selected Check Icon */}
              {isSelected && (
                <div className="absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center bg-green-500">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}

              {/* Tile Content */}
              <div className="flex flex-col items-center text-center">
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 ${
                    isSelected ? "bg-green-100" : "bg-gray-100"
                  }`}
                >
                  <Icon
                    className={`w-7 h-7 ${
                      isSelected ? "text-green-600" : "text-gray-600"
                    }`}
                  />
                </div>

                <h3
                  className={`text-md font-semibold mb-1 ${
                    isSelected ? "text-green-900" : "text-gray-900"
                  }`}
                >
                  {service.title}
                </h3>

                <p
                  className={`text-sm ${
                    isSelected ? "text-green-700" : "text-gray-600"
                  }`}
                >
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