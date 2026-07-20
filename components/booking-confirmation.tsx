"use client"

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
        <img
          src="https://s3.us-west-1.amazonaws.com/prod.us-west-1c.app.zuperpro/attachments/62a6651b-aae2-4f56-a438-5447f073641a/e7610149-6e39-42e9-ad84-985ac108fc84.jpg"
          alt={`${COMPANY_NAME} logo`}
          className="mx-auto w-36 h-auto mb-6"
        />
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 mb-4">
          Thanks for choosing {COMPANY_NAME}!
        </h1>
        <p className="text-2xl font-semibold text-gray-900 mb-8">
          Our team will contact you to confirm your preferred appointment date.
        </p>
      </div>

      <div className="bg-[#fefbe6] border border-[#f3e7a3] rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Details</h2>
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
            <span className="text-gray-600">Preferred Date:</span>
            <span className="font-medium">{formatDate(formData.selectedDate)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Preferred Time Slot:</span>
            <span className="font-medium">{formatTime(formData.selectedSlot)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Address:</span>
            <span className="font-medium text-right">{formData.address}</span>
          </div>
        </div>
      </div>
    </div>
  )
} 