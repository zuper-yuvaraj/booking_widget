"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { isValidEmail, isValidUSPhoneNumber } from "@/lib/utils"
import type { FormData } from "@/types/booking"
import StepOne from "./step-one"
import StepTwo from "./step-two"
import StepThree from "./step-three"
import StepFour from "./step-four"
import BookingConfirmation from "./booking-confirmation"
import { ASSISTED_SCHEDULING_WEBHOOK, COMPANY_UID, timezone } from "@/configs"

const parseInspectionTime = (timeRange: string) => {
  if (!timeRange) return { start: "", end: "" }

  const [start, end] = timeRange.split(" to ")
  if (!start?.trim() || !end?.trim()) return { start: "", end: "" }

  const formatTo24Hour = (time: string) => {
    const parts = time.trim().split(" ")
    const hourStr = parts[0]
    const modifier = parts[1]
    if (!hourStr || !modifier) return ""
    let hour = parseInt(hourStr, 10)
    if (Number.isNaN(hour)) return ""

    if (modifier === "PM" && hour !== 12) hour += 12
    if (modifier === "AM" && hour === 12) hour = 0

    return `${hour.toString().padStart(2, "0")}:00:00`
  }

  return {
    start: formatTo24Hour(start),
    end: formatTo24Hour(end),
  }
}

const ROOF_PITCH_LABELS: Record<string, string> = {
  flat: "Flat",
  low: "Low",
  moderate: "Moderate",
  steep: "Steep",
}

const ROOF_TYPE_LABELS: Record<string, string> = {
  asphalt: "Asphalt",
  metal: "Metal",
  tile: "Tile",
}

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
    preferredInspectionTime: "",
    preferredTimeOptions: [],
    serviceType: "lead_qualification",
    roofPitch: "",
    roofType: "",
    termsAccepted: false,
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
    marketingConsent: false,
    sourceOfLead: "",
    referralName: "",
    additionalComments: "",
  })

  const finalCompanyUid = COMPANY_UID

  const handleUpdateFormData = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value }
      if (field === "preferredInspectionTime" && typeof value === "string") {
        const { start, end } = parseInspectionTime(value)
        updated.start_time = start
        updated.end_time = end
      }
      return updated
    })
  }

  const isStep1Valid = () => !!formData.address

  const isStep2Valid = () => !!formData.roofPitch

  const isStep3Valid = () => !!formData.roofType

  const isStep4Valid = () => {
    const firstOk = !!formData.firstName?.trim()
    const lastOk = !!formData.lastName?.trim()
    const phoneOk = !!(formData.phone && isValidUSPhoneNumber(formData.phone))
    const emailOk = !!(formData.email && isValidEmail(formData.email))
    const sourceOk = !!formData.sourceOfLead?.trim()
    const termsOk = formData.termsAccepted === true
    const marketingOk = formData.marketingConsent === true
    return firstOk && lastOk && phoneOk && emailOk && sourceOk && termsOk && marketingOk
  }

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep((s) => s + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1)
    }
  }

  const handleSubmit = async () => {
    if (!isStep4Valid()) return

    setSubmitError(null)
    setIsSubmitting(true)

    try {
      const payloadData = {
        company_uid: finalCompanyUid,
        timezone: timezone,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phone: formData.phone,
        email: formData.email,
        serviceType: formData.serviceType,
        address: formData.address,
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zipcode: formData.zipcode,
        latitude: formData.latitude,
        longitude: formData.longitude,
        selectedDate: formData.selectedDate,
        selectedSlot: formData.selectedSlot,
        start_time: formData.start_time,
        end_time: formData.end_time,
        selectedUser: formData.selectedUser,
        marketingConsent: formData.marketingConsent ?? false,
        custom_fields: {
          "How did you hear about us?": formData.sourceOfLead || "",
          "How steep is your roof?":
            ROOF_PITCH_LABELS[formData.roofPitch] || formData.roofPitch || "",
          "What type of roof would you like?":
            ROOF_TYPE_LABELS[formData.roofType] || formData.roofType || "",
        },
      }

      const response = await fetch(`${ASSISTED_SCHEDULING_WEBHOOK}?company_uid=${finalCompanyUid}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payloadData),
      })

      if (!response.ok) {
        const message = `Request failed (${response.status}). Please try again.`
        console.error("Failed to submit booking:", response.status, response.statusText)
        setSubmitError(message)
        return
      }

      setIsBookingConfirmed(true)
      console.log("Booking submitted successfully")
    } catch (error) {
      console.error("Error submitting booking:", error)
      setSubmitError("Something went wrong. Please check your connection and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderCurrentStep = () => {
    const stepProps = {
      formData,
      onUpdateFormData: handleUpdateFormData,
      onNext: nextStep,
      onPrev: prevStep,
      isValid: false,
      isTouched: false,
    }

    switch (currentStep) {
      case 1:
        return <StepOne {...stepProps} isValid={isStep1Valid()} />
      case 2:
        return <StepTwo {...stepProps} isValid={isStep2Valid()} />
      case 3:
        return <StepThree {...stepProps} isValid={isStep3Valid()} />
      case 4:
        return <StepFour {...stepProps} isValid={isStep4Valid()} />
      default:
        return <StepOne {...stepProps} isValid={isStep1Valid()} />
    }
  }

  const continueDisabled =
    (currentStep === 1 && !isStep1Valid()) ||
    (currentStep === 2 && !isStep2Valid()) ||
    (currentStep === 3 && !isStep3Valid())

  return (
    <div className="max-w-4xl mx-auto bg-white min-h-screen">
      {!isBookingConfirmed ? (
        <>
          <div className="bg-white border-b border-gray-200 px-6 py-4 hidden">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-gray-900">Book your free inspection</h1>
              <div className="text-sm text-gray-500">Step {currentStep} of 4</div>
            </div>

            <div className="mt-4 hidden">
              <div className="flex items-center">
                {[1, 2, 3, 4].map((step) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                        step <= currentStep ? "bg-green-500 text-white" : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {step}
                    </div>
                    {step < 4 && (
                      <div className={`flex-1 h-1 mx-2 ${step < currentStep ? "bg-green-500" : "bg-gray-200"}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="px-6 py-8">
            {submitError && currentStep === 4 && (
              <div
                className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
                role="alert"
              >
                {submitError}
              </div>
            )}
            {renderCurrentStep()}
          </div>

          <div className="border-t border-gray-200 px-6 py-4">
            <div className="flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                  currentStep === 1 ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </button>

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={continueDisabled}
                  className={`flex items-center px-6 py-2 rounded-md transition-colors ${
                    continueDisabled
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-primary text-white hover:bg-primary/80"
                  }`}
                >
                  Continue
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !isStep4Valid()}
                  className={`px-6 py-2 rounded-md transition-colors ${
                    isSubmitting || !isStep4Valid()
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-primary text-white hover:bg-primary/80"
                  }`}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              )}
            </div>
          </div>
        </>
      ) : (
        <BookingConfirmation formData={formData} />
      )}
    </div>
  )
}
