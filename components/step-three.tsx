"use client"

import { Wrench } from "lucide-react"
import type { StepProps } from "@/types/booking"
import { SERVICE_TYPES } from "@/configs"

export default function StepThree({ formData, onUpdateFormData }: StepProps) {
  const handleServiceSelect = (serviceType: string) => {
    onUpdateFormData("serviceType", serviceType)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <div className="mx-auto w-12 h-12 mb-4 bg-primary/10 rounded-full flex items-center justify-center">
          <Wrench className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Choose type of service</h2>
        <p className="text-gray-600 mt-2">Select the service you need</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {SERVICE_TYPES.map((service) => {
          const Icon = service.icon
          const isSelected = formData.serviceType === service.id

          return (
            <div
              key={service.id}
              onClick={() => handleServiceSelect(service.id)}
              className={`relative cursor-pointer rounded-lg border-2 p-5 transition-all duration-200 hover:shadow-md ${
                isSelected
                  ? "border-primary bg-primary/5 shadow-md"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center border-2 bg-white border-primary">
                  <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}

              <div className="flex flex-col items-center text-center">
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 ${
                    isSelected ? "bg-primary/10" : "bg-gray-100"
                  }`}
                >
                  <Icon
                    className={`w-7 h-7 ${isSelected ? "text-primary" : "text-gray-600"}`}
                  />
                </div>

                <h3
                  className={`text-base font-semibold mb-1 ${
                    isSelected ? "text-primary" : "text-gray-900"
                  }`}
                >
                  {service.title}
                </h3>

                <p
                  className={`text-xs ${
                    isSelected ? "text-primary" : "text-gray-600"
                  }`}
                >
                  {service.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-8">
        <label htmlFor="job-description" className="block text-base font-semibold text-gray-900 mb-2">
          Description
        </label>
        <textarea
          id="job-description"
          value={formData.jobDescription}
          onChange={(e) => onUpdateFormData("jobDescription", e.target.value)}
          placeholder=""
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-primary resize-none text-base"
        />
      </div>
    </div>
  )
}
