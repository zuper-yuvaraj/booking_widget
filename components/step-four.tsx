"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock } from "lucide-react"
import type { StepProps, ApiResponse, ApiUser, TimeSlot } from "@/types/booking"
import { ASSISTED_SCHEDULING_WEBHOOK, SERVICE_TYPE_LABELS } from "@/configs"
import { useQueryParams } from "@/hooks/query-params.hooks"

export default function StepFour({ formData, onUpdateFormData }: StepProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    formData.selectedDate ? new Date(formData.selectedDate) : null,
  )
  const [availabilityData, setAvailabilityData] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchParams = useQueryParams();
  const COMPANY_UID = searchParams.get("company_uid") || "2cb675a0-6fa0-485b-be9c-89ce4d0f54d1"
  console.log("Company UID from URL:", COMPANY_UID)

  const generateCalendarDates = () => {
    const dates = []
    const now = new Date()
    
    // Get today's date in America/Denver timezone
    const denverDateString = now.toLocaleDateString('en-US', { 
      timeZone: 'America/Denver',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
    
    // Parse the Denver date string (MM/DD/YYYY format)
    const [month, day, year] = denverDateString.split('/').map(Number)
    const today = new Date(year, month - 1, day)
    
    let i = 0
    while (dates.length < 7) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      const dayOfWeek = date.getDay()
      // Skip Saturdays (day 6) and Sundays (day 0)
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        dates.push(date)
      }
      i++
    }
    return dates
  }

  const calendarDates = generateCalendarDates()

  const fetchAvailability = async (date: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${ASSISTED_SCHEDULING_WEBHOOK}?date=${date}&serviceType=${formData.serviceType}&company_uid=${COMPANY_UID}`)
      if (!response.ok) {
        throw new Error('Failed to fetch availability data')
      }
      const data: ApiResponse = await response.json()
      if(!data.success) {
        throw new Error(data.message || 'Failed to fetch availability data')
      }

      setAvailabilityData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching availability:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    // const dateString = date.toISOString().split("T")[0]
   const dateString = new Intl.DateTimeFormat("en-CA", {
  // timeZone: "America/Denver",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(date);
    onUpdateFormData("selectedDate", dateString)
    // Clear previous selections when date changes
    onUpdateFormData("selectedUser", "")
    onUpdateFormData("selectedSlot", "")
    // Fetch availability data for the selected date
    fetchAvailability(dateString)
  }

  // Auto-scroll to bottom when slot is selected
  useEffect(() => {
    if (formData.selectedSlot) {
      // Small delay to ensure the booking summary is rendered
      const timer = setTimeout(() => {
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: 'smooth'
        })
      }, 100)
      
      return () => clearTimeout(timer)
    }
  }, [formData.selectedSlot])

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
      // timeZone: 'America/Denver'
    })
  }

  // Helper function to transform API data to time slot-wise format
  const transformApiDataToTimeSlots = () => {
    if (!availabilityData?.data) return []
    
    const selectedDateData = availabilityData.data.availability.find(
      (item) => item.date === formData.selectedDate
    )
    
    if (!selectedDateData || selectedDateData.holiday || selectedDateData.slots.length === 0) {
      return []
    }

    // Check if selected date is today
    const today = new Date().toISOString().split('T')[0]
    const isToday = formData.selectedDate === today
    const currentTime = new Date()
    const oneHourFromNow = new Date(currentTime.getTime() + 60 * 60 * 1000) // 1 hour from now

    const parseUTCDateTime = (dateTimeString: string) => {
      // Convert "2025-07-14 14:00:00" to "2025-07-14T14:00:00Z"
      return new Date(dateTimeString.replace(' ', 'T') + 'Z');
    };

    // Transform to time slot-wise format
    const timeSlots = selectedDateData.slots
      .filter((slot: TimeSlot) => {
        // Filter out slots that are less than 1 hour ahead if today
        if (isToday) {
          const slotStartTime = new Date(slot.start_time.replace(' ', 'T') + 'Z');
          if (slotStartTime <= oneHourFromNow) {
            return false
          }
        }
        return true
      })
      .map((slot: TimeSlot) => {
        // Convert UTC to local time for UI display
        const timeRange = `${parseUTCDateTime(slot.start_time).toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true,
          timeZone: 'America/Denver'
        })} - ${parseUTCDateTime(slot.end_time).toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true,
          timeZone: 'America/Denver'
        })}`

        // Get available users for this slot
        const availableUsers = slot.users
          .map((userId: string) => availabilityData.data.users.find((u: ApiUser) => u.user_uid === userId))
          .filter((user): user is ApiUser => user !== undefined)

        return {
          timeRange,
          startTime: slot.start_time,
          endTime: slot.end_time,
          usersAvailable: slot.users_available,
          users: availableUsers
        }
      })

    return timeSlots
  }

  const timeSlots = transformApiDataToTimeSlots()

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <Calendar className="mx-auto w-12 h-12 mb-4 text-green-500" />
        <h2 className="text-xl font-semibold text-gray-900">Select Date & Time</h2>
        <p className="text-gray-600 mt-2">Choose your preferred date and time slot</p>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Select Date</h3>
        <div className="grid grid-cols-7 gap-2 mb-6">
          {calendarDates.slice(0, 21).map((date, index) => {
            const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString()
            return (
              <button
                key={index}
                onClick={() => handleDateSelect(date)}
                className={`p-3 text-center rounded-lg border transition-colors ${
                  isSelected
                    ? "bg-primary text-white border-green-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-green-50 hover:border-green-300"
                }`}
              >
                <div className="text-xs font-medium">{formatDate(date)}</div>
                <div className="text-lg font-bold">{date.getDate()}</div>
              </button>
            )
          })}
        </div>
      </div>

      {selectedDate && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            <Clock className="inline w-5 h-5 mr-2" />
            Available Time Slots for {formatDate(selectedDate)}
          </h3>
          
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading availability...</p>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">Error: {error}</p>
            </div>
          )}
          
          {!loading && !error && timeSlots.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600">No time slots available for this date.</p>
            </div>
          )}
          
          {!loading && !error && timeSlots.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {timeSlots.map((slot: any, slotIndex: number) => {
                const isSlotSelected = formData.selectedSlot === slot.timeRange
                return (
                  <button
                    key={slotIndex}
                    onClick={() => {
                      onUpdateFormData("selectedSlot", slot.timeRange)
                      onUpdateFormData("start_time", slot.startTime)
                      onUpdateFormData("end_time", slot.endTime)
                      // // Auto-assign first available user
                      // if (slot.users.length > 0) {
                      //   onUpdateFormData("selectedUser", slot.users[0].user_uid)
                      // }
                    }}
                    className={`p-4 text-center rounded-lg border transition-colors ${
                      isSlotSelected
                        ? "bg-primary text-white border-green-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-green-50 hover:border-green-300"
                    }`}
                  >
                    <div className="font-medium">{slot.timeRange}</div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}

      {formData.selectedSlot && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h4 className="text-lg font-medium text-green-900 mb-4">Booking Summary</h4>
          <div className="space-y-2 text-sm text-green-800">
            <p>
              <strong>Name:</strong> {formData.firstName} {formData.lastName}
            </p>
            <p>
              <strong>Phone:</strong> {formData.phone}
            </p>
            <p>
              <strong>Email:</strong> {formData.email}
            </p>
            <p>
              <strong>Address:</strong> {formData.address}
            </p>
            <p>
              <strong>Service:</strong> <span>{SERVICE_TYPE_LABELS[formData.serviceType] || formData.serviceType}</span>
            </p>
            <p>
              <strong>Date:</strong> {selectedDate && formatDate(selectedDate)}
            </p>
            <p>
              <strong>Time:</strong> {formData.selectedSlot}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
