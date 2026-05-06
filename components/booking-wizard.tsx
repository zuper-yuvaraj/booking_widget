"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { isValidPhoneNumber } from "react-phone-number-input"
import { isValidEmail } from "@/lib/utils"
import type { FormData } from "@/types/booking"
import StepOne from "./step-one"
import StepTwo from "./step-two"
import StepFour from "./step-four"
import BookingConfirmation from "./booking-confirmation"
import { CREATE_BOOKING_WEBHOOK } from "@/configs"
import {  useQueryParams } from "@/hooks/query-params.hooks"

export default function BookingWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [step2Touched, setStep2Touched] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    serviceType: "hea",
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
    isNeeecoEmployee: undefined,
    outreachTeamMember: "",
    partnerName: "",
    electricProvider: "",
    electricAccount: "",
    gasProvider: "",
    gasAccount: "",
    notes: "",
  })

  const searchParams = useQueryParams();
  const COMPANY_UID = searchParams.get("company_uid") || ""

  const handleUpdateFormData = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => {
      if (prev[field] === value) {
        return prev
      }
      return { ...prev, [field]: value }
    })
  }

  const getPhoneE164 = (rawPhone: string) => {
    const digits = rawPhone.replace(/\D/g, "")
    return digits.length === 10 ? `+1${digits}` : rawPhone
  }

  const isValidUsPhoneDigits = (digits: string) => {
    if (!/^[2-9]\d{9}$/.test(digits)) return false
    return isValidPhoneNumber(`+1${digits}`)
  }

  const isStep1Valid = () => {
    return !!formData.address && formData.isServiceAreaValid === true
  }

  const isStep2Valid = () => {
    const hasRequiredFields = !!(
      formData.firstName?.trim() &&
      formData.lastName?.trim() &&
      formData.phone &&
      formData.email &&
      (formData.isNeeecoEmployee === "yes" || formData.isNeeecoEmployee === "no")
    )

    const isPhoneValid = formData.phone ? isValidUsPhoneDigits(formData.phone) : false
    const isEmailValid = formData.email ? isValidEmail(formData.email) : false
    const isEmployeeDependentValid = formData.isNeeecoEmployee === "yes"
      ? !!formData.outreachTeamMember
      : formData.isNeeecoEmployee === "no"
      ? !!formData.partnerName
      : false
    const isConsentGiven = formData.marketingConsent === true

    return hasRequiredFields && isPhoneValid && isEmailValid && isEmployeeDependentValid && isConsentGiven
  }

  const isStep3Valid = () => {
    return !!(formData.selectedDate && formData.selectedSlot && formData.selectedUser)
  }

  const nextStep = () => {
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
        body: JSON.stringify({ ...formData, phone: getPhoneE164(formData.phone), job_description: formData.notes })
      })
      
      if (!response.ok) {
        console.error('Failed to submit booking:', response.status, response.statusText)
      } else {
        console.log('Booking submitted successfully')
      }
    } catch (error) {
      console.error('Error submitting booking:', error)
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
      case 3:
        return <StepFour {...stepProps} isValid={isStep3Valid()} />
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
                  onClick={() => {
                    if (currentStep === 2) {
                      setStep2Touched(true)
                      if (isStep2Valid()) {
                        nextStep()
                      }
                    } else {
                      nextStep()
                    }
                  }}
                  disabled={
                    (currentStep === 1 && !isStep1Valid()) ||
                    (currentStep === 2 && !isStep2Valid()) ||
                    (currentStep === 3 && !isStep3Valid())
                  }
                  className={`flex items-center px-6 py-2 rounded-md transition-colors ${
                    (currentStep === 1 && !isStep1Valid()) ||
                    (currentStep === 2 && !isStep2Valid()) ||
                    (currentStep === 3 && !isStep3Valid())
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
                  disabled={!isStep3Valid() || isSubmitting}
                  className={`px-6 py-2 rounded-md transition-colors ${
                    !isStep3Valid() || isSubmitting
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
