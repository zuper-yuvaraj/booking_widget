"use client"

import Image from "next/image"
import type { FormData } from "@/types/booking"
import { COMPANY_NAME, SERVICE_TYPES } from "@/configs"

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

  const getServiceTitles = (serviceIds: string | string[]) => {
    const ids = Array.isArray(serviceIds) ? serviceIds : [serviceIds]
    return ids
      .map(id => SERVICE_TYPES.find(service => service.uiId === id)?.title || id)
      .join(", ")
  }

  return (
    <div className="max-w-2xl mx-auto text-center py-12">
      <div className="mb-8">
        <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 overflow-hidden">
          <Image 
            src="https://s3.amazonaws.com/prod.us-east-1.app.zuperpro/attachments/38938420-a072-4f21-a6e5-a107960efda1/a4faa613-2121-43d2-8791-c7b71b51fe59.png"
            alt="Celebration"
            width={80}
            height={80}
            priority
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 mb-4">
          Thankyou for submitting your request. Our team will be in touch with you shortly!
        </h1>
        
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-green-900 mb-4">Request Details</h2>
        <div className="space-y-3 text-left">
          <div>
            <span className="text-gray-600">Name: </span>
            <span className="font-medium">{formData.firstName} {formData.lastName}</span>
          </div>
          <div>
            <span className="text-gray-600">Phone: </span>
            <span className="font-medium">{formData.phone}</span>
          </div>
          <div>
            <span className="text-gray-600">Email: </span>
            <span className="font-medium">{formData.email}</span>
          </div>
          <div>
            <span className="text-gray-600">Service: </span>
            <span className="font-medium">{getServiceTitles(formData.serviceType)}</span>
          </div>
          <div>
            <span className="text-gray-600">Address: </span>
            <span className="font-medium">{formData.address}</span>
          </div>
        </div>
      </div>

      
    </div>
  )
} 