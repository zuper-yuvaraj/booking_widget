"use client"

import { PartyPopper } from "lucide-react"
import type { FormData } from "@/types/booking"
import { COMPANY_NAME, getServiceTitle } from "@/configs"

interface BookingConfirmationProps {
  formData: FormData
}

export default function BookingConfirmation({ formData }: BookingConfirmationProps) {
  const formatDate = (dateString: string) => {
    dateString = dateString + " 00:00:00"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: 'America/New_York'
    })
  }

  const formatTime = (timeSlot: string) => {
    return timeSlot
  }

  return (
    <div className="max-w-2xl mx-auto text-center py-12">
      <div className="mb-8">
        <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <PartyPopper className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 mb-4">
          Thanks for booking with {COMPANY_NAME}!
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Your booking is scheduled for{" "}
          <span className="font-semibold text-primary">
            {formatDate(formData.selectedDate)} at {formatTime(formData.selectedSlot)}
          </span>
        </p>
      </div>

      <div className="bg-primary/5 border border-primary/30 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-primary mb-4">Booking Details</h2>
        <div className="space-y-3 text-left">
          <div className="flex justify-between">
            <span className="text-gray-600">Name:</span>
            <span className="font-medium">{formData.firstName} {formData.lastName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Phone:</span>
            <span className="font-medium">{formData.phone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Email:</span>
            <span className="font-medium">{formData.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Service:</span>
            <span className="font-medium">{getServiceTitle(formData.serviceType)}</span>
          </div>
          {formData.jobDescription && (
            <div className="flex justify-between">
              <span className="text-gray-600">Description:</span>
              <span className="font-medium text-right max-w-[60%]">{formData.jobDescription}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-600">Address:</span>
            <span className="font-medium">{formData.address}</span>
          </div>
        </div>
      </div>

      <div className="text-gray-600">
        <p className="mb-2">We'll send you a confirmation email and text message shortly.</p>
        <p>Our team will contact you to confirm the appointment details.</p>
      </div>
    </div>
  )
} 