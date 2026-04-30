"use client"

import { User } from "lucide-react"
import { useEffect, useRef } from "react"
import PhoneInput from "react-phone-number-input/input"
import { isValidPhoneNumber } from "react-phone-number-input"
import { isValidEmail } from "@/lib/utils"
import type { StepProps } from "@/types/booking"
import { COMPANY_NAME, PRIVACY_POLICY, COMPANY_UID } from "@/configs"

export default function StepTwo({
  formData,
  onUpdateFormData,
  onNext,
  isValid,
}: StepProps) {
  const firstNameInputRef = useRef<HTMLInputElement>(null)

  /* -------------------- AUTO FOCUS -------------------- */

  useEffect(() => {
    firstNameInputRef.current?.focus()
  }, [])

  /* -------------------- VALIDATIONS -------------------- */

  const isPhoneValid = formData.phone
    ? isValidPhoneNumber(formData.phone)
    : true

  const showPhoneError = formData.phone && !isPhoneValid

  const isEmailValid = formData.email
    ? isValidEmail(formData.email)
    : true

  const showEmailError = formData.email && !isEmailValid

  const canProceed =
    isValid &&
    formData.marketingConsent === true &&
    isPhoneValid &&
    isEmailValid

  /* -------------------- HANDLERS -------------------- */

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && canProceed) {
      onNext()
    }
  }

  const handlePhoneChange = (value: string | undefined) => {
    onUpdateFormData("phone", value || "")
  }

  /* -------------------- DATE HANDLING (FIX) -------------------- */

  const today = new Date().toISOString().split("T")[0]

  // Convert stored ISO → input compatible yyyy-mm-dd
  const dateInputValue = formData.preferredDate
    ? formData.preferredDate.split("T")[0]
    : ""

  const handleDateChange = (value: string) => {
    if (!value) return

    // Store ISO string to avoid "Invalid Date"
    const isoDate = new Date(value + "T00:00:00").toISOString()

    onUpdateFormData("preferredDate", isoDate)
  }

  /* -------------------- UI -------------------- */

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <User className="mx-auto w-12 h-12 mb-4 text-green-500" />
        <h2 className="text-xl font-semibold text-gray-900">
          Personal Information
        </h2>
        <p className="text-gray-600 mt-2">
          Please provide your contact details
        </p>
      </div>

      <div className="space-y-4">

        {/* NAME */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name
            </label>

            <input
              ref={firstNameInputRef}
              type="text"
              value={formData.firstName}
              onChange={(e) =>
                onUpdateFormData("firstName", e.target.value)
              }
              onKeyDown={handleKeyPress}
              placeholder="Enter your first name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>

            <input
              type="text"
              value={formData.lastName}
              onChange={(e) =>
                onUpdateFormData("lastName", e.target.value)
              }
              onKeyDown={handleKeyPress}
              placeholder="Enter your last name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>

        {/* PHONE */}
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
              onKeyDown={handleKeyPress}
              placeholder="Enter your phone number"
              className={`w-full pl-8 pr-3 py-2 border rounded-md shadow-sm focus:ring-2 ${
                showPhoneError
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-300 focus:ring-green-500"
              }`}
            />
          </div>

          {showPhoneError && (
            <p className="mt-1 text-sm text-red-600">
              Please enter a valid US phone number
            </p>
          )}
        </div>

        {/* EMAIL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>

          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              onUpdateFormData("email", e.target.value)
            }
            onKeyDown={handleKeyPress}
            placeholder="Enter your email address"
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 ${
              showEmailError
                ? "border-red-300 focus:ring-red-500"
                : "border-gray-300 focus:ring-green-500"
            }`}
          />

          {showEmailError && (
            <p className="mt-1 text-sm text-red-600">
              Please enter a valid email address
            </p>
          )}
        </div>

        {/* ✅ PREFERRED DATE (FIXED) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Date
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
        
        {/* JOB TYPE */}
        {/* <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Type
          </label>

          <select
            value={formData.jobType || ""}
            onChange={(e) =>
              onUpdateFormData("jobType", e.target.value)
            }
            onKeyDown={handleKeyPress}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">Select job type</option>
            <option>Roof Replacement</option>
            <option>Roof Repair</option>
            <option>Gutters</option>
            <option>Siding</option>
            <option>Soffit/Fascia</option>
            <option>Windows/Doors</option>
            <option>General Construction/Remodeling</option>
            <option>Decks</option>
            <option>Siding Repair</option>
          </select>
        </div> */}
        

        {/* MARKETING CONSENT */}
        <div className="mt-6">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="marketing-consent"
              checked={formData.marketingConsent || false}
              onChange={(e) =>
                onUpdateFormData(
                  "marketingConsent",
                  e.target.checked
                )
              }
              className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              required
            />

             <label htmlFor="marketing-consent" className="text-sm text-gray-700 leading-relaxed">
              By submitting your phone number, you agree to receive marketing text messages from {COMPANY_NAME}. Message frequency varies. Message and data rates may apply. Text HELP for Support. Text STOP to opt-out. View our{" "}
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