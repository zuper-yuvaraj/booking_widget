"use client"

import { User } from "lucide-react"
import { useEffect, useRef } from "react"
import PhoneInput from "react-phone-number-input/input"
import { isValidPhoneNumber } from "react-phone-number-input"
import { isValidEmail } from "@/lib/utils"
import type { StepProps } from "@/types/booking"
import { COMPANY_NAME, PRIVACY_POLICY, TERMS_OF_SERVICE } from "@/configs"

const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
const labelClass = "block text-sm font-medium text-gray-700 mb-2"

const INSURANCE_OPTIONS = [
  "Alfa",
  "Allstate",
  "Country Financial",
  "State Farm",
  "Farmers",
  "Travelers",
  "USAA",
  "Other",
]

export default function StepTwo({ formData, onUpdateFormData, onNext, isValid }: StepProps) {
  const firstNameInputRef = useRef<HTMLInputElement>(null)
  const cf = formData.custom_fields || {}

  useEffect(() => {
    if (firstNameInputRef.current) {
      firstNameInputRef.current.focus()
    }
  }, [])

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isValid) {
      onNext()
    }
  }

  const handlePhoneChange = (value: string | undefined) => {
    onUpdateFormData("phone", value || "")
  }

  const updateCustomField = (key: string, value: string) => {
    onUpdateFormData("custom_fields", { ...cf, [key]: value })
  }

  const isPhoneValid = formData.phone ? isValidPhoneNumber(formData.phone) : true
  const showPhoneError = formData.phone && !isPhoneValid
  const isEmailValid = formData.email ? isValidEmail(formData.email) : true
  const showEmailError = formData.email && !isEmailValid

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="text-center mb-8">
        <User className="mx-auto w-12 h-12 mb-4 text-green-500" />
        <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
        <p className="text-gray-600 mt-2">Please provide your contact details</p>
      </div>

      <div className="space-y-4">
        {/* First/Last Name */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              ref={firstNameInputRef}
              type="text"
              value={formData.firstName}
              onChange={(e) => onUpdateFormData("firstName", e.target.value)}
              onKeyPress={handleKeyPress}
              className={inputClass}
              placeholder="Enter your first name"
            />
          </div>
          <div>
            <label className={labelClass}>Last Name</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => onUpdateFormData("lastName", e.target.value)}
              onKeyPress={handleKeyPress}
              className={inputClass}
              placeholder="Enter your last name"
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className={labelClass}>
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
              className={`w-full pl-8 pr-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:border-green-500 ${
                showPhoneError
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 focus:ring-green-500 focus:border-green-500"
              }`}
            />
          </div>
          {showPhoneError && (
            <p className="mt-1 text-sm text-red-600">Please enter a valid US phone number</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className={labelClass}>
            Email <span className="text-red-500">*</span>
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
            <p className="mt-1 text-sm text-red-600">Please enter a valid email address</p>
          )}
        </div>

        {/* Notes */}
        <div>
          <label className={labelClass}>Notes</label>
          <textarea
            value={formData.description}
            onChange={(e) => onUpdateFormData("description", e.target.value)}
            className={`${inputClass} resize-none`}
            rows={4}
            placeholder="Any additional notes or details..."
          />
        </div>

        {/* How old is the roof? */}
        <div>
          <label className={labelClass}>How old is the roof?</label>
          <input
            type="text"
            value={cf["How old is the roof?"] || ""}
            onChange={(e) => updateCustomField("How old is the roof?", e.target.value)}
            className={inputClass}
            placeholder="e.g. 10 years"
          />
        </div>

        {/* Current Roof type? */}
        <div>
          <label className={labelClass}>Current Roof type?</label>
          <input
            type="text"
            value={cf["Current Roof type?"] || ""}
            onChange={(e) => updateCustomField("Current Roof type?", e.target.value)}
            className={inputClass}
            placeholder="e.g. Shingle"
          />
        </div>

        {/* Desired Roof type? */}
        <div>
          <label className={labelClass}>Desired Roof type?</label>
          <input
            type="text"
            value={cf["Desired Roof type?"] || ""}
            onChange={(e) => updateCustomField("Desired Roof type?", e.target.value)}
            className={inputClass}
            placeholder="e.g. Metal"
          />
        </div>

        {/* Insurance */}
        <div>
          <label className={labelClass}>Insurance <span className="text-red-500">*</span></label>
          <select
            value={cf["Insurance"] || ""}
            onChange={(e) => {
              const newVal = e.target.value
              const updates: Record<string, string> = { ...cf, Insurance: newVal }
              if (newVal !== "Other") {
                updates["Other Insurance"] = ""
              }
              onUpdateFormData("custom_fields", updates)
            }}
            className={inputClass}
          >
            <option value="">Select insurance...</option>
            {INSURANCE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        {/* Other Insurance (conditional) */}
        {cf["Insurance"] === "Other" && (
          <div>
            <label className={labelClass}>
              Other Insurance <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={cf["Other Insurance"] || ""}
              onChange={(e) => updateCustomField("Other Insurance", e.target.value)}
              className={inputClass}
              placeholder="Enter your insurance provider"
            />
          </div>
        )}

        {/* Consent */}
        <div className="mt-6">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="marketing-consent"
              checked={formData.marketingConsent || false}
              onChange={(e) => onUpdateFormData("marketingConsent", e.target.checked)}
              className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              required
            />
            <label htmlFor="marketing-consent" className="text-sm text-gray-700 leading-relaxed">
              By submitting your phone number, you agree to receive marketing text messages from {COMPANY_NAME}. Message frequency varies. Message and data rates may apply. Text HELP for Support. Text STOP to opt-out. View our{" "}
              <a
                href={TERMS_OF_SERVICE}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-800 underline"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href={PRIVACY_POLICY}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-800 underline"
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
