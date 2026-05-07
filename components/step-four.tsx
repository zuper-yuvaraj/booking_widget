"use client"

import { useState, useEffect, useRef } from "react"
import { Calendar, Clock, User } from "lucide-react"
import type { StepProps, UserSlot, ApiResponse, ApiUser, TimeSlot } from "@/types/booking"
import { ASSISTED_SCHEDULING_WEBHOOK,COMPANY_UUID,TIME_ZONE } from "@/configs"
import { useQueryParams } from "@/hooks/query-params.hooks"

export default function StepFour({ formData, onUpdateFormData }: StepProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    formData.selectedDate ? new Date(formData.selectedDate) : null,
  )
  const [availabilityData, setAvailabilityData] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [expandedBios, setExpandedBios] = useState<Set<string>>(new Set())
  const [localNotes, setLocalNotes] = useState("")
  const baseNotesRef = useRef(formData.notes)

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const raw = e.target.value
    setLocalNotes(raw)
    const htmlWrapped = raw.trim()
      ? raw.split("\n").filter(l => l.trim()).map(l => `<p>${l}</p>`).join("")
      : ""
    onUpdateFormData("notes", baseNotesRef.current + htmlWrapped)
  }

  const searchParams = useQueryParams();
  const COMPANY_UID = searchParams.get("company_uid") ||COMPANY_UUID
  console.log("Company UID from URL:", COMPANY_UID)

  const generateCalendarDates = () => {
    const dates = []
    const today = new Date()
    let i = 1
    while (dates.length < 7) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      console.log("Generated date:", date, "Day of week:", date.getDay())
      // Skip Sundays (day 0)
      if (date.getDay() == 0 || date.getDay() == 6) {
        // dates.push(date)
        i++
        continue;
      }
        dates.push(date)

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
    const dateString = date.toISOString().split("T")[0]
    onUpdateFormData("selectedDate", dateString)
    // Clear previous selections when date changes
    onUpdateFormData("selectedUser", "")
    onUpdateFormData("selectedSlot", "")
    // Fetch availability data for the selected date
    fetchAvailability(dateString)
  }

  const handleUserSelect = (userId: string) => {
    onUpdateFormData("selectedUser", userId)
    onUpdateFormData("selectedSlot", "") // Clear slot selection when user changes
  }

  const handleSlotSelect = (slot: { display: string; original: TimeSlot }) => {
    onUpdateFormData("selectedSlot", slot.display)
    onUpdateFormData("start_time", slot.original.start_time)
    onUpdateFormData("end_time", slot.original.end_time)
  }

  const toggleBioExpansion = (userId: string) => {
    setExpandedBios(prev => {
      const newSet = new Set(prev)
      if (newSet.has(userId)) {
        newSet.delete(userId)
      } else {
        newSet.add(userId)
      }
      return newSet
    })
  }

  const truncateBio = (bio: string, userId: string) => {
    if (!bio) return ""
    
    const isExpanded = expandedBios.has(userId)
    
    if (isExpanded) {
      return bio
    }
    
    // Show first 200 characters, removing line breaks
    const cleanBio = bio.replace(/\n/g, ' ')
    return cleanBio.length > 200 ? cleanBio.substring(0, 200) + '...' : cleanBio
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
      timeZone:TIME_ZONE
    })
  }

