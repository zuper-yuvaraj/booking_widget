"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Check, Shield, Home } from "lucide-react"
import { isValidPhoneNumber } from "react-phone-number-input"
import { isValidEmail } from "@/lib/utils"
import type { FormData } from "@/types/booking"
import StepOne from "./step-one"
import StepTwo from "./step-two"
import StepThree from "./step-three"
import StepFour from "./step-four"
import BookingConfirmation from "./booking-confirmation"
import { COMPANY_NAME, CREATE_BOOKING_WEBHOOK } from "@/configs"
import { useQueryParams } from "@/hooks/query-params.hooks"

const STEPS = [
  { label: "Location" },
  { label: "Details"  },
  { label: "Service"  },
  { label: "Schedule" },
]

export default function BookingWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    serviceType: "",
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
  })

  const searchParams = useQueryParams()
  const COMPANY_UID = searchParams.get("company_uid") || ""

  const handleUpdateFormData = (field: keyof FormData, value: string | boolean | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const isStep1Valid = () => !!formData.address
  const isStep2Valid = () => {
    const hasRequired = !!(formData.firstName && formData.lastName && formData.phone && formData.email)
    const phoneOk = formData.phone ? isValidPhoneNumber(formData.phone) : false
    const emailOk = formData.email ? isValidEmail(formData.email) : false
    return hasRequired && phoneOk && emailOk && !!formData.marketingConsent
  }
  const isStep3Valid = () => !!formData.serviceType
  const isStep4Valid = () => !!(formData.selectedDate && formData.selectedSlot && formData.selectedUser)

  const getCurrentStepValid = () => {
    switch (currentStep) {
      case 1: return isStep1Valid()
      case 2: return isStep2Valid()
      case 3: return isStep3Valid()
      case 4: return isStep4Valid()
      default: return false
    }
  }

  const nextStep = () => { if (currentStep < 4) setCurrentStep(currentStep + 1) }
  const prevStep = () => { if (currentStep > 1) setCurrentStep(currentStep - 1) }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setSubmitError(null)
    try {
      const response = await fetch(`${CREATE_BOOKING_WEBHOOK}?company_uid=${COMPANY_UID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        setSubmitError(errorData?.message || "Failed to submit booking. Please try again.")
      } else {
        setIsBookingConfirmed(true)
      }
    } catch {
      setSubmitError("A network error occurred. Please check your connection and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const isCurrentStepValid = getCurrentStepValid()
  const stepProps = {
    formData,
    onUpdateFormData: handleUpdateFormData,
    onNext: nextStep,
    onPrev: prevStep,
    isValid: isCurrentStepValid,
  }

  return (
    <div
      className="max-w-2xl mx-auto min-h-screen sm:min-h-0 sm:rounded-2xl overflow-hidden"
      style={{
        boxShadow: "0 8px 48px rgba(46, 96, 78, 0.13), 0 2px 12px rgba(46, 96, 78, 0.08)",
        backgroundColor: "var(--brand-cream)",
      }}
    >
      {!isBookingConfirmed ? (
        <>
          {/* ── Header ─────────────────────────────────── */}
          <div
            className="relative overflow-hidden px-6 pt-6 pb-0"
            style={{
              background: "linear-gradient(145deg, hsl(158, 38%, 24%) 0%, hsl(158, 32%, 30%) 100%)",
            }}
          >
            {/* Faint roofing accent — large home icon watermark */}
            <div className="absolute right-[-16px] top-[-12px] opacity-[0.06] pointer-events-none select-none">
              <Home className="w-40 h-40 text-white" strokeWidth={0.8} />
            </div>

            {/* Brand row */}
            <div className="relative flex items-start justify-between mb-5">
              <div>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Shield className="w-3.5 h-3.5" style={{ color: "var(--brand-terra)" }} />
                  <span
                    className="text-xs font-semibold uppercase tracking-widest"
                    style={{ color: "var(--brand-terra)" }}
                  >
                    Licensed &amp; Insured
                  </span>
                </div>
                <h1
                  className="font-heading text-2xl font-semibold text-white leading-tight"
                >
                  {COMPANY_NAME}
                </h1>
              </div>
              <div className="text-right hidden sm:block mt-0.5">
                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                  style={{
                    background: "rgba(255,255,255,0.12)",
                    color: "rgba(255,255,255,0.90)",
                    border: "1px solid rgba(255,255,255,0.18)",
                  }}
                >
                  <Check className="w-3 h-3" />
                  Free Inspection
                </div>
                <p className="text-white/45 text-xs mt-1">No obligation, no commitment</p>
              </div>
            </div>

            {/* ── Step progress ───────────────────────── */}
            <div className="relative flex items-center pb-6">
              {STEPS.map(({ label }, index) => {
                const stepNum   = index + 1
                const isCompleted = currentStep > stepNum
                const isActive    = currentStep === stepNum

                return (
                  <div key={label} className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center gap-1.5">
                      <div
                        className="relative w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300"
                        style={
                          isCompleted
                            ? { background: "rgba(255,255,255,0.22)", color: "white" }
                            : isActive
                            ? { background: "var(--brand-terra)", color: "white", boxShadow: "0 0 0 4px rgba(217,103,58,0.25)" }
                            : { background: "rgba(255,255,255,0.10)", color: "rgba(255,255,255,0.38)", border: "1.5px solid rgba(255,255,255,0.15)" }
                        }
                      >
                        {isCompleted ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : (
                          <span className="text-xs">{stepNum}</span>
                        )}
                      </div>
                      <span
                        className="text-xs font-medium hidden sm:block transition-colors duration-300"
                        style={{
                          color: isActive
                            ? "rgba(255,255,255,0.95)"
                            : isCompleted
                            ? "rgba(255,255,255,0.65)"
                            : "rgba(255,255,255,0.30)",
                        }}
                      >
                        {label}
                      </span>
                    </div>

                    {index < STEPS.length - 1 && (
                      <div
                        className="flex-1 h-px mx-2 mb-4 sm:mb-5 transition-all duration-500"
                        style={{
                          background: stepNum < currentStep
                            ? "rgba(255,255,255,0.45)"
                            : "rgba(255,255,255,0.13)",
                        }}
                      />
                    )}
                  </div>
                )
              })}
            </div>

            {/* Step label strip */}
            <div
              className="relative -mx-6 px-6 py-2.5 flex items-center justify-between"
              style={{ background: "rgba(0,0,0,0.12)", borderTop: "1px solid rgba(255,255,255,0.08)" }}
            >
              <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>
                Step {currentStep} of {STEPS.length}
              </span>
              <span className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.75)" }}>
                {STEPS[currentStep - 1].label}
              </span>
            </div>
          </div>

          {/* ── Step content ───────────────────────────── */}
          <div
            key={currentStep}
            className="px-6 py-8 animate-fade-slide-up"
            style={{ backgroundColor: "var(--brand-cream)" }}
          >
            {currentStep === 1 && <StepOne {...stepProps} />}
            {currentStep === 2 && <StepTwo {...stepProps} />}
            {currentStep === 3 && <StepThree {...stepProps} />}
            {currentStep === 4 && <StepFour {...stepProps} />}
          </div>

          {/* ── Submit error ────────────────────────────── */}
          {submitError && (
            <div className="mx-6 mb-4 px-4 py-3 rounded-xl text-sm font-medium"
              style={{
                background: "hsl(0, 60%, 97%)",
                border: "1.5px solid hsl(0, 60%, 85%)",
                color: "hsl(0, 65%, 42%)",
              }}
            >
              {submitError}
            </div>
          )}

          {/* ── Navigation footer ──────────────────────── */}
          <div
            className="px-6 py-4 flex justify-between items-center"
            style={{
              borderTop: "1px solid hsl(40, 20%, 88%)",
              backgroundColor: "var(--brand-cream-warm, hsl(42, 25%, 94%))",
            }}
          >
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="btn-ghost-forest flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>

            {currentStep < 4 ? (
              <button
                onClick={nextStep}
                disabled={!isCurrentStepValid}
                className="btn-terra flex items-center gap-1.5 px-7 py-2.5 rounded-full text-sm"
              >
                Continue
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!isStep4Valid() || isSubmitting}
                className="btn-terra flex items-center gap-2 px-7 py-2.5 rounded-full text-sm"
              >
                {isSubmitting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Submitting…
                  </>
                ) : (
                  <>
                    Confirm Booking
                    <Check className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </>
      ) : (
        <BookingConfirmation formData={formData} />
      )}
    </div>
  )
}
