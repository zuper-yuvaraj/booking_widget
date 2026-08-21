"use client"

import { Calendar } from "lucide-react"
import { User } from "lucide-react"
import { useEffect, useRef } from "react"
import DatePicker from "react-datepicker"
import PhoneInput from "react-phone-number-input/input"
import { isValidPhoneNumber } from "react-phone-number-input"

import "react-datepicker/dist/react-datepicker.css"

import { isValidEmail } from "@/lib/utils"
import type { StepProps } from "@/types/booking"
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

  /* -------------------- DATE HANDLING -------------------- */

  // Stored as MM-DD-YYYY. react-datepicker renders its own
  // calendar, so the format is identical in every browser and
  // locale, unlike <input type="date">.

  const preferredDate = formData.preferredDate || ""

  // MM-DD-YYYY string -> Date, or null if it isn't a real date.
  const parseDate = (value: string) => {
    const match = /^(\d{2})-(\d{2})-(\d{4})$/.exec(value)

    if (!match) {
      return null
    }

    const [, mm, dd, yyyy] = match

    const date = new Date(Number(yyyy), Number(mm) - 1, Number(dd))

    // Rejects values like 02-31-2026, which Date silently rolls over.
    if (
      date.getFullYear() !== Number(yyyy) ||
      date.getMonth() !== Number(mm) - 1 ||
      date.getDate() !== Number(dd)
    ) {
      return null
    }

    return date
  }

  // Date -> MM-DD-YYYY string.
  const formatDate = (date: Date | null) => {
    if (!date) {
      return ""
    }

    const mm = String(date.getMonth() + 1).padStart(2, "0")
    const dd = String(date.getDate()).padStart(2, "0")

    return `${mm}-${dd}-${date.getFullYear()}`
  }

  const selectedDate = parseDate(preferredDate)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const isDateValid = selectedDate !== null && selectedDate >= today

  // Only complain once they've typed something full-length.
  const showDateError = preferredDate.length === 10 && !isDateValid

  const handleDateChange = (date: Date | null) => {
    onUpdateFormData("preferredDate", formatDate(date))
  }

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
    isEmailValid &&
    isDateValid

  /* -------------------- HANDLERS -------------------- */

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && canProceed) {
      onNext()
    }
  }

  const handlePhoneChange = (value: string | undefined) => {
    onUpdateFormData("phone", value || "")
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
          {/* First Name */}

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

          {/* Last Name */}

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

        {/* PREFERRED DATE */}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Date
          </label>

          <div className="relative">
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              onKeyDown={handleKeyPress}
              dateFormat="MM-dd-yyyy"
              placeholderText="MM-DD-YYYY"
              minDate={today}
              showPopperArrow={false}
              wrapperClassName="w-full"
              className={`w-full pl-3 pr-10 py-2 border rounded-md shadow-sm focus:ring-2 focus:outline-none ${
                showDateError
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-300 focus:ring-green-500 focus:border-green-500"
              }`}
            />

            {/*
              Decorative only. The input itself opens the calendar
              on click, and clicks pass through this icon to it.
            */}

            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <Calendar className="w-4 h-4 text-gray-400" />
            </div>
          </div>

          {showDateError && (
            <p className="mt-1 text-sm text-red-600">
              Please enter a valid future date (MM-DD-YYYY)
            </p>
          )}
        </div>

        {/* JOB TYPE */}

        {/*
        <div>
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
        </div>
        */}

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

            <label
              htmlFor="marketing-consent"
              className="text-sm text-gray-700 leading-relaxed"
            >
              By checking this box, I agree to receive text messages
              from {COMPANY_NAME} related to service appointment
              updates, account notifications, and customer care
              communications at the phone number provided above.
              Message frequency may vary. Message and data rates may
              apply. Reply STOP to opt out at any time, or HELP for
              assistance. I understand that consent is not a condition
              of purchase. View our{" "}

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