const formatDateOnly = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    timeZone:TIME_ZONE,
  });
};
  // Helper function to transform API data to UserSlot format
  const transformApiDataToUserSlots = (): UserSlot[] => {
    if (!availabilityData?.data) return []
    
    const selectedDateData = availabilityData.data.availability.find(
      (item) => item.date === formData.selectedDate
    )
    
    if (!selectedDateData || selectedDateData.holiday || selectedDateData.slots.length === 0) {
      return []
    }

    // 24-hour buffer: compute cutoff rounded up to the next full hour
    const now = new Date()
    const cutoff = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    if (cutoff.getMinutes() > 0 || cutoff.getSeconds() > 0 || cutoff.getMilliseconds() > 0) {
      cutoff.setHours(cutoff.getHours() + 1, 0, 0, 0)
    } else {
      cutoff.setMinutes(0, 0, 0)
    }

    // Group slots by users with original slot data
    const userSlotMap = new Map<string, { user: ApiUser; slots: Array<{ display: string; original: TimeSlot }> }>()

    const parseUTCDateTime = (dateTimeString: string) => {
      // Convert "2025-07-14 14:00:00" to "2025-07-14T14:00:00Z"
      return new Date(dateTimeString.replace(' ', 'T') + 'Z');
    };

    selectedDateData.slots.forEach((slot: TimeSlot) => {
      // Skip any slot starting within 24 hours from now (next full hour boundary)
      const slotStartTime = new Date(parseUTCDateTime(slot.start_time).toLocaleString('en-US', { timeZone: TIME_ZONE }))
      
      if (slotStartTime < cutoff) {
        return
      }
      
      
      const fromTime = parseUTCDateTime(slot.start_time).toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true,
        timeZone: TIME_ZONE
      })

      const endTime = parseUTCDateTime(slot.end_time).toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true,
        timeZone: TIME_ZONE
      })
      // Convert UTC to EST for UI display
      const timeRange = `${fromTime} - ${endTime}`
      
      slot.users.forEach((userId: string) => {
        const user = availabilityData.data.users.find((u: ApiUser) => u.user_uid === userId)
        if (user) {
          if (!userSlotMap.has(userId)) {
            userSlotMap.set(userId, { user, slots: [] })
          }
          userSlotMap.get(userId)!.slots.push({
            display: timeRange,
            original: slot
          })
        }
      })
    })

    return Array.from(userSlotMap.values()).map(({ user, slots }, index) => ({
      id: user.user_uid,
      name: `Technician ${index + 1}`,// `${user.first_name} ${user.last_name}`,
      avatar: "https://s3.ap-south-1.amazonaws.com/prod.app.zuperpro/assets/profile_picture.jpg",
      description: `${user.bio || ''}`,
      slots: slots
    }))
  }

  const userSlots = transformApiDataToUserSlots()
  const selectedUser = userSlots.find((user: UserSlot) => user.id === formData.selectedUser)

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <Calendar className="mx-auto w-12 h-12 mb-4 text-green-500" />
        <h2 className="text-xl font-semibold text-gray-900">Select Date & Professional</h2>
        <p className="text-gray-600 mt-2">Choose your preferred date and professional</p>
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
                <div className="text-lg font-bold">{formatDateOnly(date)}</div>
              </button>
            )
          })}
        </div>
      </div>

      {selectedDate && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            <User className="inline w-5 h-5 mr-2" />
            Available Professionals for {formatDate(selectedDate)}
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
          
          {!loading && !error && userSlots.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600">No professionals available for this date.</p>
            </div>
          )}
          
          {!loading && !error && userSlots.length > 0 && (
            <div className="space-y-4">
              {userSlots.map((user: UserSlot) => {
                const isSelected = formData.selectedUser === user.id
                return (
                  <div
                    key={user.id}
                    className={`border rounded-lg p-4 transition-colors ${
                      isSelected
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{user.name}</h4>
                          <div className="text-sm text-gray-500">
                            <p className="whitespace-pre-line">{truncateBio(user.description, user.id)}</p>
                            {user.description && user.description.length > 200 && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleBioExpansion(user.id)
                                }}
                                className="text-green-600 hover:text-green-700 text-xs font-medium mt-1"
                              >
                                {expandedBios.has(user.id) ? 'View less' : 'View more'}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h5 className="text-sm font-medium text-gray-900 mb-3">
                        <Clock className="inline w-4 h-4 mr-1" />
                        Available Times
                      </h5>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {user.slots.map((slot: { display: string; original: TimeSlot }, index: number) => {
                          const isSlotSelected = formData.selectedSlot === slot.display && formData.selectedUser === user.id
                          return (
                            <button
                              key={index}
                              onClick={() => {
                                handleUserSelect(user.id)
                                handleSlotSelect(slot)
                              }}
                              className={`p-2 text-center rounded-md border text-sm transition-colors ${
                                isSlotSelected
                                  ? "bg-primary text-white border-green-400"
                                  : "bg-white text-gray-700 border-gray-300 hover:bg-green-50 hover:border-green-300"
                              }`}
                            >
                              {slot.display }
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {formData.selectedSlot && selectedUser && (
        <>
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
                <strong>Service:</strong> <span className="capitalize">{formData.serviceType}</span>
              </p>
              <p>
                <strong>Date:</strong> {selectedDate && formatDate(selectedDate)}
              </p>
              <p>
                <strong>Professional:</strong> {selectedUser.name}
              </p>
              <p>
                <strong>Time:</strong> {formData.selectedSlot}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
            <textarea
              value={localNotes}
              onChange={handleNotesChange}
              rows={4}
              placeholder="Add any additional notes or instructions..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
            />
          </div>
        </>
      )}
    </div>
  )
}
