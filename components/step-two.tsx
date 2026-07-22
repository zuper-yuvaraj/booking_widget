"use client"

import { User } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import PhoneInput from "react-phone-number-input/input"
import { isValidPhoneNumber } from "react-phone-number-input"
import { isValidEmail } from "@/lib/utils"
import type { StepProps } from "@/types/booking"
import { COMPANY_NAME, PRIVACY_POLICY, TERMS_OF_SERVICE, CREATE_BOOKING_WEBHOOK, COMPANY_UUID } from "@/configs"
import { useQueryParams } from "@/hooks/query-params.hooks"

const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
const labelClass = "block text-sm font-medium text-gray-700 mb-2"

export default function StepTwo({ formData, onUpdateFormData, onNext, isValid }: StepProps) {
  const firstNameInputRef = useRef<HTMLInputElement>(null)

  const [isSubmitting, setIsSubmitting] = useState(false)

  const searchParams = useQueryParams()
  const COMPANY_UID = searchParams.get("company_uid") || COMPANY_UUID

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

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const cf = formData.custom_fields || {}
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        email: formData.email,
        serviceType: formData.serviceType,
        address: formData.address,
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zipcode: formData.zipcode,
        latitude: formData.latitude,
        longitude: formData.longitude,
        selectedDate: formData.selectedDate,
        selectedSlot: formData.selectedSlot,
        selectedUser: formData.selectedUser,
        marketingConsent: formData.marketingConsent,
        description: formData.description,
        custom_fields: cf,
      }
      const response = await fetch(`${CREATE_BOOKING_WEBHOOK}?company_uid=${COMPANY_UID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!response.ok) {
        console.error("Failed to submit booking:", response.status, response.statusText)
      }
    } catch (error) {
      console.error("Error submitting booking:", error)
    } finally {
      setIsSubmitting(false)
      onNext()
    }
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
          <label className={labelClass}>Notes <span className="text-red-500">*</span></label>
          <textarea
            value={formData.description}
            onChange={(e) => onUpdateFormData("description", e.target.value)}
            className={`${inputClass} resize-none`}
            rows={4}
            placeholder="Any additional notes or details..."
          />
        </div>

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
              By checking this box, you consent to receive SMS messages from {COMPANY_NAME}, related to your inquiry and services, including appointment reminders, project updates, payment links, receipts, and care-related notifications. Message frequency may vary. Message and data rates may apply. Text HELP for assistance. Reply STOP to opt out. Consent is not a condition of purchase. See our {" "}
              <a
                href={TERMS_OF_SERVICE}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-800 underline"
              >
                Terms & Conditions
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

        {/* Submit */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isValid || isSubmitting}
            className={`w-full py-3 px-6 rounded-md font-medium transition-colors ${
              !isValid || isSubmitting
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-primary text-white hover:bg-primary/80"
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  )
}
