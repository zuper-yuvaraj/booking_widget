"use client"

import type { StepProps } from "@/types/booking"

const FlatRoofIcon = ({ className = "" }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className}>
    <polygon points="14,24 32,14 50,24 32,34" stroke="currentColor" strokeWidth="2" />
    <polygon points="14,24 14,40 32,50 32,34" stroke="currentColor" strokeWidth="2" />
    <polygon points="32,34 32,50 50,40 50,24" stroke="currentColor" strokeWidth="2" />

    <line x1="20" y1="21" x2="38" y2="31" stroke="currentColor" strokeWidth="1.5" />
    <line x1="26" y1="18" x2="44" y2="28" stroke="currentColor" strokeWidth="1.5" />
    <line x1="20" y1="28" x2="20" y2="42" stroke="currentColor" strokeWidth="1.5" />
    <line x1="26" y1="31" x2="26" y2="45" stroke="currentColor" strokeWidth="1.5" />
    <line x1="32" y1="34" x2="32" y2="48" stroke="currentColor" strokeWidth="1.5" />
  </svg>
)

const LowRoofIcon = ({ className = "" }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className}>
    <polygon points="16,30 34,18 48,26 30,38" stroke="currentColor" strokeWidth="2" />
    <polygon points="16,30 16,42 30,52 30,38" stroke="currentColor" strokeWidth="2" />
    <polygon points="30,38 30,52 48,40 48,26" stroke="currentColor" strokeWidth="2" />

    <line x1="22" y1="27" x2="38" y2="35" stroke="currentColor" strokeWidth="1.5" />
    <line x1="26" y1="23" x2="42" y2="31" stroke="currentColor" strokeWidth="1.5" />
  </svg>
)

const ModerateRoofIcon = ({ className = "" }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className}>
    <polygon points="18,34 34,14 48,28 32,46" stroke="currentColor" strokeWidth="2" />
    <polygon points="18,34 18,44 32,56 32,46" stroke="currentColor" strokeWidth="2" />
    <polygon points="32,46 32,56 48,42 48,28" stroke="currentColor" strokeWidth="2" />

    <line x1="24" y1="30" x2="38" y2="42" stroke="currentColor" strokeWidth="1.5" />
    <line x1="28" y1="24" x2="42" y2="36" stroke="currentColor" strokeWidth="1.5" />
  </svg>
)

const SteepRoofIcon = ({ className = "" }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className}>
    <polygon points="24,46 34,12 46,26 36,58" stroke="currentColor" strokeWidth="2" />
    <polygon points="24,46 24,54 36,62 36,58" stroke="currentColor" strokeWidth="2" />
    <polygon points="36,58 36,62 46,34 46,26" stroke="currentColor" strokeWidth="2" />

    <line x1="29" y1="40" x2="39" y2="50" stroke="currentColor" strokeWidth="1.5" />
    <line x1="31" y1="32" x2="41" y2="42" stroke="currentColor" strokeWidth="1.5" />
    <line x1="33" y1="24" x2="43" y2="34" stroke="currentColor" strokeWidth="1.5" />
  </svg>
)

export default function StepTwo({ formData, onUpdateFormData }: StepProps) {
  const pitchOptions = [
    {
      id: "flat",
      title: "Flat",
      description: "No peak",
      icon: FlatRoofIcon,
    },
    {
      id: "low",
      title: "Low",
      description: "Easily walked on",
      icon: LowRoofIcon,
    },
    {
      id: "moderate",
      title: "Moderate",
      description: "Not easily walked on",
      icon: ModerateRoofIcon,
    },
    {
      id: "steep",
      title: "Steep",
      description: "Can't be walked on",
      icon: SteepRoofIcon,
    },
  ]

  const handlePitchSelect = (pitch: string) => {
    onUpdateFormData("roofPitch", pitch)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="mb-8">
        <p className="text-sm text-gray-500 mb-2">Step 2 of 4</p>

        <h2 className="text-3xl font-bold text-gray-900">
          How steep is your roof?
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {pitchOptions.map((service) => {
          const Icon = service.icon
          const isSelected = formData.roofPitch === service.id

          return (
            <div
              key={service.id}
              onClick={() => handlePitchSelect(service.id)}
              className={`cursor-pointer rounded-2xl border p-6 transition-all duration-200 ${
                isSelected
                  ? "border-green-600 bg-green-50 shadow-sm"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="flex flex-col items-start">
                <div
                  className={`mb-5 flex h-16 w-16 items-center justify-center rounded-xl ${
                    isSelected ? "bg-green-100" : "bg-gray-50"
                  }`}
                >
                  <Icon
                    className={`h-12 w-12 ${
                      isSelected ? "text-green-600" : "text-gray-500"
                    }`}
                  />
                </div>

                <h3
                  className={`text-xl font-semibold mb-2 ${
                    isSelected ? "text-green-900" : "text-gray-900"
                  }`}
                >
                  {service.title}
                </h3>

                <p
                  className={`text-sm ${
                    isSelected ? "text-green-800" : "text-gray-500"
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