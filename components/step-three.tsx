"use client"

import { Wrench, Search, HomeIcon, ShieldAlert } from "lucide-react"
import type { StepProps } from "@/types/booking"

export default function StepThree({ formData, onUpdateFormData }: StepProps) {
  const serviceTypes = [
    {
      id: "inspection",
      title: "Roof Inspection",
      description: "Thorough assessment of your roof's condition",
      icon: HomeIcon,
      color: "green",
    },
    {
      id: "repair",
      title: "Repair Service",
      description: "Professional Roof repair service",
      icon: Wrench,
      color: "green",
    },
    // {
    //   id: "install_replace",
    //   title: "Install/Replace",
    //   description: "Expert installation or replacement of your roof",
    //   icon: ShieldAlert,
    //   color: "green"
    // },
  ]

  const handleServiceSelect = (serviceType: string) => {
    onUpdateFormData("serviceType", serviceType)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <div className="mx-auto w-12 h-12 mb-4 bg-green-100 rounded-full flex items-center justify-center">
          <Wrench className="w-6 h-6 text-green-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Choose type of service</h2>
        <p className="text-gray-600 mt-2">Select the service you need</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {serviceTypes.map((service) => {
          const Icon = service.icon
          const isSelected = formData.serviceType === service.id

          return (
            <div
              key={service.id}
              onClick={() => handleServiceSelect(service.id)}
              className={`relative cursor-pointer rounded-lg border-2 p-6 transition-all duration-200 hover:shadow-md ${
                isSelected
                  ? service.color === "blue"
                    ? "border-blue-500 bg-blue-50 shadow-md"
                    : "border-green-500 bg-green-50 shadow-md"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              {isSelected && (
                <div
                  className={`absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center ${
                    service.color === "blue" ? "bg-blue-500" : "bg-green-500"
                  }`}
                >
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
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                    isSelected ? (service.color === "blue" ? "bg-blue-100" : "bg-green-100") : "bg-gray-100"
                  }`}
                >
                  <Icon
                    className={`w-8 h-8 ${
                      isSelected ? (service.color === "blue" ? "text-blue-600" : "text-green-600") : "text-gray-600"
                    }`}
                  />
                </div>

                <h3
                  className={`text-lg font-semibold mb-2 ${
                    isSelected ? (service.color === "blue" ? "text-blue-900" : "text-green-900") : "text-gray-900"
                  }`}
                >
                  {service.title}
                </h3>

                <p
                  className={`text-sm ${
                    isSelected ? (service.color === "blue" ? "text-blue-700" : "text-green-700") : "text-gray-600"
                  }`}
                >
                  {service.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* {formData.serviceType && (
        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>Selected Service:</strong> {serviceTypes.find((s) => s.id === formData.serviceType)?.title}
          </p>
        </div>
      )} */}
    </div>
  )
}
