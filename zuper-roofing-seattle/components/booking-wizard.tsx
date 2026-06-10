"use client"

import { useState } from "react"
import { isValidPhoneNumber } from "react-phone-number-input"
import { isValidEmail } from "@/lib/utils"
import type { FormData } from "@/types/booking"
import StepOne from "./step-one"
import StepTwo from "./step-two"
import StepThree from "./step-three"
import StepFour from "./step-four"
import BookingConfirmation from "./booking-confirmation"
import { CREATE_BOOKING_WEBHOOK } from "@/configs"
import { sendConfirmationEmail } from "@/lib/send-confirmation-email"
import { useQueryParams } from "@/hooks/query-params.hooks"
import { useServiceAreaCheck } from "@/hooks/use-service-area-check"

export default function BookingWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  /* ---------------- FORM STATE ---------------- */

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    serviceType: "lead_qualification",
    address: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    latitude: "",
    longitude: "",
    selectedDate: "",
    selectedSlot: "",
    selectedUser: "",
    start_time: "",
    end_time: "",
    preferredDate: "",
    hearAboutUs: "",
    comments: "",
    services: [],
    marketingConsent: false,
  })

  const { status: serviceAreaStatus, territoryName, checkServiceArea } = useServiceAreaCheck()

  const searchParams = useQueryParams()
  const COMPANY_UID = searchParams.get("company_uid") || ""

  const handleUpdateFormData = (
    field: keyof FormData,
    value: string | boolean | string[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  /* ---------------- VALIDATIONS ---------------- */

  const isStep1Valid = () =>
    !!formData.address &&
    serviceAreaStatus !== "not_serviced" &&
    serviceAreaStatus !== "checking"

  const isStep2Valid = () => {
    const required = !!(
      formData.firstName &&
      formData.lastName &&
      formData.phone &&
      formData.email
    )
    const phoneValid = formData.phone ? isValidPhoneNumber(formData.phone) : false
    const emailValid = formData.email ? isValidEmail(formData.email) : false
    const consentGiven = formData.marketingConsent === true
    return required && phoneValid && emailValid && consentGiven
  }

  const isStep3Valid = () => (formData.services?.length ?? 0) > 0

  const isStep4Valid = () => !!formData.selectedDate && !!formData.selectedSlot

  /* ---------------- NAVIGATION ---------------- */

  const nextStep = () => setCurrentStep((s) => Math.min(s + 1, 4))
  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 1))

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Strip country code from E.164 phone (+12055551234 → 2055551234)
    const rawPhone = formData.phone.replace(/^\+1/, "").replace(/\D/g, "")
    const payload = {
      address: formData.address,
      street: formData.street,
      city: formData.city,
      state: formData.state,
      zipcode: formData.zipcode,
      latitude: formData.latitude,
      longitude: formData.longitude,
      territory: territoryName,
      teamUids: [],
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: rawPhone,
      email: formData.email,
      hearAboutUs: formData.hearAboutUs ?? "",
      comments: formData.comments ?? "",
      marketingConsent: formData.marketingConsent ?? false,
      selectedServices: formData.services ?? [],
      serviceType: "inspection",
      selectedDate: formData.selectedDate,
      selectedSlot: formData.selectedSlot,
      start_time: formData.start_time,
      end_time: formData.end_time,
      selectedUser: formData.selectedUser,
    }
    try {
      const response = await fetch(CREATE_BOOKING_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!response.ok) {
        console.error("Failed to submit booking:", response.status, response.statusText)
      }
      // Send confirmation email regardless of webhook status
      await sendConfirmationEmail({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: rawPhone,
        address: formData.address,
        selectedDate: formData.selectedDate,
        selectedSlot: formData.selectedSlot,
        services: formData.services ?? [],
      }).catch((err) => console.error("Confirmation email failed:", err))
    } catch (error) {
      console.error("Error submitting booking:", error)
    } finally {
      setIsSubmitting(false)
      setIsBookingConfirmed(true)
    }
  }

  const handleContinue = () => {
    if (currentStep < 4) nextStep()
    else handleSubmit()
  }

  /* ---------------- UI HELPERS ---------------- */

  const isCurrentStepValid = () => {
    if (currentStep === 1) return isStep1Valid()
    if (currentStep === 2) return isStep2Valid()
    if (currentStep === 3) return isStep3Valid()
    return isStep4Valid()
  }

  const isContinueDisabled =
    isSubmitting ||
    serviceAreaStatus === "checking" ||
    !isCurrentStepValid()

  const continueLabel = () => {
    if (isSubmitting) return "Submitting..."
    if (serviceAreaStatus === "checking") return "Verifying address..."
    if (currentStep === 4) return "Confirm Booking"
    return "Continue"
  }

  const stepProps = {
    formData,
    onUpdateFormData: handleUpdateFormData,
    onNext: nextStep,
    onPrev: prevStep,
    isValid: isCurrentStepValid(),
  }

  /* ---------------- UI ---------------- */

  if (isBookingConfirmed) {
    return <BookingConfirmation formData={formData} />
  }

  return (
    <div className="max-w-4xl mx-auto bg-white min-h-screen shadow-sm">

      {/* NAV HEADER */}
      <div className="bg-navy px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-orange flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
          </div>
          <span className="text-white font-semibold text-sm">Zuper Roofing Seattle</span>
        </div>

        {/* STEP PROGRESS DOTS */}
        <div className="flex items-center gap-3">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`h-2 rounded-full transition-all duration-300 ${
                step === currentStep
                  ? "w-6 bg-orange"
                  : step < currentStep
                  ? "w-2 bg-orange/60"
                  : "w-2 bg-white/30"
              }`}
            />
          ))}
          <span className="text-orange text-sm font-medium ml-1">
            {currentStep} / 4
          </span>
        </div>
      </div>

      {/* STEP CONTENT */}
      <div className="pb-6">
        {currentStep === 1 && (
          <StepOne
            {...stepProps}
            isValid={isStep1Valid()}
            serviceAreaStatus={serviceAreaStatus}
            onCheckServiceArea={checkServiceArea}
          />
        )}
        {currentStep === 2 && (
          <StepTwo {...stepProps} isValid={isStep2Valid()} />
        )}
        {currentStep === 3 && (
          <StepThree {...stepProps} isValid={isStep3Valid()} />
        )}
        {currentStep === 4 && (
          <StepFour {...stepProps} isValid={isStep4Valid()} />
        )}
      </div>

      {/* NAVIGATION FOOTER */}
      <div className="border-t border-slate-100 px-6 py-4 bg-white sticky bottom-0">
        <div className="flex justify-between items-center">

          <button
            onClick={prevStep}
            disabled={currentStep === 1 || isSubmitting}
            className={`flex items-center gap-1 px-4 py-2 rounded-lg border transition-colors text-sm font-medium ${
              currentStep === 1
                ? "border-slate-200 text-slate-300 cursor-not-allowed"
                : "border-navy/30 text-navy hover:bg-navy/5"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          <button
            onClick={handleContinue}
            disabled={isContinueDisabled}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm ${
              isContinueDisabled
                ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                : "bg-orange hover:bg-orange-dark text-white"
            }`}
          >
            {(isSubmitting || serviceAreaStatus === "checking") && (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            {continueLabel()}
            {!isSubmitting && serviceAreaStatus !== "checking" && (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
          </button>

        </div>
      </div>
    </div>
  )
}
