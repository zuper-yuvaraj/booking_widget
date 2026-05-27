"use client"

import { useEffect, useRef } from "react"
import PhoneInput from "react-phone-number-input"
import { isValidPhoneNumber } from "react-phone-number-input"
import "react-phone-number-input/style.css"
import { isValidEmail } from "@/lib/utils"
import type { FormData, StepProps } from "@/types/booking"
import { COMPANY_NAME, PRIVACY_POLICY, TERMS_OF_SERVICE } from "@/configs"
import AddressMapSection from "./address-map-section"

const inputClass =
  "w-full px-3 py-2.5 rounded-lg bg-[#3d5c4d] border border-[#4a6b5a] text-[#fbfbe1] placeholder:text-[#fbfbe1]/50 focus:outline-none focus:ring-2 focus:ring-[#fbfbe1]/30 font-body text-sm"

const labelClass = "block text-sm font-body text-[#fbfbe1] mb-1.5"

const selectClass = `${inputClass} cursor-pointer appearance-none`

const SERVICE_OPTIONS = [
  "Roof Replacement",
  "Roof Repair",
  "Solar Installation",
  "Gutter Installation",
  "Roof Maintenance Program",
  "Not Sure / Need Help Deciding",
] as const

const HEARD_ABOUT_OPTIONS = [
  "Online Search",
  "Online Ads",
  "Social Media",
  "Referral – Friend or Family",
  "Referral – Contractor or Realtor",
  "Saw a Truck or Yard Sign",
  "Direct Mail / Postcard",
  "Billboard",
  "TV / Streaming",
  "Repeat Customer",
  "Local Event",
  "Radio",
  "YouTube",
  "Other",
] as const

export default function StepOne({
  formData,
  onUpdateFormData,
  onNext,
  isValid,
  isSubmitting,
}: StepProps) {
  const firstNameInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    firstNameInputRef.current?.focus()
  }, [])

  const isPhoneValid = formData.phone
    ? isValidPhoneNumber(formData.phone)
    : true

  const showPhoneError = formData.phone && !isPhoneValid

  const isEmailValid = formData.email ? isValidEmail(formData.email) : true

  const showEmailError = formData.email && !isEmailValid

  const canProceed =
    isValid &&
    formData.marketingConsent === true &&
    isPhoneValid &&
    isEmailValid

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && canProceed && !isSubmitting) {
      onNext()
    }
  }

  const handlePhoneChange = (value: string | undefined) => {
    onUpdateFormData("phone", value || "")
  }

  const handleAddressUpdate = (field: keyof FormData, value: string) => {
    onUpdateFormData(field, value)
  }

  return (
    <div className="mx-auto w-full max-w-[540px]">
      <div className="rounded-2xl bg-[#294437] px-6 py-8 md:px-8 text-[#fbfbe1]">
        <p className="text-center font-body text-[15px] leading-relaxed mb-8 text-[#fbfbe1]">
          Ready to get started? Share a few details and our team will be in
          touch to book your free consultation!
        </p>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>First Name*</label>
              <input
                ref={firstNameInputRef}
                type="text"
                value={formData.firstName}
                onChange={(e) =>
                  onUpdateFormData("firstName", e.target.value)
                }
                onKeyDown={handleKeyPress}
                placeholder="First name"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Last Name*</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) =>
                  onUpdateFormData("lastName", e.target.value)
                }
                onKeyDown={handleKeyPress}
                placeholder="Last name"
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Mobile Phone Number*</label>
              <PhoneInput
                international
                defaultCountry="US"
                value={formData.phone}
                onChange={handlePhoneChange}
                onKeyDown={handleKeyPress}
                placeholder="Phone number"
                className={`ironhead-phone-input ${
                  showPhoneError ? "ironhead-phone-input--error" : ""
                }`}
              />
              {showPhoneError && (
                <p className="mt-1 text-sm text-red-300 font-body">
                  Please enter a valid phone number
                </p>
              )}
            </div>

            <div>
              <label className={labelClass}>Email*</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => onUpdateFormData("email", e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Email address"
                className={`${inputClass} ${
                  showEmailError ? "border-red-400 focus:ring-red-400/30" : ""
                }`}
              />
              {showEmailError && (
                <p className="mt-1 text-sm text-red-300 font-body">
                  Please enter a valid email address
                </p>
              )}
            </div>
          </div>

          <div>
          <label className={labelClass}>Street Address*</label>
            <AddressMapSection
              address={formData.address}
              street={formData.street}
              city={formData.city}
              state={formData.state}
              zipcode={formData.zipcode}
              latitude={formData.latitude}
              longitude={formData.longitude}
              onUpdateFormData={handleAddressUpdate}
            />
          </div>

          <div>
            <label className={labelClass}>
              What type of service are you interested in?
            </label>
            <select
              value={formData.serviceInterestedIn || ""}
              onChange={(e) =>
                onUpdateFormData("serviceInterestedIn", e.target.value)
              }
              className={`${selectClass} ironhead-select`}
            >
              <option value="" disabled>
                Select a service
              </option>
              {SERVICE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>How did you hear about us?</label>
            <select
              value={formData.heardAboutUs || ""}
              onChange={(e) =>
                onUpdateFormData("heardAboutUs", e.target.value)
              }
              className={`${selectClass} ironhead-select`}
            >
              <option value="" disabled>
                Select an option
              </option>
              {HEARD_ABOUT_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Questions or Comments</label>
            <textarea
              value={formData.questionsOrComments || ""}
              onChange={(e) =>
                onUpdateFormData("questionsOrComments", e.target.value)
              }
              placeholder="Share any questions or comments"
              rows={4}
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>City*</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => onUpdateFormData("city", e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="City"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Postal Code*</label>
              <input
                type="text"
                value={formData.zipcode}
                onChange={(e) => onUpdateFormData("zipcode", e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Postal code"
                className={inputClass}
              />
            </div>
          </div> */}

          <div className="mt-6">
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="marketing-consent"
                checked={formData.marketingConsent || false}
                onChange={(e) =>
                  onUpdateFormData("marketingConsent", e.target.checked)
                }
                className="mt-1 h-4 w-4 rounded border-[#4a6b5a] bg-[#3d5c4d] text-[#fbfbe1] focus:ring-[#fbfbe1]/30"
                required
              />

              <label
                htmlFor="marketing-consent"
                className="text-sm font-body text-[#fbfbe1] leading-relaxed"
              >
                By submitting your phone number, you agree to receive marketing
                text messages from {COMPANY_NAME || "IronHead Roofing"}. Message
                frequency varies. Message and data rates may apply. Text HELP
                for Support. Text STOP to opt-out. View our{" "}
                <a
                  href={TERMS_OF_SERVICE}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#f4ae3d] hover:text-[#f4ae3d]/80"
                >
                  Terms &amp; Conditions
                </a>{" "}
                and{" "}
                <a
                  href={PRIVACY_POLICY}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#f4ae3d] hover:text-[#f4ae3d]/80"
                >
                  Privacy Policy
                </a>
                .
              </label>
            </div>
          </div>

          <button
            type="button"
            onClick={onNext}
            disabled={!canProceed || isSubmitting}
            className={`w-full mt-4 py-3 rounded-lg font-body font-bold transition-colors ${
              !canProceed || isSubmitting
                ? "bg-[#f4ae3d]/40 text-black/50 cursor-not-allowed"
                : "bg-[#f4ae3d] text-black hover:bg-[#e09d35]"
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  )
}
