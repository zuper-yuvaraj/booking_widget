"use client"

import { useState } from "react"
import { Calendar, User } from "lucide-react"
import type {
  StepProps,
  UserSlot,
  ApiResponse,
  ApiUser,
  TimeSlot,
} from "@/types/booking"
import { ASSISTED_SCHEDULING_WEBHOOK } from "@/configs"
import { useQueryParams } from "@/hooks/query-params.hooks"

export default function StepFour({ formData, onUpdateFormData }: StepProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    formData.selectedDate ? new Date(formData.selectedDate) : null
  )
  const [availabilityData, setAvailabilityData] =
    useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /* ⭐ NEW — week navigation */
  const [weekOffset, setWeekOffset] = useState(0)

  const searchParams = useQueryParams()
  const COMPANY_UID = searchParams.get("company_uid") || ""

  /* ==============================
     14 DAY WINDOW (7 DAY VIEW)
  ============================== */

  const generateTwoWeekDates = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const dates: Date[] = []

    for (let i = 0; i < 30; i++) {
      const d = new Date(today)
      d.setDate(today.getDate() + i)

      // skip Sundays (same behavior)
      if (d.getDay() !== 0) dates.push(d)
    }

    return dates
  }

  const allDates = generateTwoWeekDates()

  const visibleDates = allDates.slice(
    weekOffset * 7,
    weekOffset * 7 + 7
  )

  const nextWeek = () => {
    if ((weekOffset + 1) * 7 < allDates.length) {
      setWeekOffset((w) => w + 1)
    }
  }

  const prevWeek = () => {
    if(weekOffset > 0) {
      setWeekOffset((w) => w - 1)
    }
  }

  /* ==============================
     API FETCH
  ============================== */

  const fetchAvailability = async (date: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `${ASSISTED_SCHEDULING_WEBHOOK}?date=${date}&serviceType=${formData.serviceType}&company_uid=${COMPANY_UID}`
      )

      if (!response.ok) throw new Error("Failed to fetch availability")

      const data: ApiResponse = await response.json()

      if (!data.success) throw new Error(data.message)

      setAvailabilityData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)

    const dateString = date.toISOString().split("T")[0]

    onUpdateFormData("selectedDate", dateString)
    onUpdateFormData("selectedUser", "")
    onUpdateFormData("selectedSlot", "")

    fetchAvailability(dateString)
  }

  const handleUserSelect = (userId: string) => {
    onUpdateFormData("selectedUser", userId)
    onUpdateFormData("selectedSlot", "")
  }

  const handleSlotSelect = (slot: {
    display: string
    original: TimeSlot
  }) => {
    onUpdateFormData("selectedSlot", slot.display)
    onUpdateFormData("start_time", slot.original.start_time)
    onUpdateFormData("end_time", slot.original.end_time)
  }

  /* ==============================
     TRANSFORM API DATA
  ============================== */

  const transformApiDataToUserSlots = (): UserSlot[] => {
    if (!availabilityData?.data) return []

    const selectedDateData =
      availabilityData.data.availability.find(
        (item) => item.date === formData.selectedDate
      )

    if (!selectedDateData || selectedDateData.slots.length === 0)
      return []

    const userSlotMap = new Map<
      string,
      { user: ApiUser; slots: any[] }
    >()

    const parseUTC = (d: string) =>
      new Date(d.replace(" ", "T") + "Z")

    selectedDateData.slots.forEach((slot) => {
      const timeRange = `${parseUTC(
        slot.start_time
      ).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: "America/New_York",
      })} - ${parseUTC(
        slot.end_time
      ).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: "America/New_York",
      })}`

      slot.users.forEach((userId) => {
        const user = availabilityData.data.users.find(
          (u) => u.user_uid === userId
        )

        if (!user) return

        if (!userSlotMap.has(userId)) {
          userSlotMap.set(userId, { user, slots: [] })
        }

        userSlotMap.get(userId)!.slots.push({
          display: timeRange,
          original: slot,
        })
      })
    })

    return Array.from(userSlotMap.values()).map(
      ({ user, slots }) => ({
        id: user.user_uid,
        name: `${user.first_name} ${user.last_name}`,
        avatar: user.profile_picture,
        description: user.bio || "",
        slots,
      })
    )
  }

  const userSlots = transformApiDataToUserSlots()

  const selectedUser = userSlots.find(
    (u) => u.id === formData.selectedUser
  )

  /* ==============================
     UI
  ============================== */

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      timeZone: "America/New_York",
    })

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* HEADER */}
      <div className="text-center">
        <Calendar className="mx-auto w-12 h-12 mb-4 text-green-500" />
        <h2 className="text-xl font-semibold">
          Select Date & Professional
        </h2>
      </div>

      {/* ⭐ WEEKLY CALENDAR */}
      <div>
        <h3 className="text-lg font-medium mb-4">Select Date</h3>

        <div className="flex items-center gap-3">
          <button
            onClick={prevWeek}
            disabled={weekOffset === 0}
            className="px-3 py-2 border rounded-lg disabled:opacity-40"
          >
            ←
          </button>

          <div className="flex gap-3 flex-1 overflow-hidden">
            {visibleDates.map((date) => {
              const isSelected =
                selectedDate &&
                date.toDateString() ===
                  selectedDate.toDateString()

              return (
                <button
                  key={date.toISOString()}
                  onClick={() => handleDateSelect(date)}
                  className={`min-w-[120px] p-3 rounded-xl border transition ${
                    isSelected
                      ? "bg-green-600 text-white border-green-600"
                      : "bg-white border-gray-300 hover:bg-green-50"
                  }`}
                >
                  <div className="text-xs">
                    {date.toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>

                  <div className="text-xl font-semibold mt-1">
                    {date.getDate()}
                  </div>
                </button>
              )
            })}
          </div>

          <button
            onClick={nextWeek}
            disabled={(weekOffset + 1) * 7 >= allDates.length}
            className="px-3 py-2 border rounded-lg disabled:opacity-40"
          >
            →
          </button>
        </div>
      </div>

      {/* PROFESSIONALS */}
      {selectedDate && (
        <div>
          <h3 className="text-lg font-medium mb-4">
            <User className="inline w-5 h-5 mr-2" />
            Available Professionals for {formatDate(selectedDate)}
          </h3>

          {loading && <p>Loading availability...</p>}
          {error && <p className="text-red-600">{error}</p>}

          {!loading &&
            userSlots.map((user) => (
              <div
                key={user.id}
                className="border rounded-lg p-4 mb-4"
              >
                <h4 className="font-medium">{user.name}</h4>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-3">
               {user.slots.map((slot, i) => {
  const isSelected =
    formData.selectedSlot === slot.display &&
    formData.selectedUser === user.id

  return (
    <button
      key={i}
      onClick={() => {
        handleUserSelect(user.id)
        handleSlotSelect(slot)
      }}
      className={`p-2 border rounded transition
        ${
          isSelected
            ? "bg-green-600 text-white border-green-600"
            : "hover:bg-green-50 border-gray-300"
        }
      `}
    >
      {slot.display}
    </button>
  )
})}
                </div>
              </div>
            ))}
        </div>
      )}

      {/* SUMMARY */}
      {formData.selectedSlot && selectedUser && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h4 className="font-medium mb-3">Booking Summary</h4>

          <p>
            <strong>Name:</strong> {formData.firstName}{" "}
            {formData.lastName}
          </p>
          <p><strong>Phone:</strong> {formData.phone}</p>
          <p><strong>Email:</strong> {formData.email}</p>
          <p><strong>Service:</strong> {formData.serviceType}</p>
          <p><strong>Date:</strong> {formatDate(selectedDate!)}</p>
          <p><strong>Professional:</strong> {selectedUser.name}</p>
          <p><strong>Time:</strong> {formData.selectedSlot}</p>
        </div>
      )}
    </div>
  )
}