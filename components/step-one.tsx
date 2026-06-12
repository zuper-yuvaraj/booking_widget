"use client"

import { useEffect, useRef } from "react"
import { User, Phone, Mail } from "lucide-react"
import PhoneInput from "react-phone-number-input/input"
import { isValidPhoneNumber } from "react-phone-number-input"
import { isValidEmail } from "@/lib/utils"
import type { StepProps } from "@/types/booking"

export default function StepOne({ formData, onUpdateFormData, onNext, isValid }: StepProps) {
  const firstNameInputRef = useRef<HTMLInputElement>(null)

  // Phone and email validation
  const isPhoneValid = formData.phone ? isValidPhoneNumber(formData.phone) : true
  const showPhoneError = formData.phone && !isPhoneValid

  const isEmailValid = formData.email ? isValidEmail(formData.email) : true
  const showEmailError = formData.email && !isEmailValid

  // Auto-focus the first name input when component mounts
  useEffect(() => {
    if (firstNameInputRef.current) {
      firstNameInputRef.current.focus()
    }
  }, [])

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && isValid) {
      onNext()
    }
  }

  const handlePhoneChange = (value: string | undefined) => {
    onUpdateFormData("phone", value || "")
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* PERSONAL INFORMATION SECTION */}
      <div className="space-y-4">
        <div className="text-center mb-6">
          <User className="mx-auto w-12 h-12 mb-4 text-green-500" />
          <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
          <p className="text-gray-600 mt-2">Please provide your contact details</p>
        </div>

        <div className="space-y-4">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <input
                ref={firstNameInputRef}
                type="text"
                value={formData.firstName}
                onChange={(e) => onUpdateFormData("firstName", e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Enter your first name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => onUpdateFormData("lastName", e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Enter your last name"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
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
                className={`w-full pl-8 pr-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:border-green-500 ${
                  showPhoneError
                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300 focus:ring-green-500 focus:border-green-500"
                }`}
              />
            </div>

            {showPhoneError && (
              <p className="mt-1 text-sm text-red-600">
                Please enter a valid US phone number
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>

            <input
              type="email"
              value={formData.email}
              onChange={(e) => onUpdateFormData("email", e.target.value)}
              onKeyPress={handleKeyPress}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:border-green-500 ${
                showEmailError
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 focus:ring-green-500 focus:border-green-500"
              }`}
              placeholder="Enter your email address"
            />

            {showEmailError && (
              <p className="mt-1 text-sm text-red-600">
                Please enter a valid email address
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
