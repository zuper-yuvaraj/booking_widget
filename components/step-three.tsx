"use client"

import { useState } from "react"
import type { StepProps } from "@/types/booking"
import { COMPANY_NAME, PRIVACY_POLICY, TERMS_OF_SERVICE, SERVICE_TYPES } from "@/configs"

export default function StepThree({ formData, onUpdateFormData }: StepProps) {
  const [selectedUiIds, setSelectedUiIds] = useState<string[]>(
    Array.isArray(formData.serviceType) ? formData.serviceType : []
  )

  const [dateInputValue, setDateInputValue] = useState<string>(formData.selectedDate || "")

  // Get today's date in YYYY-MM-DD format
  const getToday = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  const today = getToday()

  const handleServiceToggle = (uiId: string) => {
    let newSelectedUiIds: string[] = []
    if (selectedUiIds.includes(uiId)) {
      newSelectedUiIds = selectedUiIds.filter((id) => id !== uiId)
    } else {
      newSelectedUiIds = [...selectedUiIds, uiId]
    }
    setSelectedUiIds(newSelectedUiIds)
    onUpdateFormData("serviceType", newSelectedUiIds)
    onUpdateFormData("selectedServices", newSelectedUiIds)
  }

  const handleDateChange = (value: string) => {
    setDateInputValue(value)
    onUpdateFormData("selectedDate", value)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation()
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="mx-auto w-08 h-12 mb-4 bg-green-100 rounded-full flex items-center justify-center">
         <h2 className="text-xl font-semibold text-gray-900">Select the service(s) you are interested in</h2>
        </div>
        
      </div>

      {/* Select Services */}
      <div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {SERVICE_TYPES.map((service) => {
            const Icon = service.icon
            const isSelected = selectedUiIds.includes(service.uiId)

            return (
              <div
                key={service.uiId}
                onClick={() => handleServiceToggle(service.uiId)}
                className={`relative cursor-pointer rounded-lg border-2 p-3 transition-all duration-200 hover:shadow-md ${
                  isSelected ? "border-green-500 bg-green-50 shadow-md" : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 w-4 h-5 rounded-full flex items-center justify-center bg-green-500">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 15 15">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}

                <div className="flex items-center justify-between gap-3">
                  <h3 className={`text-sm font-semibold ${isSelected ? "text-green-900" : "text-gray-900"}`}>
                    {service.title}
                  </h3>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isSelected ? "bg-green-100" : "bg-gray-100"}`}>
                    <Icon className={`w-5 h-5 ${isSelected ? "text-green-600" : "text-gray-600"}`} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Date <span className="text-red-500">*</span>
          </label>

          <input
            type="date"
            min={today}
            value={dateInputValue}
            onChange={(e) => handleDateChange(e.target.value)}
            onKeyDown={handleKeyPress}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>

      {/* Job Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Please provide more details
        </label>
        <textarea
          value={formData.job_description || ""}
          onChange={(e) => onUpdateFormData("job_description", e.target.value)}
          rows={3}
          placeholder=""
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
          onKeyDown={(e) => {
            e.stopPropagation()
          }}
        />
      </div>

      {/* Marketing Consent */}
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="marketing-consent"
            checked={formData.marketingConsent || false}
            onChange={(e) => onUpdateFormData("marketingConsent", e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-gray-300 cursor-pointer accent-green-600"
            required
          />
          <label htmlFor="marketing-consent" className="text-sm text-gray-700 leading-relaxed cursor-pointer">
          By checking this box, you consent to receive SMS messages from {COMPANY_NAME} related to your inquiry and services, including appointment reminders, project updates, payment links, receipts, and care-related notifications. Message frequency may vary. Message and data rates may apply. Text HELP for assistance. Reply STOP to opt out. Consent is not a condition of purchase. See our{" "}
            <a 
              href={TERMS_OF_SERVICE} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-green-600 hover:text-green-700 underline"
            >
              Terms & Conditions
            </a>{" "}
            and{" "}
            <a 
              href={PRIVACY_POLICY}
              target="_blank" 
              rel="noopener noreferrer"
              className="text-green-600 hover:text-green-700 underline"
            >
              Privacy Policy
            </a>
            .
          </label>
        </div>
      </div>
    </div>
  )
}