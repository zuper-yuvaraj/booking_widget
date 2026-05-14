"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { isValidPhoneNumber } from "react-phone-number-input"
import { isValidEmail } from "@/lib/utils"
import type { FormData } from "@/types/booking"
import StepOne from "./step-one"
import StepTwo from "./step-two"
import BookingConfirmation from "./booking-confirmation"
import { ASSISTED_SCHEDULING_WEBHOOK, COMPANY_UID, timezone } from "@/configs"

// Fix 1: Moved parseInspectionTime out of the component so it's defined before use
const parseInspectionTime = (timeRange: string) => {
  if (!timeRange) return { start: "", end: "" }

  const [start, end] = timeRange.split(" to ")

  const formatTo24Hour = (time: string) => {
    const [hourStr, modifier] = time.trim().split(" ")
    let hour = parseInt(hourStr, 10)

    if (modifier === "PM" && hour !== 12) hour += 12
    if (modifier === "AM" && hour === 12) hour = 0

    return `${hour.toString().padStart(2, "0")}:00:00`
  }

  return {
    start: formatTo24Hour(start),
    end: formatTo24Hour(end),
  }
}

export default function BookingWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [step2Touched, setStep2Touched] = useState(false)

  // Fix 2: formData defined before any usage; added missing preferredTimeOptions field
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    preferredInspectionTime: "",
    preferredTimeOptions: [],        // Fix 3: was missing from initial state
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
    claimType: undefined,
    filedClaim: undefined,
    insuranceCompany: "",
    referralName: "",
    sourceOfLead: "",
    additionalComments: "",
    marketingConsent: false,
  })

  const finalCompanyUid = COMPANY_UID

  const handleUpdateFormData = (field: keyof FormData, value: string | boolean | string[]) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value }
      // Whenever preferredInspectionTime changes, parse and sync start_time / end_time
      if (field === "preferredInspectionTime" && typeof value === "string") {
        const { start, end } = parseInspectionTime(value)
        updated.start_time = start
        updated.end_time = end
      }
      return updated
    })
  }

  const isStep1Valid = () => {
    return !!formData.address
  }

  const isStep2Valid = () => {
    const hasRequiredFields = !!(
      formData.firstName?.trim() &&
      formData.lastName?.trim() &&
      formData.phone &&
      formData.email &&
      formData.preferredInspectionTime &&
      (formData.preferredTimeOptions || []).length > 0 &&  // Fix 4: validate checkbox selection
      formData.claimType &&
      formData.filedClaim &&
      formData.insuranceCompany &&
      formData.sourceOfLead && formData.marketingConsent !== undefined
      // Fix 5: additionalComments removed — it's optional, not required
    )

    const isPhoneValid = formData.phone ? isValidPhoneNumber(formData.phone) : false
    const isEmailValid = formData.email ? isValidEmail(formData.email) : false

    const isConsentGiven = formData.marketingConsent === true

    return hasRequiredFields && isPhoneValid && isEmailValid && isConsentGiven
  }

  const nextStep = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setStep2Touched(true)
    if (!isStep2Valid()) return

    setIsSubmitting(true)

    try {
      const payloadData = {
        company_uid: finalCompanyUid,
        timezone: timezone,
        firstName: formData.firstName,
        lastName: formData.lastName,
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
        marketingConsent: formData.marketingConsent,
        custom_fields: {
          PreferredInspection: formData.preferredInspectionTime,
          "Preferred Inspection Time": formData.preferredTimeOptions,
          "Insurance Claim or Retail?": formData.claimType,
          "Have you already filed a claim?": formData.filedClaim,
          "Insurance Company": formData.insuranceCompany,
          "If Referral, Referred by Name": formData.referralName,
          "How did you hear about us? - Source of Lead": formData.sourceOfLead,
          "Additional Comments": formData.additionalComments,
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
        console.error("Failed to submit booking:", response.status, response.statusText)
      } else {
        console.log("Booking submitted successfully")
      }
    } catch (error) {
      console.error("Error submitting booking:", error)
    } finally {
      setIsSubmitting(false)
      setIsBookingConfirmed(true)
    }
  }

  const renderCurrentStep = () => {
    const stepProps = {
      formData,
      onUpdateFormData: handleUpdateFormData,
      onNext: nextStep,
      onPrev: prevStep,
      isValid: false,
      isTouched: currentStep === 2 ? step2Touched : false,
    }

    switch (currentStep) {
      case 1:
        return <StepOne {...stepProps} isValid={isStep1Valid()} />
      case 2:
        return <StepTwo {...stepProps} isValid={isStep2Valid()} />
      default:
        return <StepOne {...stepProps} isValid={isStep1Valid()} />
    }
  }

  return (
    <div className="max-w-4xl mx-auto bg-white min-h-screen">
      {!isBookingConfirmed ? (
        <>
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4 hidden">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-gray-900">Book your free inspection</h1>
              <div className="text-sm text-gray-500">Step {currentStep} of 2</div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4 hidden">
              <div className="flex items-center">
                {[1, 2].map((step) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                        step <= currentStep ? "bg-green-500 text-white" : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {step}
                    </div>
                    {step < 2 && (
                      <div className={`flex-1 h-1 mx-2 ${step < currentStep ? "bg-green-500" : "bg-gray-200"}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Step Content */}
          <div className="px-6 py-8">{renderCurrentStep()}</div>

          {/* Navigation Buttons */}
          <div className="border-t border-gray-200 px-6 py-4">
            <div className="flex justify-between">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                  currentStep === 1 ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </button>

              {currentStep < 2 ? (
                <button
                  onClick={() => {
                    if (currentStep === 1) {
                      nextStep()
                    }
                  }}
                  disabled={currentStep === 1 && !isStep1Valid()}
                  className={`flex items-center px-6 py-2 rounded-md transition-colors ${
                    currentStep === 1 && !isStep1Valid()
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-primary text-white hover:bg-primary/80"
                  }`}
                >
                  Continue
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !isStep2Valid()}
                  className={`px-6 py-2 rounded-md transition-colors ${
                    isSubmitting || !isStep2Valid()
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-primary text-white hover:bg-primary/80"
                  }`}
                >
                  {isSubmitting ? "Submitting..." : "Confirm Booking"}
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