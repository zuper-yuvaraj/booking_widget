"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { isValidPhoneNumber } from "react-phone-number-input"
import { isValidEmail } from "@/lib/utils"
import type { FormData } from "@/types/booking"
import StepOne from "./step-one"
import StepTwo from "./step-two"
import BookingConfirmation from "./booking-confirmation"
import { CREATE_BOOKING_WEBHOOK } from "@/configs"
import { useQueryParams } from "@/hooks/query-params.hooks"

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
    //jobType: "",
    services: "",
    notes: "",
    marketingConsent: false,
  })

  const searchParams = useQueryParams()
  const COMPANY_UID = searchParams.get("company_uid") || ""

  const handleUpdateFormData = (
    field: keyof FormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  /* ---------------- VALIDATIONS ---------------- */

  const isStep1Valid = () => !!formData.address

  const isStep2Valid = () => {
    const required =
      !!(
        formData.firstName &&
        formData.lastName &&
        formData.phone &&
        formData.email &&
        //formData.jobType &&
        formData.preferredDate
      )

    const phoneValid = formData.phone
      ? isValidPhoneNumber(formData.phone)
      : false

    const emailValid = formData.email
      ? isValidEmail(formData.email)
      : false

    const consentGiven = formData.marketingConsent === true

    return required && phoneValid && emailValid && consentGiven
  }

  /* ---------------- NAVIGATION ---------------- */

  const nextStep = () => {
    setCurrentStep(2)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(1)
  }

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      const response = await fetch(
        `${CREATE_BOOKING_WEBHOOK}?company_uid=${COMPANY_UID}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      )

      if (!response.ok) {
        console.error(
          "Failed to submit booking:",
          response.status,
          response.statusText
        )
      } else {
        console.log("Booking submitted successfully")

        // ✅ Facebook Pixel Event
        if (typeof window !== "undefined" && window.fbq) {
          window.fbq('track', 'CompleteRegistration', {
            value: 0,
            currency: 'EUR'
          });
        }

        setIsBookingConfirmed(true)
      }

    } catch (error) {   
      console.error("Error submitting booking:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  /* ---------------- CONTINUE HANDLER ---------------- */

  const handleContinue = () => {
      if (currentStep === 1) {
        nextStep()
      } else {
        handleSubmit()
      }
    }

    /* ---------------- STEP RENDER ---------------- */

    const renderCurrentStep = () => {
      const stepProps = {
        formData,
        onUpdateFormData: handleUpdateFormData,
        onNext: nextStep,
        onPrev: prevStep,
        isValid: false,
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

    /* ---------------- UI ---------------- */

    return (
      <div className="max-w-4xl mx-auto bg-white min-h-screen">
        {!isBookingConfirmed ? (
          <>
            {/* STEP CONTENT */}
            <div className="px-6 py-8">{renderCurrentStep()}</div>

            {/* NAVIGATION */}
            <div className="border-t border-gray-200 px-6 py-4">
              <div className="flex justify-between">

                {/* BACK */}
                <button
                  onClick={prevStep}
                  disabled={currentStep === 1 || isSubmitting}
                  className={`flex items-center px-4 py-2 rounded-md transition-colors ${currentStep === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Back
                </button>

                {/* CONTINUE / SUBMIT */}
                <button
                  onClick={handleContinue}
                  disabled={
                    isSubmitting ||
                    (currentStep === 1 && !isStep1Valid()) ||
                    (currentStep === 2 && !isStep2Valid())
                  }
                  className={`flex items-center px-6 py-2 rounded-md transition-colors ${isSubmitting ||
                      (currentStep === 1 && !isStep1Valid()) ||
                      (currentStep === 2 && !isStep2Valid())
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-primary text-white hover:bg-primary/80"
                    }`}
                >
                  {isSubmitting
                    ? "Submitting..."
                    : currentStep === 2
                      ? "Confirm Booking"
                      : "Continue"}

                  {!isSubmitting && (
                    <ChevronRight className="w-4 h-4 ml-1" />
                  )}
                </button>

              </div>
            </div>
          </>
        ) : (
          <BookingConfirmation formData={formData} />
        )}
      </div>
    )
  }