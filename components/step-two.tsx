"use client"

import { useState, useEffect, useRef } from "react"
import { User } from "lucide-react"
import PhoneInput from "react-phone-number-input/input"
import { isValidPhoneNumber } from "react-phone-number-input"
import { isValidEmail } from "@/lib/utils"
import type { StepProps } from "@/types/booking"
import { COMPANY_NAME, PRIVACY_POLICY, TERMS_OF_SERVICE } from "@/configs"

const HEAR_ABOUT_OPTIONS = [
  "Google",
  "Facebook",
  "Angi's List",
  "Reddit",
  "Referral",
]

export default function StepTwo({ formData, onUpdateFormData, onNext, isValid }: StepProps) {
  const firstNameRef = useRef<HTMLInputElement>(null)

  useEffect(() => { firstNameRef.current?.focus() }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && isValid) onNext()
  }

  const isPhoneValid    = formData.phone ? isValidPhoneNumber(formData.phone) : true
  const showPhoneError  = formData.phone && !isPhoneValid
  const isEmailValid_   = formData.email ? isValidEmail(formData.email) : true
  const showEmailError  = formData.email && !isEmailValid_

  const inputClass = (hasError?: boolean | "" | null) =>
    `input-forest ${hasError ? "error" : ""}`

  return (
    <div className="max-w-md mx-auto space-y-5">
      {/* Header */}
      <div className="text-center mb-6">
        <div
          className="mx-auto w-14 h-14 mb-4 rounded-full flex items-center justify-center"
          style={{ background: "var(--brand-forest-light)" }}
        >
          <User className="w-6 h-6" style={{ color: "var(--brand-forest)" }} />
        </div>
        <h2 className="font-heading text-2xl font-semibold" style={{ color: "hsl(220,15%,14%)" }}>
          Your Contact Information
        </h2>
        <p className="text-sm mt-2" style={{ color: "hsl(220,10%,52%)" }}>
          We'll use this to confirm your appointment
        </p>
      </div>

      {/* Name row */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: "hsl(220,12%,30%)" }}>
            First Name <span style={{ color: "var(--brand-terra)" }}>*</span>
          </label>
          <input
            ref={firstNameRef}
            type="text"
            value={formData.firstName}
            onChange={(e) => onUpdateFormData("firstName", e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="First name"
            className={inputClass()}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: "hsl(220,12%,30%)" }}>
            Last Name <span style={{ color: "var(--brand-terra)" }}>*</span>
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => onUpdateFormData("lastName", e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Last name"
            className={inputClass()}
          />
        </div>
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium mb-1.5" style={{ color: "hsl(220,12%,30%)" }}>
          Phone Number <span style={{ color: "var(--brand-terra)" }}>*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <span className="text-sm font-medium" style={{ color: "hsl(220,10%,50%)" }}>+1</span>
          </div>
          <PhoneInput
            country="US"
            value={formData.phone}
            onChange={(v) => onUpdateFormData("phone", v || "")}
            onKeyDown={handleKeyDown}
            placeholder="(555) 000-0000"
            className={`input-forest ${showPhoneError ? "error" : ""}`}
            style={{ paddingLeft: "2.75rem" }}
          />
        </div>
        {showPhoneError && (
          <p className="mt-1.5 text-xs font-medium" style={{ color: "hsl(0,65%,50%)" }}>
            Please enter a valid US phone number
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium mb-1.5" style={{ color: "hsl(220,12%,30%)" }}>
          Email Address <span style={{ color: "var(--brand-terra)" }}>*</span>
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => onUpdateFormData("email", e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="you@example.com"
          className={inputClass(showEmailError)}
        />
        {showEmailError && (
          <p className="mt-1.5 text-xs font-medium" style={{ color: "hsl(0,65%,50%)" }}>
            Please enter a valid email address
          </p>
        )}
      </div>

      {/* How did you hear about us */}
      <div>
        <label className="block text-sm font-medium mb-1.5" style={{ color: "hsl(220,12%,30%)" }}>
          How did you hear about us?
          <span className="font-normal ml-1" style={{ color: "hsl(220,8%,62%)" }}>(optional)</span>
        </label>
        <select
          value={formData.hearAboutUs || ""}
          onChange={(e) => onUpdateFormData("hearAboutUs", e.target.value)}
          className="input-forest appearance-none"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center", paddingRight: "2.5rem" }}
        >
          <option value="">Select an option…</option>
          {HEAR_ABOUT_OPTIONS.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      </div>

      {/* Comments */}
      <div>
        <label className="block text-sm font-medium mb-1.5" style={{ color: "hsl(220,12%,30%)" }}>
          Comments
          <span className="font-normal ml-1" style={{ color: "hsl(220,8%,62%)" }}>(optional)</span>
        </label>
        <textarea
          value={formData.comments || ""}
          onChange={(e) => onUpdateFormData("comments", e.target.value)}
          rows={3}
          placeholder="Any additional comments or questions…"
          onKeyDown={(e) => e.stopPropagation()}
          className="input-forest resize-none"
          style={{ lineHeight: "1.55" }}
        />
      </div>

      {/* Marketing consent */}
      <div
        className="flex items-start gap-3 p-4 rounded-xl"
        style={{
          background: "var(--brand-forest-light)",
          border: "1.5px solid hsl(158, 25%, 84%)",
        }}
      >
        <input
          type="checkbox"
          id="marketing-consent"
          checked={formData.marketingConsent || false}
          onChange={(e) => onUpdateFormData("marketingConsent", e.target.checked)}
          className="mt-0.5 h-4 w-4 cursor-pointer rounded"
          style={{ accentColor: "var(--brand-forest)" }}
        />
        <label
          htmlFor="marketing-consent"
          className="text-sm leading-relaxed cursor-pointer"
          style={{ color: "hsl(158, 20%, 28%)" }}
        >
          By submitting your phone number, you agree to receive marketing text messages from{" "}
          <span className="font-semibold">{COMPANY_NAME}</span>. Message frequency varies. Message and
          data rates may apply. Text HELP for support. Text STOP to opt-out. View our{" "}
          <a
            href={PRIVACY_POLICY}
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-medium"
            style={{ color: "var(--brand-forest)" }}
          >
            Privacy Policy
          </a>{" "}
          and{" "}
          <a
            href={TERMS_OF_SERVICE}
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-medium"
            style={{ color: "var(--brand-forest)" }}
          >
            Terms &amp; Conditions
          </a>
          .{" "}
          <span style={{ color: "var(--brand-terra)" }} className="font-semibold">*</span>
        </label>
      </div>
    </div>
  )
}
