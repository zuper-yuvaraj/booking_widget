"use client"

import { User, ChevronDown } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { isValidEmail, isValidUsPhone, normalizeUsPhoneDigits } from "@/lib/utils"
import type { StepProps } from "@/types/booking"
import { COMPANY_NAME, PRIVACY_POLICY, TERMS_OF_SERVICE } from "@/configs"

const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
const labelClass = "block text-sm font-medium text-gray-700 mb-2"

const SERVICES = [
  "Roof Replacement",
  "Roof Install (New Construction)",
  "Roof Repair",
  "Insurance Claim",
  "Gutters",
  "Siding",
  "Windows",
  "Doors"
]

function ServicesMultiSelect({ selected, onChange }: { selected: string[]; onChange: (v: string[]) => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const toggle = (service: string) => {
    if (selected.includes(service)) {
      onChange(selected.filter(s => s !== service))
    } else {
      onChange([...selected, service])
    }
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-left flex justify-between items-center bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none"
      >
        <span className={`text-sm truncate ${selected.length ? "text-gray-900" : "text-gray-400"}`}>
          {selected.length ? selected.join(", ") : "Select services..."}
        </span>
        <ChevronDown className={`w-4 h-4 ml-2 shrink-0 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && (
        <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-60 overflow-auto">
          {SERVICES.map(service => (
            <label
              key={service}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-700"
            >
              <input
                type="checkbox"
                checked={selected.includes(service)}
                onChange={() => toggle(service)}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              {service}
            </label>
          ))}
        </div>
      )}
    </div>
  )
}

export default function StepTwo({ formData, onUpdateFormData, onNext, isValid, isTouched }: StepProps) {
  const firstNameInputRef = useRef<HTMLInputElement>(null)
  const [phoneBlurred, setPhoneBlurred] = useState(false)

  const showErrors = isTouched && !isValid
  const showPhoneFeedback = phoneBlurred || isTouched
  const selectedServices = formData.services
    ? formData.services.split(",").map(s => s.trim()).filter(Boolean)
    : []

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
    const digits = normalizeUsPhoneDigits(e.target.value)
    if (digits !== formData.phone) {
      onUpdateFormData("phone", digits)
    }
  }

  const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") return
    const allowedKeys = ["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight", "Home", "End"]
    if (allowedKeys.includes(e.key) || e.ctrlKey || e.metaKey) return
    if (!/^\d$/.test(e.key)) {
      e.preventDefault()
    }
  }

  const handleServicesChange = (services: string[]) => {
    onUpdateFormData("services", services.length > 0 ? services.join(", ") : "")
  }

  const phoneDigits = formData.phone
  const isPhoneComplete = phoneDigits.length === 10
  const isPhoneValid = isPhoneComplete && isValidUsPhone(phoneDigits)
  const showPhoneError = showPhoneFeedback && phoneDigits.length > 0 && !isPhoneValid
  const isEmailValid = formData.email ? isValidEmail(formData.email) : true
  const showPhoneRequiredError = showPhoneFeedback && phoneDigits.length === 0
  const showEmailError = formData.email && !isEmailValid

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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 text-sm">+1</span>
            </div>
            <input
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              value={phoneDigits}
              onChange={handlePhoneChange}
              onKeyDown={handlePhoneKeyDown}
              onBlur={() => setPhoneBlurred(true)}
              onKeyPress={handleKeyPress}
              maxLength={10}
              placeholder="Enter your phone number"
              aria-invalid={showPhoneError || showPhoneRequiredError}
              className={`w-full pl-8 pr-3 py-2 border rounded-md shadow-sm focus:ring-2 ${
                showPhoneError || showPhoneRequiredError
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 focus:ring-green-500 focus:border-green-500"
              }`}
            />
          </div>
          {!showPhoneError && !showPhoneRequiredError && (
            <p className="mt-1 text-xs text-gray-500">Enter 10 digits (US only)</p>
          )}
          {showPhoneRequiredError && (
            <p className="mt-1 text-sm text-red-600">Phone number is required.</p>
          )}
          {showPhoneError && (
            <p className="mt-1 text-sm text-red-600">
              Enter a valid US phone number.
            </p>
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

        {/* Preferred Date */}
        <div>
          <label className={labelClass}>
            Preferred Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={formData.preferredDate}
            onChange={(e) => onUpdateFormData("preferredDate", e.target.value)}
            onKeyPress={handleKeyPress}
            className={inputClass}
          />
        </div>

        {/* Preferred Time Slot */}
        <div>
          <label className={labelClass}>
            Preferred Time Slot <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.preferredTimeSlot}
            onChange={(e) => onUpdateFormData("preferredTimeSlot", e.target.value)}
            className={inputClass}
          >
            <option value="">Select a time slot...</option>
            {[
              "8:00 AM - 10:00 AM",
              "10:00 AM - 12:00 PM",
              "12:00 PM - 2:00 PM",
              "2:00 PM - 4:00 PM",
              "4:00 PM - 6:00 PM",
            ].map((slot) => (
              <option key={slot} value={slot}>{slot}</option>
            ))}
          </select>
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

        {/* Services multi-select */}
        <div>
          <label className={labelClass}>Services</label>
          <ServicesMultiSelect selected={selectedServices} onChange={handleServicesChange} />
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
