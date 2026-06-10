"use client"

import { User } from "lucide-react"
import { useEffect, useRef } from "react"
import PhoneInput from "react-phone-number-input/input"
import { isValidPhoneNumber } from "react-phone-number-input"
import { isValidEmail } from "@/lib/utils"
import type { StepProps } from "@/types/booking"
import { COMPANY_NAME, PRIVACY_POLICY, TERMS_OF_SERVICE } from "@/configs"

const HEAR_ABOUT_OPTIONS = [
  "Google",
  "Facebook",
  "Angie's List",
  "Referral",
  "Reddit",
]

export default function StepTwo({ formData, onUpdateFormData, onNext, isValid }: StepProps) {
  const firstNameInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    firstNameInputRef.current?.focus()
  }, [])

  const isPhoneValid = formData.phone ? isValidPhoneNumber(formData.phone) : true
  const showPhoneError = formData.phone && !isPhoneValid

  const isEmailValid = formData.email ? isValidEmail(formData.email) : true
  const showEmailError = formData.email && !isEmailValid

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && isValid) onNext()
  }

  const handlePhoneChange = (value: string | undefined) => {
    onUpdateFormData("phone", value || "")
  }

  const inputClass = (hasError?: string | boolean) =>
    `w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 text-sm transition-colors placeholder-slate-400 ${
      hasError
        ? "border-red-300 focus:border-red-400 focus:ring-red-100"
        : "border-slate-200 focus:border-orange focus:ring-orange/20"
    }`

  const labelClass = "block text-xs font-semibold text-navy mb-1.5 uppercase tracking-wide"

  /* ---------------- UI ---------------- */

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 pt-6">

      {/* STEP INDICATOR */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <div className="w-2 h-2 rounded-full bg-orange/40" />
        <div className="w-2 h-2 rounded-full bg-orange" />
        <div className="w-2 h-2 rounded-full bg-slate-200" />
        <span className="text-xs text-slate-500 ml-1">Step 2 of 3</span>
      </div>

      {/* HEADER */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-navy rounded-full mb-4">
          <User className="w-7 h-7 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-navy">Tell Us About Yourself</h2>
        <p className="text-slate-500 text-sm mt-2">
          We&apos;ll use this to confirm your inspection booking
        </p>
      </div>

      <div className="space-y-5">

        {/* NAME ROW */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>
              First Name <span className="text-orange normal-case tracking-normal">*</span>
            </label>
            <input
              ref={firstNameInputRef}
              type="text"
              value={formData.firstName}
              onChange={(e) => onUpdateFormData("firstName", e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="First name"
              className={inputClass()}
            />
          </div>
          <div>
            <label className={labelClass}>
              Last Name <span className="text-orange normal-case tracking-normal">*</span>
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => onUpdateFormData("lastName", e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Last name"
              className={inputClass()}
            />
          </div>
        </div>

        {/* PHONE */}
        <div>
          <label className={labelClass}>
            Phone Number <span className="text-orange normal-case tracking-normal">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-slate-400 text-sm">+1</span>
            </div>
            <PhoneInput
              country="US"
              value={formData.phone}
              onChange={handlePhoneChange}
              onKeyDown={handleKeyPress}
              placeholder="(555) 000-0000"
              className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 text-sm transition-colors placeholder-slate-400 ${
                showPhoneError
                  ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                  : "border-slate-200 focus:border-orange focus:ring-orange/20"
              }`}
            />
          </div>
          {showPhoneError && (
            <p className="mt-1.5 text-xs text-red-600">Please enter a valid US phone number</p>
          )}
        </div>

        {/* EMAIL */}
        <div>
          <label className={labelClass}>
            Email Address <span className="text-orange normal-case tracking-normal">*</span>
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => onUpdateFormData("email", e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="you@example.com"
            className={inputClass(showEmailError)}
          />
          {showEmailError && (
            <p className="mt-1.5 text-xs text-red-600">Please enter a valid email address</p>
          )}
        </div>

        {/* HOW DID YOU HEAR */}
        <div>
          <label className={labelClass}>
            How did you hear about us?{" "}
            <span className="text-slate-400 normal-case tracking-normal font-normal">(optional)</span>
          </label>
          <select
            value={formData.hearAboutUs || ""}
            onChange={(e) => onUpdateFormData("hearAboutUs", e.target.value)}
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:border-orange focus:ring-orange/20 text-sm transition-colors bg-white text-slate-700"
          >
            <option value="">Select an option…</option>
            {HEAR_ABOUT_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        {/* COMMENTS */}
        <div>
          <label className={labelClass}>
            Comments{" "}
            <span className="text-slate-400 normal-case tracking-normal font-normal">(optional)</span>
          </label>
          <textarea
            value={formData.comments || ""}
            onChange={(e) => onUpdateFormData("comments", e.target.value)}
            placeholder="Any additional details about your roof or project..."
            rows={3}
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:border-orange focus:ring-orange/20 text-sm transition-colors placeholder-slate-400 resize-none"
          />
        </div>

        {/* MARKETING CONSENT */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="marketing-consent"
              checked={formData.marketingConsent || false}
              onChange={(e) => onUpdateFormData("marketingConsent", e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-orange cursor-pointer flex-shrink-0"
              required
            />
            <label htmlFor="marketing-consent" className="text-xs text-slate-600 leading-relaxed cursor-pointer">
              By submitting your phone number, you agree to receive marketing text messages from{" "}
              <strong className="text-navy">{COMPANY_NAME}</strong>. Message frequency varies. Message and data rates may apply. Text HELP for support. Text STOP to opt-out. View our{" "}
              <a href={TERMS_OF_SERVICE} target="_blank" rel="noopener noreferrer" className="text-orange hover:text-orange-dark underline">
                Terms &amp; Conditions
              </a>{" "}
              and{" "}
              <a href={PRIVACY_POLICY} target="_blank" rel="noopener noreferrer" className="text-orange hover:text-orange-dark underline">
                Privacy Policy
              </a>.
            </label>
          </div>
        </div>

      </div>

      <div className="pb-4" />
    </div>
  )
}
