"use client"

import type { StepProps } from "@/types/booking"

const RoofRepairIcon = ({ className = "" }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden>
    <path
      d="M12 38L32 18L52 38V50H12V38Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path d="M22 50V34L32 26L42 34V50" stroke="currentColor" strokeWidth="2" />
    <path
      d="M38 30L44 24M44 24L50 30M44 24V36"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const RoofReplacementIcon = ({ className = "" }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden>
    <path
      d="M10 40L32 16L54 40V52H10V40Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path d="M20 52V36L32 26L44 36V52" stroke="currentColor" strokeWidth="2" />
    <path
      d="M46 22L50 18M50 18L54 22M50 18V28"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M14 22L18 18M18 18L22 22M18 18V28"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
)

const WindowsDoorsIcon = ({ className = "" }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden>
    <rect x="14" y="14" width="20" height="36" rx="2" stroke="currentColor" strokeWidth="2" />
    <path d="M24 14V50" stroke="currentColor" strokeWidth="1.5" />
    <path d="M14 30H34" stroke="currentColor" strokeWidth="1.5" />
    <rect x="36" y="22" width="14" height="28" rx="2" stroke="currentColor" strokeWidth="2" />
    <circle cx="43" cy="36" r="1.5" fill="currentColor" />
    <path d="M36 36H50" stroke="currentColor" strokeWidth="1.5" />
  </svg>
)

const OtherServiceIcon = ({ className = "" }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden>
    <circle cx="32" cy="32" r="22" stroke="currentColor" strokeWidth="2" />
    <circle cx="22" cy="32" r="2.5" fill="currentColor" />
    <circle cx="32" cy="32" r="2.5" fill="currentColor" />
    <circle cx="42" cy="32" r="2.5" fill="currentColor" />
  </svg>
)

const SERVICE_OPTIONS = [
  { id: "roof_repair", title: "Roof Repair", icon: RoofRepairIcon },
  { id: "roof_replacement", title: "Roof Replacement", icon: RoofReplacementIcon },
  { id: "windows_doors", title: "Windows/Doors", icon: WindowsDoorsIcon },
  { id: "other", title: "Other", icon: OtherServiceIcon },
]

export default function StepService({ formData, onUpdateFormData }: StepProps) {
  const isOther = formData.estimateService === "other"

  const handleSelect = (serviceId: string) => {
    onUpdateFormData("estimateService", serviceId)
    if (serviceId !== "other") {
      onUpdateFormData("estimateServiceOther", "")
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="mb-8">
        <p className="text-sm text-gray-500 mb-2">Step 2 of 5</p>
        <h2 className="text-3xl font-bold text-gray-900">
          What type of service are you looking to get an estimate for?
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {SERVICE_OPTIONS.map((option) => {
          const Icon = option.icon
          const isSelected = formData.estimateService === option.id

          return (
            <div
              key={option.id}
              onClick={() => handleSelect(option.id)}
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
                    className={`h-12 w-12 ${isSelected ? "text-green-600" : "text-gray-500"}`}
                  />
                </div>
                <h3
                  className={`text-xl font-semibold ${
                    isSelected ? "text-green-900" : "text-gray-900"
                  }`}
                >
                  {option.title}
                </h3>
              </div>
            </div>
          )
        })}
      </div>

      {isOther && (
        <div className="mt-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Please specify <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.estimateServiceOther}
            onChange={(e) => onUpdateFormData("estimateServiceOther", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Describe the service you need"
            autoComplete="off"
          />
        </div>
      )}
    </div>
  )
}
