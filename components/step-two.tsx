"use client"

import { User } from "lucide-react"
import { useEffect, useRef } from "react"
import PhoneInput from "react-phone-number-input/input"
import { isValidPhoneNumber } from "react-phone-number-input"
import { isValidEmail } from "@/lib/utils"
import type { StepProps } from "@/types/booking"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import {
  COMPANY_NAME,
  PRIVACY_POLICY,
  TERMS_OF_SERVICE,
} from "@/configs"

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

  /* -------------------- DATE HANDLING (MM/DD/YYYY) -------------------- */

  // Format ISO → MM/DD/YYYY
  const formatToUSDate = (iso: string) => {
    if (!iso) return ""
    try {
      return new Date(iso).toLocaleDateString("en-US")
    } catch {
      return ""
    }
  }

  // Validate MM/DD/YYYY
  const isValidDate = (value: string) => {
    return /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/.test(value)
  }

  // Convert MM/DD/YYYY → ISO
  const parseToISO = (value: string) => {
    const [month, day, year] = value.split("/")
    if (!month || !day || !year) return ""

    const iso = new Date(`${year}-${month}-${day}T00:00:00`)
    return isNaN(iso.getTime()) ? "" : iso.toISOString()
  }

  const handleDateChange = (value: string) => {
    // Always store raw input for UI
    onUpdateFormData("preferredDate", value)

    // Only convert if valid
    if (isValidDate(value)) {
      const iso = parseToISO(value)
      if (iso) {
        onUpdateFormData("preferredDateISO", iso)
      }
    }
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

        {/* ✅ PREFERRED DATE */}
       
          

      <div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Preferred Date
  </label>

  <DatePicker
    selected={
      formData.preferredDateISO
        ? new Date(formData.preferredDateISO)
        : null
    }
    onChange={(date: Date | null) => {
      if (!date) return

      const iso = date.toISOString()

      const formatted = `${String(date.getMonth() + 1).padStart(2, "0")}/${String(
        date.getDate()
      ).padStart(2, "0")}/${date.getFullYear()}`

      onUpdateFormData("preferredDate", formatted)
      onUpdateFormData("preferredDateISO", iso)
    }}
    minDate={new Date()}
    dateFormat="MM/dd/yyyy"
    placeholderText="Select a date"

    
    wrapperClassName="w-full"
    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"

  />
</div>
   

        {/* COMMENTS */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Comments
          </label>

          <textarea
            value={formData.additionalComments || ""}
            onChange={(e) =>
              onUpdateFormData("additionalComments", e.target.value)
            }
            placeholder="Enter any additional comments..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
            rows={4}
          />
        </div>

        {/* CONSENT */}
        <div className="mt-6 flex items-start space-x-3">
          <input
            type="checkbox"
            checked={formData.marketingConsent || false}
            onChange={(e) =>
              onUpdateFormData("marketingConsent", e.target.checked)
            }
            className="mt-1 h-4 w-4 text-green-600 border-gray-300 rounded"
          />

          <label className="text-sm text-gray-700">
            By submitting your phone number, you agree to receive marketing text messages from {COMPANY_NAME}. View our{" "}
            <a href={TERMS_OF_SERVICE} target="_blank" className="text-green-600 underline">
              Terms
            </a>{" "}
            and{" "}
            <a href={PRIVACY_POLICY} target="_blank" className="text-green-600 underline">
              Privacy Policy
            </a>
            .
          </label>
        </div>

      </div>
    </div>
  )
}