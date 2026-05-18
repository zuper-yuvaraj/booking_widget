"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import PhoneInput from "react-phone-number-input/input"
import { isValidEmail, isValidUSPhoneNumber } from "@/lib/utils"
import type { StepProps } from "@/types/booking"
import { COMPANY_NAME, PRIVACY_POLICY, TERMS_OF_SERVICE } from "@/configs"

/** Values sent to webhook custom field "How did you hear about us?" */
const HEAR_ABOUT_US_OPTIONS = [
  { value: "", label: "Select" },
  {
    value: "Social Media (Facebook, Instagram, etc.)",
    label: "Social Media (Facebook, Instagram, etc.)",
  },
  {
    value: "Search Engines (Google, Bing, etc.)",
    label: "Search Engines (Google, Bing, etc.)",
  },
  {
    value: "Physical Ads (signs, door knockers, company vehicle)",
    label: "Physical Ads (signs, door knockers, company vehicle)",
  },
  { value: "Word of Mouth", label: "Word of Mouth" },
  { value: "Other", label: "Other" },
]

type BlurField = "firstName" | "lastName" | "email" | "phone" | "sourceOfLead" | "terms" | "marketing"

export default function StepFour({ formData, onUpdateFormData }: StepProps) {
  const firstNameRef = useRef<HTMLInputElement>(null)
  const [blurred, setBlurred] = useState<Partial<Record<BlurField, boolean>>>({})

  const markBlurred = useCallback((field: BlurField) => {
    setBlurred((prev) => ({ ...prev, [field]: true }))
  }, [])

  useEffect(() => {
    firstNameRef.current?.focus()
  }, [])

  const isPhoneValid = formData.phone ? isValidUSPhoneNumber(formData.phone) : false
  const isEmailValid = formData.email ? isValidEmail(formData.email) : false
  const isFirstNameValid = !!formData.firstName?.trim()
  const isLastNameValid = !!formData.lastName?.trim()
  const isSourceValid = !!formData.sourceOfLead?.trim()
  const termsOk = formData.termsAccepted === true
  const marketingOk = formData.marketingConsent === true

  const showFirst = blurred.firstName && !isFirstNameValid
  const showLast = blurred.lastName && !isLastNameValid
  const showEmailRequired = blurred.email && !formData.email.trim()
  const showEmailInvalid = blurred.email && !!formData.email.trim() && !isEmailValid
  const showPhoneRequired = blurred.phone && !formData.phone.trim()
  const showPhoneInvalid = blurred.phone && !!formData.phone.trim() && !isPhoneValid
  const showSource = blurred.sourceOfLead && !isSourceValid
  const showTerms = blurred.terms && !termsOk
  const showMarketing = blurred.marketing && !marketingOk

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="mb-6">
        <p className="text-sm text-gray-500 mb-2">Step 5 of 5</p>
        <h2 className="text-3xl font-bold text-gray-900">How to reach out to you?</h2>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              ref={firstNameRef}
              type="text"
              value={formData.firstName}
              onChange={(e) => onUpdateFormData("firstName", e.target.value)}
              onBlur={() => markBlurred("firstName")}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 ${
                showFirst
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 focus:ring-green-500 focus:border-green-500"
              }`}
              placeholder="Enter your first name"
              autoComplete="given-name"
            />
            {showFirst && <p className="mt-1 text-sm text-red-600">First name is required.</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => onUpdateFormData("lastName", e.target.value)}
              onBlur={() => markBlurred("lastName")}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 ${
                showLast
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 focus:ring-green-500 focus:border-green-500"
              }`}
              placeholder="Enter your last name"
              autoComplete="family-name"
            />
            {showLast && <p className="mt-1 text-sm text-red-600">Last name is required.</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => onUpdateFormData("email", e.target.value)}
              onBlur={() => markBlurred("email")}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 ${
                showEmailRequired || showEmailInvalid
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 focus:ring-green-500 focus:border-green-500"
              }`}
              placeholder="Enter your email"
              autoComplete="email"
            />
            {showEmailInvalid && (
              <p className="mt-1 text-sm text-red-600">Please enter valid email.</p>
            )}
            {showEmailRequired && (
              <p className="mt-1 text-sm text-red-600">Email is required.</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 text-sm">+1</span>
              </div>
              <PhoneInput
                country="US"
                value={formData.phone}
                onChange={(v: string | undefined) => onUpdateFormData("phone", v || "")}
                onBlur={() => markBlurred("phone")}
                placeholder="Enter your phone number"
                className={`w-full pl-8 pr-3 py-2 border rounded-md shadow-sm focus:ring-2 ${
                  showPhoneRequired || showPhoneInvalid
                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300 focus:ring-green-500 focus:border-green-500"
                }`}
              />
            </div>
            {showPhoneInvalid && (
              <p className="mt-1 text-sm text-red-600">Please enter a valid US phone number.</p>
            )}
            {showPhoneRequired && (
              <p className="mt-1 text-sm text-red-600">Phone is required.</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            How did you hear about us? <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.sourceOfLead || ""}
            onChange={(e) => onUpdateFormData("sourceOfLead", e.target.value)}
            onBlur={() => markBlurred("sourceOfLead")}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 bg-white ${
              showSource
                ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                : "border-gray-300 focus:ring-green-500 focus:border-green-500"
            }`}
          >
            {HEAR_ABOUT_US_OPTIONS.map((o) => (
              <option key={o.value || "placeholder"} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          {showSource && <p className="mt-1 text-sm text-red-600">Please select an option.</p>}
        </div>

        <div className="space-y-4 pt-2">
          <div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.termsAccepted}
                onChange={(e) => {
                  markBlurred("terms")
                  onUpdateFormData("termsAccepted", e.target.checked)
                }}
                className="mt-1 h-4 w-4 shrink-0 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <span className="text-sm text-gray-700 leading-relaxed">
                I agree to{" "}
                <a
                  href={TERMS_OF_SERVICE}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href={PRIVACY_POLICY}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Privacy Policy
                </a>
                .<span className="text-red-500">*</span>
              </span>
            </label>
            {showTerms && (
              <p className="mt-1 text-sm text-red-600">
                You must agree to the Terms of Service and Privacy Policy.
              </p>
            )}
          </div>

          <div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.marketingConsent === true}
                onChange={(e) => {
                  markBlurred("marketing")
                  onUpdateFormData("marketingConsent", e.target.checked)
                }}
                className="mt-1 h-4 w-4 shrink-0 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <span className="text-sm text-gray-700 leading-relaxed">
                To ensure you&apos;re getting the best offers and pricing, {COMPANY_NAME} may need to contact you by
                text/call. By checking this box, you agree to these communications, including marketing and promotional
                messages. Message and data rates may apply. You can reply STOP to opt-out of future messaging; reply HELP
                for messaging help. Message frequency may vary.
                <span className="text-red-500">*</span>
              </span>
            </label>
            {showMarketing && (
              <p className="mt-1 text-sm text-red-600">Please check this box to continue.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
