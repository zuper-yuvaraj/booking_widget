"use client"

import { PartyPopper } from "lucide-react"
import type { FormData } from "@/types/booking"
import { COMPANY_NAME } from "@/configs"

interface BookingConfirmationProps {
  formData: FormData
}

export default function BookingConfirmation({ formData }: BookingConfirmationProps) {
   const formatDate = (dateString: string) => {
    // dateString = dateString + " 00:00:00"
    // const date = new Date(dateString)

    return dateString
    // return date.toLocaleDateString("en-US", {
    //   weekday: "long",
    //   year: "numeric",
    //   month: "long",
    //   day: "numeric",
    //   timeZone: TIME_ZONE
    // })
  }

  const formatTime = (timeSlot: string) => {
    return timeSlot
  }

  return (
    <div className="max-w-2xl mx-auto text-center py-12">
      <div className="mb-8">
        <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <PartyPopper className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 mb-4">
          Thanks for booking with {COMPANY_NAME}!
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Your booking is scheduled for{" "}
          <span className="font-semibold text-green-600">
            {formatDate(formData.preferredDate)}
          </span>
        </p>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-green-900 mb-4">Booking Details</h2>
        <div className="space-y-3 text-left">
          <div className="flex justify-between">
            <span className="text-gray-600">Name:</span>
            <span className="font-medium">{formData.firstName} {formData.lastName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Mobile Phone Number:</span>
            <span className="font-medium">{formData.phone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Email:</span>
            <span className="font-medium">{formData.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Preferred Date:</span>
            <span className="font-medium">{formatDate(formData.preferredDate)}</span>
          </div>
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