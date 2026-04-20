"use client"

import { User, ChevronDown } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import PhoneInput from "react-phone-number-input/input"
import { isValidPhoneNumber } from "react-phone-number-input"
import { isValidEmail } from "@/lib/utils"
import type { StepProps } from "@/types/booking"
import { COMPANY_NAME, PRIVACY_POLICY, TERMS_OF_SERVICE, ASSISTED_SCHEDULING_WEBHOOK, CREATE_BOOKING_WEBHOOK, COMPANY_UUID, TIME_ZONE } from "@/configs"
import { useQueryParams } from "@/hooks/query-params.hooks"

const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
const labelClass = "block text-sm font-medium text-gray-700 mb-2"

const SERVICE_OPTIONS = [
  "FARR Commercial Roof Installation",
  "Silicon Commercial Roof Installation",
  "Commercial Single Ply Membrane",
  "Residential Shingle Roof Replacement",
  "Residential Tile Roof Installation",
  "Residential Torch Down Or Roll Roofing",
]

interface SlotOption {
  display: string
  start_time: string
  end_time: string
}

export default function StepTwo({ formData, onUpdateFormData, onNext, isValid }: StepProps) {
  const firstNameInputRef = useRef<HTMLInputElement>(null)
  const cf = formData.custom_fields || {}

  const [slots, setSlots] = useState<SlotOption[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [slotError, setSlotError] = useState<string | null>(null)
  const [serviceDropdownOpen, setServiceDropdownOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedSlotRaw, setSelectedSlotRaw] = useState<{ start_time: string; end_time: string } | null>(null)
  const serviceDropdownRef = useRef<HTMLDivElement>(null)

  const searchParams = useQueryParams()
  const COMPANY_UID = searchParams.get("company_uid") || COMPANY_UUID

  useEffect(() => {
    if (firstNameInputRef.current) {
      firstNameInputRef.current.focus()
    }
  }, [])

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isValid) {
      onNext()
    }
  }

  const handlePhoneChange = (value: string | undefined) => {
    onUpdateFormData("phone", value || "")
  }

  const updateCustomField = (key: string, value: string) => {
    onUpdateFormData("custom_fields", { ...cf, [key]: value })
  }

  const selectedServices = cf["Services"] ? cf["Services"].split(",").filter(Boolean) : []

  const toggleService = (option: string) => {
    const updated = selectedServices.includes(option)
      ? selectedServices.filter((s) => s !== option)
      : [...selectedServices, option]
    onUpdateFormData("custom_fields", { ...cf, Services: updated.join(",") })
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (serviceDropdownRef.current && !serviceDropdownRef.current.contains(e.target as Node)) {
        setServiceDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const cf = formData.custom_fields || {}
      const payload = {
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
        start_time: selectedSlotRaw ? `${formData.preferredDate} ${selectedSlotRaw.start_time.split(" ")[1]}` : "",
        end_time: selectedSlotRaw ? `${formData.preferredDate} ${selectedSlotRaw.end_time.split(" ")[1]}` : "",
        selectedUser: formData.selectedUser,
        preferredDate: formData.preferredDate,
        preferredTimeSlot: formData.preferredTimeSlot,
        marketingConsent: formData.marketingConsent,
        description: formData.description,
        custom_fields: { ...cf, Services: cf["Services"] || "" },
      }
      const response = await fetch(`${CREATE_BOOKING_WEBHOOK}?company_uid=${COMPANY_UID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
      onNext()
    }
  }

  const today = new Date().toISOString().split("T")[0]

  const parseUTCDateTime = (dateTimeString: string) => {
    return new Date(dateTimeString.replace(' ', 'T') + 'Z')
  }

  const fetchSlots = async (date: string) => {
    setLoadingSlots(true)
    setSlotError(null)
    setSlots([])
    onUpdateFormData("preferredTimeSlot", "")

    try {
      const response = await fetch(`${ASSISTED_SCHEDULING_WEBHOOK}?date=${date}&company_uid=${COMPANY_UID}`)
      if (response.status !== 200) throw new Error('Failed to fetch slots')

      const data = await response.json()

      const dayData = data.data.availability.find((item: { date: string }) => item.date === date)
      if (!dayData || dayData.holiday || dayData.slots.length === 0) {
        setSlots([])
        return
      }

      const currentTime = new Date()
      const oneHourFromNow = new Date(currentTime.getTime() + 60 * 60 * 1000)
      const isToday = date === today

      const slotOptions: SlotOption[] = dayData.slots
        .filter((slot: { start_time: string }) => {
          if (!isToday) return true
          const slotStart = parseUTCDateTime(slot.start_time)
          return slotStart > oneHourFromNow
        })
        .map((slot: { start_time: string; end_time: string }) => ({
          display: `${parseUTCDateTime(slot.start_time).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
            timeZone: TIME_ZONE,
          })} - ${parseUTCDateTime(slot.end_time).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
            timeZone: TIME_ZONE,
          })}`,
          start_time: slot.start_time,
          end_time: slot.end_time,
        }))

      setSlots(slotOptions)
    } catch (err) {
      setSlotError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoadingSlots(false)
    }
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value
    onUpdateFormData("preferredDate", date)
    setSelectedSlotRaw(null)
    if (date) {
      fetchSlots(date)
    } else {
      setSlots([])
      onUpdateFormData("preferredTimeSlot", "")
    }
  }

  const isPhoneValid = formData.phone ? isValidPhoneNumber(formData.phone) : true
  const showPhoneError = formData.phone && !isPhoneValid
  const isEmailValid = formData.email ? isValidEmail(formData.email) : true
  const showEmailError = formData.email && !isEmailValid

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="text-center mb-8">
        <User className="mx-auto w-12 h-12 mb-4 text-green-500" />
        <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
        <p className="text-gray-600 mt-2">Please provide your contact details</p>
      </div>

      <div className="space-y-4">
        {/* First/Last Name */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              ref={firstNameInputRef}
              type="text"
              value={formData.firstName}
              onChange={(e) => onUpdateFormData("firstName", e.target.value)}
              onKeyPress={handleKeyPress}
              className={inputClass}
              placeholder="Enter your first name"
            />
          </div>
          <div>
            <label className={labelClass}>Last Name</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => onUpdateFormData("lastName", e.target.value)}
              onKeyPress={handleKeyPress}
              className={inputClass}
              placeholder="Enter your last name"
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className={labelClass}>
            Phone Number <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 text-sm">+1</span>
            </div>
            <PhoneInput
              country="US"
              value={formData.phone}
              onChange={handlePhoneChange}
              onKeyPress={handleKeyPress}
              placeholder="Enter your phone number"
              className={`w-full pl-8 pr-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:border-green-500 ${
                showPhoneError
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 focus:ring-green-500 focus:border-green-500"
              }`}
            />
          </div>
          {showPhoneError && (
            <p className="mt-1 text-sm text-red-600">Please enter a valid US phone number</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className={labelClass}>
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => onUpdateFormData("email", e.target.value)}
            onKeyPress={handleKeyPress}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:border-green-500 ${
              showEmailError
                ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                : "border-gray-300 focus:ring-green-500 focus:border-green-500"
            }`}
            placeholder="Enter your email address"
          />
          {showEmailError && (
            <p className="mt-1 text-sm text-red-600">Please enter a valid email address</p>
          )}
        </div>

        {/* Notes */}
        <div>
          <label className={labelClass}>Notes</label>
          <textarea
            value={formData.description}
            onChange={(e) => onUpdateFormData("description", e.target.value)}
            className={`${inputClass} resize-none`}
            rows={4}
            placeholder="Any additional notes or details..."
          />
        </div>

        {/* Date */}
        <div>
          <label className={labelClass}>
            Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={formData.preferredDate}
            min={today}
            onChange={handleDateChange}
            className={inputClass}
          />
        </div>

        {/* Preferred Time Slot */}
        {formData.preferredDate && (
          <div>
            <label className={labelClass}>
              Preferred Time Slot <span className="text-red-500">*</span>
            </label>
            {loadingSlots && (
              <div className="flex items-center space-x-2 py-2 text-sm text-gray-500">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500"></div>
                <span>Loading available slots...</span>
              </div>
            )}
            {slotError && (
              <p className="text-sm text-red-600">{slotError}</p>
            )}
            {!loadingSlots && !slotError && slots.length === 0 && (
              <p className="text-sm text-gray-500 py-2">No available slots for this date.</p>
            )}
            {!loadingSlots && !slotError && slots.length > 0 && (
              <select
                value={formData.preferredTimeSlot}
                onChange={(e) => {
                  const selected = slots.find((s) => s.display === e.target.value) || null
                  setSelectedSlotRaw(selected ? { start_time: selected.start_time, end_time: selected.end_time } : null)
                  onUpdateFormData("preferredTimeSlot", e.target.value)
                }}
                className={inputClass}
              >
                <option value="">Select a time slot...</option>
                {slots.map((slot, index) => (
                  <option key={index} value={slot.display}>{slot.display}</option>
                ))}
              </select>
            )}
          </div>
        )}

        {/* Service */}
        <div ref={serviceDropdownRef} className="relative">
          <label className={labelClass}>
            Services <span className="text-red-500">*</span>
          </label>
          <button
            type="button"
            onClick={() => setServiceDropdownOpen((prev) => !prev)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white flex items-center justify-between text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <span className={selectedServices.length > 0 ? "text-gray-900" : "text-gray-400"}>
              {selectedServices.length > 0 ? selectedServices.join(", ") : "Select services..."}
            </span>
            <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${serviceDropdownOpen ? "rotate-180" : ""}`} />
          </button>
          {serviceDropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
              {SERVICE_OPTIONS.map((option) => (
                <label key={option} className="flex items-center px-3 py-2 hover:bg-green-50 cursor-pointer text-sm">
                  <input
                    type="checkbox"
                    checked={selectedServices.includes(option)}
                    onChange={() => toggleService(option)}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded mr-3"
                  />
                  {option}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Consent */}
        <div className="mt-6">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="marketing-consent"
              checked={formData.marketingConsent || false}
              onChange={(e) => onUpdateFormData("marketingConsent", e.target.checked)}
              className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              required
            />
            <label htmlFor="marketing-consent" className="text-sm text-gray-700 leading-relaxed">
              By submitting your phone number, you agree to receive marketing text messages from {COMPANY_NAME}. Message frequency varies. Message and data rates may apply. Text HELP for Support. Text STOP to opt-out. View our{" "}
              <a
                href={TERMS_OF_SERVICE}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-800 underline"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href={PRIVACY_POLICY}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-800 underline"
              >
                Privacy Policy
              </a>
              .
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isValid || isSubmitting}
            className={`w-full py-3 px-6 rounded-md font-medium transition-colors ${
              !isValid || isSubmitting
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-primary text-white hover:bg-primary/80"
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  )
}
