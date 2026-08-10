"use client"

import { ChevronDown, User } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import PhoneInput from "react-phone-number-input/input"
import { isValidPhoneNumber } from "react-phone-number-input"
import { isValidEmail } from "@/lib/utils"
import type { StepProps } from "@/types/booking"
import { COMPANY_NAME, PRIVACY_POLICY, TERMS_OF_SERVICE } from "@/configs"

const SERVICE_OPTIONS = [
  "Commercial Roofing",
  "Residential Roofing",
  "Roof Inspections",
  "Roof Insurance",
]

export default function StepTwo({ formData, onUpdateFormData, onNext, isValid, showValidationErrors }: StepProps) {
  const firstNameInputRef = useRef<HTMLInputElement>(null)
  const servicesDropdownRef = useRef<HTMLDivElement>(null)
  const [isServicesOpen, setIsServicesOpen] = useState(false)

  // Auto-focus the first name input when component mounts
  useEffect(() => {
    if (firstNameInputRef.current) {
      firstNameInputRef.current.focus()
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (servicesDropdownRef.current && !servicesDropdownRef.current.contains(event.target as Node)) {
        setIsServicesOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isValid) {
      onNext()
    }
  }

  const handlePhoneChange = (value: string | undefined) => {
    onUpdateFormData("phone", value || "")
  }

  const isPhoneValid = formData.phone ? isValidPhoneNumber(formData.phone) : true
  const showPhoneError = formData.phone && !isPhoneValid

  // Email validation
  const isEmailValid = formData.email ? isValidEmail(formData.email) : true
  const showEmailError = formData.email && !isEmailValid

  const showServicesError = showValidationErrors && formData.selectedServices.length === 0

  const updateSelectedServices = (updatedServices: string[]) => {
    const servicesValue = updatedServices.join(", ")
    onUpdateFormData("selectedServices", updatedServices)
    onUpdateFormData("serviceType", servicesValue)
    onUpdateFormData("custom_fields", { Services: servicesValue })
  }

  const handleServiceToggle = (service: string) => {
    const isSelected = formData.selectedServices.includes(service)
    const updatedServices = isSelected
      ? formData.selectedServices.filter((s) => s !== service)
      : [...formData.selectedServices, service]

    updateSelectedServices(updatedServices)
  }

  const servicesDisplayText =
    formData.selectedServices.length > 0
      ? formData.selectedServices.join(", ")
      : "Select services"

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="text-center mb-8">
        <User className="mx-auto w-12 h-12 mb-4 text-[#3170c7]" />
        <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
        <p className="text-gray-600 mt-2">Please provide your contact details</p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              ref={firstNameInputRef}
              type="text"
              value={formData.firstName}
              onChange={(e) => onUpdateFormData("firstName", e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#3170c7] focus:border-[#3170c7]"
              placeholder="Enter your first name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => onUpdateFormData("lastName", e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#3170c7] focus:border-[#3170c7]"
              placeholder="Enter your last name"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 text-sm">+1</span>
            </div>
            <PhoneInput
              country="US"
              value={formData.phone}
              onChange={handlePhoneChange}
              onKeyPress={handleKeyPress}
              placeholder="Enter your phone number"
              className={`w-full pl-8 pr-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:border-[#3170c7] ${
                showPhoneError 
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500" 
                  : "border-gray-300 focus:ring-[#3170c7] focus:border-[#3170c7]"
              }`}
            />
            
          </div>
          {showPhoneError && (
              <p className="mt-1 text-sm text-red-600">
                Please enter a valid US phone number
              </p>
            )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => onUpdateFormData("email", e.target.value)}
            onKeyPress={handleKeyPress}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:border-[#3170c7] ${
              showEmailError 
                ? "border-red-300 focus:ring-red-500 focus:border-red-500" 
                : "border-gray-300 focus:ring-[#3170c7] focus:border-[#3170c7]"
            }`}
            placeholder="Enter your email address"
          />
          {showEmailError && (
            <p className="mt-1 text-sm text-red-600">
              Please enter a valid email address
            </p>
          )}
        </div>

        <div ref={servicesDropdownRef} className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Services <span className="text-red-500">*</span>
          </label>
          <button
            type="button"
            onClick={() => setIsServicesOpen((open) => !open)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm bg-white text-left flex items-center justify-between gap-2 focus:ring-2 focus:border-[#3170c7] ${
              showServicesError
                ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                : "border-gray-300 focus:ring-[#3170c7] focus:border-[#3170c7]"
            }`}
          >
            <span
              className={`truncate ${
                formData.selectedServices.length > 0 ? "text-gray-900" : "text-gray-500"
              }`}
            >
              {servicesDisplayText}
            </span>
            <ChevronDown
              className={`h-4 w-4 shrink-0 text-gray-500 transition-transform ${
                isServicesOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isServicesOpen && (
            <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg">
              <div className="max-h-48 overflow-y-auto py-1">
                {SERVICE_OPTIONS.map((option) => (
                  <label
                    key={option}
                    className="flex items-center gap-3 cursor-pointer px-3 py-2 hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={formData.selectedServices.includes(option)}
                      onChange={() => handleServiceToggle(option)}
                      className="h-4 w-4 text-[#3170c7] focus:ring-[#3170c7] border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {showServicesError && (
            <p className="mt-1 text-sm text-red-600">Please select at least one service</p>
          )}
        </div>

        <div className="mt-6">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="marketing-consent"
              checked={formData.marketingConsent || false}
              onChange={(e) => onUpdateFormData("marketingConsent", e.target.checked)}
              className="mt-1 h-4 w-4 text-[#3170c7] focus:ring-[#3170c7] border-gray-300 rounded"
              required
            />
            <label htmlFor="marketing-consent" className="text-sm text-gray-700 leading-relaxed">
            By checking this box, I agree to receive text messages from {COMPANY_NAME} related to service appointment updates, account notifications, and customer care communications at the phone number provided above. Message frequency may vary. Message and data rates may apply. Reply STOP to opt out at any time, or HELP for assistance. I understand that consent is not a condition of purchase. View our{" "}
              <a 
                href={TERMS_OF_SERVICE} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#3170c7] hover:text-[#3170c7]/80 underline"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a 
                href={PRIVACY_POLICY}
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#3170c7] hover:text-[#3170c7]/80 underline"
              >
                Privacy Policy
              </a>
              .
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
