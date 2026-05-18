"use client"

import type { StepProps } from "@/types/booking"

const AsphaltIcon = ({ className = "" }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className}>
    <rect
      x="10"
      y="18"
      width="44"
      height="28"
      rx="3"
      stroke="currentColor"
      strokeWidth="2"
    />

    <path
      d="M10 26H54"
      stroke="currentColor"
      strokeWidth="2"
    />

    <path
      d="M18 18V46"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeDasharray="2 2"
    />

    <path
      d="M34 18V46"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeDasharray="2 2"
    />
  </svg>
)

const MetalIcon = ({ className = "" }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className}>
    <path
      d="M14 14V50"
      stroke="currentColor"
      strokeWidth="3"
    />
    <path
      d="M26 14V50"
      stroke="currentColor"
      strokeWidth="3"
    />
    <path
      d="M38 14V50"
      stroke="currentColor"
      strokeWidth="3"
    />
    <path
      d="M50 14V50"
      stroke="currentColor"
      strokeWidth="3"
    />

    <circle cx="20" cy="24" r="2" fill="currentColor" />
    <circle cx="32" cy="34" r="2" fill="currentColor" />
    <circle cx="44" cy="24" r="2" fill="currentColor" />
  </svg>
)

const TileIcon = ({ className = "" }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className}>
    <path
      d="M10 24C14 18 18 18 22 24C26 30 30 30 34 24C38 18 42 18 46 24C50 30 54 30 58 24"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    />

    <path
      d="M10 34C14 28 18 28 22 34C26 40 30 40 34 34C38 28 42 28 46 34C50 40 54 40 58 34"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    />

    <path
      d="M10 44C14 38 18 38 22 44C26 50 30 50 34 44C38 38 42 38 46 44C50 50 54 50 58 44"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
)

export default function StepThree({
  formData,
  onUpdateFormData,
}: StepProps) {
  const roofTypes = [
    {
      id: "asphalt",
      title: "Asphalt",
      icon: AsphaltIcon,
    },
    {
      id: "metal",
      title: "Metal",
      icon: MetalIcon,
    },
    {
      id: "tile",
      title: "Tile",
      icon: TileIcon,
    },
  ]

  const handleSelect = (roofType: string) => {
    onUpdateFormData("roofType", roofType)
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <p className="text-sm text-gray-500 mb-2">
          Step 4 of 5
        </p>

        <h2 className="text-3xl font-bold text-gray-900">
          What type of roof would you like?
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {roofTypes.map((roof) => {
          const Icon = roof.icon
          const isSelected = formData.roofType === roof.id

          return (
            <div
              key={roof.id}
              onClick={() => handleSelect(roof.id)}
              className={`group relative overflow-hidden rounded-2xl border cursor-pointer transition-all duration-200 ${
                isSelected
                  ? "border-green-600 bg-green-50 shadow-md"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="p-8 flex flex-col items-center justify-center min-h-[220px]">
                <div
                  className={`w-24 h-24 rounded-2xl flex items-center justify-center mb-6 transition-all ${
                    isSelected
                      ? "bg-green-100"
                      : "bg-gray-100 group-hover:bg-gray-200"
                  }`}
                >
                  <Icon
                    className={`w-16 h-16 ${
                      isSelected
                        ? "text-green-600"
                        : "text-gray-600"
                    }`}
                  />
                </div>

                <h3
                  className={`text-xl font-semibold ${
                    isSelected
                      ? "text-green-900"
                      : "text-gray-900"
                  }`}
                >
                  {roof.title}
                </h3>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}