"use client"

import { useState } from "react"
import { isValidPhoneNumber } from "react-phone-number-input"
import { isValidEmail } from "@/lib/utils"
import type { FormData } from "@/types/booking"
import StepOne from "./step-one"
import BookingConfirmation from "./booking-confirmation"
import { CREATE_BOOKING_WEBHOOK, COMPANY_UID } from "@/configs"
import { buildBookingSubmissionPayload } from "@/lib/booking-payload"

export default function BookingWizard() {
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

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
    marketingConsent: false,
    reasonForContact: "",
    serviceInterestedIn: "",
    heardAboutUs: "",
    questionsOrComments: "",
    preferredDate: "",
  })

  const handleUpdateFormData = (
    field: keyof FormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const isFormValid = () => {
    const hasRequiredFields = !!(
      formData.firstName.trim() &&
      formData.lastName.trim() &&
      formData.phone &&
      formData.email.trim() &&
      formData.address.trim()
    )

    const phoneValid = formData.phone
      ? isValidPhoneNumber(formData.phone)
      : false

    const emailValid = formData.email
      ? isValidEmail(formData.email.trim())
      : false

    return hasRequiredFields && phoneValid && emailValid
  }

  const handleSubmit = async () => {
    if (!isFormValid() || isSubmitting) return

    setIsSubmitting(true)

    try {
      const response = await fetch(`${CREATE_BOOKING_WEBHOOK}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          buildBookingSubmissionPayload(formData, COMPANY_UID)
        ),
      })

      if (!response.ok) {
        console.error(
          "Failed to submit booking:",
          response.status,
          response.statusText
        )
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

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      {!isBookingConfirmed ? (
        <StepOne
          formData={formData}
          onUpdateFormData={handleUpdateFormData}
          onNext={handleSubmit}
          onPrev={() => {}}
          isValid={isFormValid()}
          isSubmitting={isSubmitting}
        />
      ) : (
        <BookingConfirmation formData={formData} />
      )}
    </div>
  )
}
