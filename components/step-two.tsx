"use client"

import { User } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { isValidPhoneNumber } from "react-phone-number-input"
import { isValidEmail } from "@/lib/utils"
import type { StepProps } from "@/types/booking"
import { COMPANY_NAME, PRIVACY_POLICY, GET_CF_WEBHOOK } from "@/configs"

export default function StepTwo({ formData, onUpdateFormData, onNext, isValid, isTouched }: StepProps) {
  const firstNameInputRef = useRef<HTMLInputElement>(null)
  const [outreachTeamOptions, setOutreachTeamOptions] = useState<string[]>([])
  const [isLoadingOptions, setIsLoadingOptions] = useState(true)

  useEffect(() => {
    setIsLoadingOptions(true)
    fetch(GET_CF_WEBHOOK)
      .then((res) => res.json())
      .then((json: { type: string; data: { field_name: string; field_options: string[] }[] }) => {
        const field = json.data?.find((f) => f.field_name === "Outreach team")
        if (field?.field_options?.length) {
          setOutreachTeamOptions(field.field_options)
        }
      })
      .catch((err) => console.error("Failed to fetch CF webhook:", err))
      .finally(() => setIsLoadingOptions(false))
  }, [])

  const getUsPhoneDigits = (phone: string) => phone.replace(/\D/g, "").slice(0, 10)
  const isValidUsPhoneDigits = (digits: string) => {
    if (!/^[2-9]\d{9}$/.test(digits)) return false
    return isValidPhoneNumber(`+1${digits}`)
  }

  const showErrors = isTouched && !isValid

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

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = getUsPhoneDigits(e.target.value)
    if (digits !== formData.phone) {
      onUpdateFormData("phone", digits)
    }
  }
  const phoneDisplayValue = formData.phone || ""

  const isPhoneValid = formData.phone ? isValidUsPhoneDigits(formData.phone) : true
  const showPhoneError = formData.phone && !isPhoneValid && (showErrors || formData.phone.length > 0)

  const isEmailValid = formData.email ? isValidEmail(formData.email) : true
  const showEmailError = formData.email && !isEmailValid && (showErrors || formData.email.length > 0)
  const showPhoneRequiredError = !formData.phone && showErrors
  const showEmailRequiredError = !formData.email && showErrors

  const isFirstNameValid = !!formData.firstName?.trim()
  const isLastNameValid = !!formData.lastName?.trim()
  const isEmployeeStatusValid = formData.isNeeecoEmployee === "yes" || formData.isNeeecoEmployee === "no"
  const isEmployeeDependentValid = formData.isNeeecoEmployee === "yes"
    ? !!formData.outreachTeamMember
    : formData.isNeeecoEmployee === "no"
    ? !!formData.partnerName
    : false

  const showFirstNameError = !isFirstNameValid && showErrors
  const showLastNameError = !isLastNameValid && showErrors
  const showEmployeeStatusError = !isEmployeeStatusValid && showErrors
  const showEmployeeDependentError = isEmployeeStatusValid && !isEmployeeDependentValid && showErrors

  // ✅ Handle Yes/No switch + reset
  const handleEmployeeChange = (value: string) => {
    onUpdateFormData("isNeeecoEmployee", value)

    if (value === "yes") {
      onUpdateFormData("partnerName", "")
    } else if (value === "no") {
      onUpdateFormData("outreachTeamMember", "")
    }
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="text-center mb-8">
        <User className="mx-auto w-12 h-12 mb-4 text-green-500" />
        <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
        <p className="text-gray-600 mt-2">Please provide your contact details</p>
      </div>

      {showErrors && (
        <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700 mb-4">
          Please complete all required fields to continue.
        </div>
      )}

      <div className="space-y-4">

        {/* Name */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">First Name <span className="text-red-500">*</span></label>
            <input
              ref={firstNameInputRef}
              type="text"
              value={formData.firstName}
              onChange={(e) => onUpdateFormData("firstName", e.target.value)}
              onKeyPress={handleKeyPress}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 ${showFirstNameError ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-300 focus:ring-green-500 focus:border-green-500"}`}
              placeholder="Enter your first name"
            />
            {showFirstNameError && <p className="mt-1 text-sm text-red-600">First name is required.</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => onUpdateFormData("lastName", e.target.value)}
              onKeyPress={handleKeyPress}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 ${showLastNameError ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-300 focus:ring-green-500 focus:border-green-500"}`}
              placeholder="Enter your last name"
            />
            {showLastNameError && <p className="mt-1 text-sm text-red-600">Last name is required.</p>}
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 text-sm">+1</span>
            </div>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="tel-national"
              value={phoneDisplayValue}
              onChange={handlePhoneChange}
              onKeyPress={handleKeyPress}
              placeholder="Enter your phone number"
              className={`w-full pl-8 pr-3 py-2 border rounded-md shadow-sm focus:ring-2 ${
                showPhoneError || showPhoneRequiredError
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
          {showPhoneRequiredError && (
            <p className="mt-1 text-sm text-red-600">
              Phone number is required.
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => onUpdateFormData("email", e.target.value)}
            onKeyPress={handleKeyPress}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 ${
              showEmailError || showEmailRequiredError
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
          {showEmailRequiredError && (
            <p className="mt-1 text-sm text-red-600">
              Email is required.
            </p>
          )}
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            value={formData.notes || ""}
            onChange={(e) => onUpdateFormData("notes", e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
            placeholder="Enter any additional notes"
          />
        </div>

        {/* Electric Provider */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Electric Provider
          </label>
          <select
            value={formData.electricProvider || ""}
            onChange={(e) => onUpdateFormData("electricProvider", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select provider</option>
            <option value="National Grid">National Grid</option>
            <option value="Eversource">Eversource</option>
            <option value="Cape Light Compact">Cape Light Compact</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Electric Account */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Electric Account #
          </label>
          <input
            type="text"
            value={formData.electricAccount || ""}
            onChange={(e) => onUpdateFormData("electricAccount", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500"
            placeholder="Enter electric account number"
          />
        </div>

        {/* Gas Provider */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gas Provider
          </label>
          <select
            value={formData.gasProvider || ""}
            onChange={(e) => onUpdateFormData("gasProvider", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select provider</option>
            <option value="National Grid">National Grid</option>
            <option value="Eversource">Eversource</option>
            <option value="Cape Light Compact">Cape Light Compact</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Gas Account */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gas Account #
          </label>
          <input
            type="text"
            value={formData.gasAccount || ""}
            onChange={(e) => onUpdateFormData("gasAccount", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500"
            placeholder="Enter gas account number"
          />
        </div>

        {/* Neeeco Employee */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Are you a Neeeco employee? <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.isNeeecoEmployee || ""}
            onChange={(e) => handleEmployeeChange(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 ${showEmployeeStatusError ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-300 focus:ring-green-500 focus:border-green-500"}`}
          >
            <option value="">Select</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
          {showEmployeeStatusError && (
            <p className="mt-1 text-sm text-red-600">Employee status is required.</p>
          )}
        </div>

        {/* Conditional Dropdown */}
        {formData.isNeeecoEmployee === "yes" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Outreach Team <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.outreachTeamMember || ""}
              onChange={(e) => onUpdateFormData("outreachTeamMember", e.target.value)}
              disabled={isLoadingOptions}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 ${showEmployeeDependentError ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-300 focus:ring-green-500 focus:border-green-500"} ${isLoadingOptions ? "bg-gray-100 text-gray-400 cursor-not-allowed" : ""}`}
            >
              {isLoadingOptions
                ? <option value="">Loading options...</option>
                : <>
                    <option value="">Select team member</option>
                    {outreachTeamOptions.map((member) => (
                      <option key={member} value={member}>{member}</option>
                    ))}
                  </>
              }
            </select>
            {showEmployeeDependentError && (
              <p className="mt-1 text-sm text-red-600">Please select an outreach team member.</p>
            )}
          </div>
        )}

        {formData.isNeeecoEmployee === "no" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Partners <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.partnerName || ""}
              onChange={(e) => onUpdateFormData("partnerName", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 ${showEmployeeDependentError ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-300 focus:ring-green-500 focus:border-green-500"}`}
            >
              <option value="">Select partner</option>
              <option>QARI - Quincy</option>
              <option>QARI - Randolph</option>
              <option>City of Chelsea</option>
              <option>City of Revere</option>
              <option>Town of Winthrop</option>
              <option>All In Energy</option>
            </select>
            {showEmployeeDependentError && (
              <p className="mt-1 text-sm text-red-600">Please select a partner.</p>
            )}
          </div>
        )}

        {/* Marketing Consent */}
        <div className="mt-6">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={formData.marketingConsent || false}
              onChange={(e) => onUpdateFormData("marketingConsent", e.target.checked)}
              className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              required
            />
            <label className="text-sm text-gray-700 leading-relaxed">
              By submitting your phone number, you agree to receive marketing text messages from {COMPANY_NAME}. 
              View our{" "}
              
              <a href={PRIVACY_POLICY} target="_blank" className="text-green-600 underline">Privacy Policy</a>.
            </label>
          </div>
        </div>

      </div>
    </div>
  )
}