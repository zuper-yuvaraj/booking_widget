"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { isValidPhoneNumber } from "react-phone-number-input"
import { isValidEmail } from "@/lib/utils"
import type { FormData } from "@/types/booking"
import StepOne from "./step-one"
import StepTwo from "./step-two"
import StepThree from "./step-three"
import BookingConfirmation from "./booking-confirmation"
import { CREATE_BOOKING_WEBHOOK } from "@/configs"
import { useQueryParams } from "@/hooks/query-params.hooks"

export default function BookingWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    serviceType: [],
    selectedServices: [],
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
    //marketingConsent: false,
  })

  const searchParams = useQueryParams();
  const COMPANY_UID = searchParams.get("company_uid") || ""

  const handleUpdateFormData = (field: keyof FormData, value: FormData[keyof FormData]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Step 1 validation (Personal Information)
  const isStep1Valid = () => {
    if (!formData.firstName || !formData.lastName || !formData.phone || !formData.email) {
      return false
    }

    const isPhoneValid = isValidPhoneNumber(formData.phone)
    if (!isPhoneValid) {
      return false
    }

    const isEmailValid = isValidEmail(formData.email)
    if (!isEmailValid) {
      return false
    }

    return true
  }

  // Step 2 validation (Address)
  const isStep2Valid = () => {
    return formData.address !== "" && formData.latitude !== "" && formData.longitude !== ""
  }

  // Step 3 validation (Services and Date)
  const isStep3Valid = () => {
    return (
      Array.isArray(formData.serviceType) &&
      formData.serviceType.length > 0 &&
      formData.selectedDate !== "" 
      
    )
  }

  const nextStep = () => {
    // Validate before moving to next step
    if (currentStep === 1 && !isStep1Valid()) {
      return
    }
    if (currentStep === 2 && !isStep2Valid()) {
      return
    }
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const response = await fetch(`${CREATE_BOOKING_WEBHOOK}?company_uid=${COMPANY_UID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })
      
      if (!response.ok) {
        console.error('Failed to submit booking:', response.status, response.statusText)
      } else {
        console.log('Booking submitted successfully')

        if (typeof window !== "undefined" && window.gtag) {
        window.gtag('event', 'conversion', {
          send_to: 'AW-652527712/2bfTCL-6uY0cEOCQk7cC',
          value: 1.0,
          currency: 'USD'
        });
      }
       setIsBookingConfirmed(true)
      }
    } catch (error) {
      console.error('Error submitting booking:', error)
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
    }

    switch (currentStep) {
      case 1:
        return <StepOne {...stepProps} isValid={isStep1Valid()} />
      case 2:
        return <StepTwo {...stepProps} isValid={isStep2Valid()} />
      case 3:
        return <StepThree {...stepProps} isValid={isStep3Valid()} />
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
              <div className="text-sm text-gray-500">Step {currentStep} of 3</div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4 hidden">
              <div className="flex items-center">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                        step <= currentStep ? "bg-green-500 text-white" : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {step}
                    </div>
                    {step < 3 && (
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

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={
                    (currentStep === 1 && !isStep1Valid()) ||
                    (currentStep === 2 && !isStep2Valid())
                  }
                  className={`flex items-center px-6 py-2 rounded-md transition-colors ${
                    (currentStep === 1 && !isStep1Valid()) ||
                    (currentStep === 2 && !isStep2Valid())
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  Continue
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!isStep3Valid() || isSubmitting}
                  className={`px-6 py-2 rounded-md transition-colors font-medium ${
                    !isStep3Valid() || isSubmitting
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-green-600 text-white hover:bg-green-700"
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
