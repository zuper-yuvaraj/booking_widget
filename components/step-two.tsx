"use client"

import { User } from "lucide-react"
import { useEffect, useRef } from "react"
import PhoneInput from "react-phone-number-input/input"
import { isValidPhoneNumber } from "react-phone-number-input"
import { isValidEmail } from "@/lib/utils"
import type { StepProps } from "@/types/booking"
import { COMPANY_NAME, PRIVACY_POLICY, TERMS_OF_SERVICE } from "@/configs"

const INSPECTION_TIME_OPTIONS = [
  "8 AM to 10 AM",
  "10 AM to 12 PM",
  "12 PM to 2 PM",
  "2 PM to 4 PM",
  "4 PM to 6 PM",
]

const PREFERRED_TIME_OPTIONS = [
  "Weekdays",
  "Weekend",
  "Morning",
  "Afternoon",
  "Evening",
]

export default function StepTwo({ formData, onUpdateFormData, onNext, isValid, isTouched }: StepProps) {
  const firstNameInputRef = useRef<HTMLInputElement>(null)

  const showErrors = isTouched && !isValid

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

  // Fix 1: Renamed to handleInspectionTimeChange and fixed .label reference
  const handleInspectionTimeChange = (value: string) => {
    onUpdateFormData("preferredInspectionTime", value)
  }

  const handleFiledClaimChange = (value: "yes" | "no") => {
    onUpdateFormData("filedClaim", value)
  }

  

  // Phone validation
  const isPhoneValid = formData.phone ? isValidPhoneNumber(formData.phone) : true
  const showPhoneError = formData.phone && !isPhoneValid && (showErrors || formData.phone.length > 0)
  const showPhoneRequiredError = !formData.phone && showErrors

  // Email validation
  const isEmailValid = formData.email ? isValidEmail(formData.email) : true
  const showEmailError = formData.email && !isEmailValid && (showErrors || formData.email.length > 0)
  const showEmailRequiredError = !formData.email && showErrors

  // Field validations
  const isFirstNameValid = !!formData.firstName?.trim()
  const isLastNameValid = !!formData.lastName?.trim()
  const isPreferredTimeOptionsValid = !!(formData.preferredTimeOptions || []).length  // Fix 2: checkbox array
  const isInspectionTimeValid = !!formData.preferredInspectionTime               // Fix 3: separate dropdown
  const isClaimTypeValid = !!formData.claimType
  const isFiledClaimValid = !!formData.filedClaim
  const isInsuranceCompanyValid = !!formData.insuranceCompany
  const isSourceOfLeadValid = !!formData.sourceOfLead
  const isEmployeeStatusValid = formData.isNeeecoEmployee === "yes" || formData.isNeeecoEmployee === "no"
  const isEmployeeDependentValid =
    formData.isNeeecoEmployee === "yes"
      ? !!formData.outreachTeamMember
      : formData.isNeeecoEmployee === "no"
      ? !!formData.partnerName
      : false

  const showFirstNameError = !isFirstNameValid && showErrors
  const showLastNameError = !isLastNameValid && showErrors
  const showInspectionTimeError = !isInspectionTimeValid && showErrors  // Fix 4: now defined
  const showClaimTypeError = !isClaimTypeValid && showErrors
  const showFiledClaimError = !isFiledClaimValid && showErrors
  const showInsuranceCompanyError = !isInsuranceCompanyValid && showErrors
  const showSourceOfLeadError = !isSourceOfLeadValid && showErrors
  const showEmployeeStatusError = !isEmployeeStatusValid && showErrors
  const showEmployeeDependentError = isEmployeeStatusValid && !isEmployeeDependentValid && showErrors

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <User className="mx-auto w-12 h-12 mb-4 text-green-500" />
        <h2 className="text-xl font-semibold text-gray-900">Personal & Service Information</h2>
        <p className="text-gray-600 mt-2">Please provide your contact details and service information</p>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              ref={firstNameInputRef}
              type="text"
              value={formData.firstName}
              onChange={(e) => onUpdateFormData("firstName", e.target.value)}
              onKeyPress={handleKeyPress}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 ${
                showFirstNameError
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 focus:ring-green-500 focus:border-green-500"
              }`}
              placeholder="Enter your first name"
            />
            {showFirstNameError && <p className="mt-1 text-sm text-red-600">First name is required.</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => onUpdateFormData("lastName", e.target.value)}
              onKeyPress={handleKeyPress}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 ${
                showLastNameError
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 focus:ring-green-500 focus:border-green-500"
              }`}
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
            <PhoneInput
              country="US"
              value={formData.phone}
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
            <p className="mt-1 text-sm text-red-600">Please enter a valid US phone number</p>
          )}
          {showPhoneRequiredError && (
            <p className="mt-1 text-sm text-red-600">Phone number is required.</p>
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
            <p className="mt-1 text-sm text-red-600">Please enter a valid email address</p>
          )}
          {showEmailRequiredError && (
            <p className="mt-1 text-sm text-red-600">Email is required.</p>
          )}
        </div>

        {/* Preferred Time (Checkboxes) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Inspection Time <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {PREFERRED_TIME_OPTIONS.map((option) => (
              <label key={option} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={(formData.preferredTimeOptions || []).includes(option)}
                  onChange={(e) => {
                    const current = formData.preferredTimeOptions || []
                    if (e.target.checked) {
                      onUpdateFormData("preferredTimeOptions", [...current, option])
                    } else {
                      onUpdateFormData(
                        "preferredTimeOptions",
                        current.filter((item) => item !== option)
                      )
                    }
                  }}
                  className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
          {showErrors && !isPreferredTimeOptionsValid && (
            <p className="mt-1 text-sm text-red-600">Please select at least one option.</p>
          )}
        </div>

        {/* Inspection Time (Dropdown) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Inspection Time <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.preferredInspectionTime || ""}
            onChange={(e) => handleInspectionTimeChange(e.target.value)}  // Fix 5: correct handler name
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 ${
              showInspectionTimeError
                ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                : "border-gray-300 focus:ring-green-500 focus:border-green-500"
            }`}
          >
            <option value="">Select inspection time</option>
            {INSPECTION_TIME_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {showInspectionTimeError && (
            <p className="mt-1 text-sm text-red-600">Inspection time is required.</p>
          )}
        </div>

        {/* Claim Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Insurance Claim or Retail? <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.claimType || ""}
            onChange={(e) =>
              onUpdateFormData("claimType", e.target.value as "Insurance Claim" | "Retail" | "Possible Repair")
            }
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 ${
              showClaimTypeError
                ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                : "border-gray-300 focus:ring-green-500 focus:border-green-500"
            }`}
          >
            <option value="">Select an option</option>
            <option value="Insurance Claim">Insurance Claim</option>
            <option value="Retail">Retail</option>
            <option value="Possible Repair">Possible Repair</option>
          </select>
          {showClaimTypeError && (
            <p className="mt-1 text-sm text-red-600">Please select claim type.</p>
          )}
        </div>

        {/* Filed Claim */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Have you Already Filed a Claim? <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-col space-y-3">
            <label className="flex items-center">
              <input
                type="radio"
                name="filedClaim"
                value="yes"
                checked={formData.filedClaim === "yes"}
                onChange={(e) =>
  handleFiledClaimChange(e.target.value as "yes" | "no")
}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Yes</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="filedClaim"
                value="no"
                checked={formData.filedClaim === "no"}
                onChange={(e) =>
  handleFiledClaimChange(e.target.value as "yes" | "no")
}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">No</span>
            </label>
          </div>
          {showFiledClaimError && (
            <p className="mt-1 text-sm text-red-600">Please select an option.</p>
          )}
        </div>

        {/* Insurance Company */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Insurance Company <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.insuranceCompany || ""}
            onChange={(e) => onUpdateFormData("insuranceCompany", e.target.value)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 ${
              showInsuranceCompanyError
                ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                : "border-gray-300 focus:ring-green-500 focus:border-green-500"
            }`}
            placeholder="Enter insurance company name"
          />
          {showInsuranceCompanyError && (
            <p className="mt-1 text-sm text-red-600">Insurance company is required.</p>
          )}
        </div>

        {/* Referral Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            If Referral, Referred by Name
          </label>
          <input
            type="text"
            value={formData.referralName || ""}
            onChange={(e) => onUpdateFormData("referralName", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Enter referral name"
          />
        </div>

        {/* Source of Lead */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            How did you hear about us? <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.sourceOfLead || ""}
            onChange={(e) => onUpdateFormData("sourceOfLead", e.target.value)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 ${
              showSourceOfLeadError
                ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                : "border-gray-300 focus:ring-green-500 focus:border-green-500"
            }`}
            placeholder="Enter source of lead"
          />
          {showSourceOfLeadError && (
            <p className="mt-1 text-sm text-red-600">Source of lead is required.</p>
          )}
        </div>

        {/* Additional Comments */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Comments
          </label>
          <textarea
            value={formData.additionalComments || ""}
            onChange={(e) => onUpdateFormData("additionalComments", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Enter any additional comments"
            rows={4}
          />
        </div>

        {/* Marketing Consent */}
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
              By submitting your phone number, you agree to receive marketing text messages from {COMPANY_NAME}.
              Message frequency varies. Message and data rates may apply. Text HELP for Support. Text STOP to opt-out. View our{" "}
              <a
                href={PRIVACY_POLICY}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-800 underline"
              >
                Privacy Policy
              </a>
              {" "}and{" "}
              <a
                href={TERMS_OF_SERVICE}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-800 underline"
              >
                Terms of Service
              </a>
              .
            </label>
          </div>
        </div>

      </div>
    </div>
  )
}