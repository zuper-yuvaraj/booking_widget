"use client"
import { useState, useRef, useMemo } from "react"
import { Calendar, User } from "lucide-react"
import type { StepProps, UserSlot, ApiResponse, ApiUser, TimeSlot } from "@/types/booking"
import { ASSISTED_SCHEDULING_WEBHOOK } from "@/configs"
import { useQueryParams } from "@/hooks/query-params.hooks"

export default function StepFour({ formData, onUpdateFormData }: StepProps) {
  const [selectedDate, setSelectedDate] = useState(
    formData.selectedDate ? new Date(formData.selectedDate) : null
  )
  const [availabilityData, setAvailabilityData] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const searchParams = useQueryParams()
  const COMPANY_UID = searchParams.get("company_uid") || ""

  /* ==============================
     DATE GENERATION (memoized)
  ============================== */
  const allDates = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const dates: Date[] = []
    for (let i = 0; i < 30; i++) {
      const d = new Date(today)
      d.setDate(today.getDate() + i)
      if (d.getDay() !== 0) dates.push(d)
    }
    return dates
  }, [])

  const scrollPrev = () => {
    scrollRef.current?.scrollBy({ left: -560, behavior: "smooth" })
  }

  const scrollNext = () => {
    scrollRef.current?.scrollBy({ left: 560, behavior: "smooth" })
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

  const handleSlotSelect = (slot: { display: string; original: TimeSlot }) => {
    onUpdateFormData("selectedSlot", slot.display)
    onUpdateFormData("start_time", slot.original.start_time)
    onUpdateFormData("end_time", slot.original.end_time)
  }

  /* ==============================
     TRANSFORM API DATA
  ============================== */
  const transformApiDataToUserSlots = (): UserSlot[] => {
    if (!availabilityData?.data) return []

    const selectedDateData = availabilityData.data.availability.find(
      (item) => item.date === formData.selectedDate
    )

    if (!selectedDateData || selectedDateData.slots.length === 0) return []

    const userSlotMap = new Map<string, { user: ApiUser; slots: any[] }>()
    const parseUTC = (d: string) => new Date(d.replace(" ", "T") + "Z")

    selectedDateData.slots.forEach((slot) => {
      const timeRange = `${parseUTC(slot.start_time).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: "America/New_York",
      })} - ${parseUTC(slot.end_time).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: "America/New_York",
      })}`

      slot.users.forEach((userId) => {
        const user = availabilityData.data.users.find((u) => u.user_uid === userId)
        if (!user) return
        if (!userSlotMap.has(userId)) {
          userSlotMap.set(userId, { user, slots: [] })
        }
        userSlotMap.get(userId)!.slots.push({ display: timeRange, original: slot })
      })
    })

    return Array.from(userSlotMap.values()).map(({ user, slots }) => ({
      id: user.user_uid,
      name: `${user.first_name} ${user.last_name}`,
      avatar: user.profile_picture,
      description: user.bio || "",
      slots,
    }))
  }

  const userSlots = transformApiDataToUserSlots()
  const selectedUser = userSlots.find((u) => u.id === formData.selectedUser)

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      timeZone: "America/New_York",
    })

  /* ==============================
     UI
  ============================== */
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h2 className="text-xl font-semibold">Select Date & Professional</h2>
      </div>

      {/* DATE SELECTOR */}
      <div className="space-y-2">
        <label className="text-sm font-medium flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Select Date
        </label>

        <div className="flex items-center gap-2">
          {/* Prev arrow — desktop only */}
          <button
            onClick={scrollPrev}
            className="hidden sm:block px-3 py-2 border rounded-lg"
          >
            ←
          </button>

          {/* Scrollable date strip — all 30 dates always rendered */}
          <div
            ref={scrollRef}
            className="flex gap-2 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-1 flex-1
                       scrollbar-hide sm:scrollbar-default"
          >
            {allDates.map((date) => {
              const isSelected =
                selectedDate &&
                date.toDateString() === selectedDate.toDateString()

              return (
                <button
                  key={date.toISOString()}
                  onClick={() => handleDateSelect(date)}
                  ref={(el) =>
                    isSelected &&
                    el?.scrollIntoView({ inline: "center", behavior: "smooth" })
                  }
                  className={`
                    min-w-[72px] sm:min-w-[110px] p-2 sm:p-3 rounded-xl border transition snap-start
                    ${
                      isSelected
                        ? "bg-green-600 text-white border-green-600"
                        : "bg-white border-gray-300 hover:bg-green-50"
                    }
                  `}
                >
                  <div className="text-xs">
                    {date.toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      
                    })}
                  </div>
                  <div className="text-lg font-bold">{date.getDate()}</div>
                </button>
              )
            })}
          </div>

          {/* Next arrow — desktop only */}
          <button
            onClick={scrollNext}
            className="hidden sm:block px-3 py-2 border rounded-lg"
          >
            →
          </button>
        </div>
      </div>

      {/* PROFESSIONALS */}
      {selectedDate && (
        <div className="space-y-4">
          <h3 className="font-medium">
            Available Professionals for {formatDate(selectedDate)}
          </h3>

          {loading && (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse rounded-xl border p-4 space-y-2">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="h-4 bg-gray-200 rounded w-3/4" />
                  ))}
                </div>
              ))}
            </div>
          )}

          {error && <div className="text-red-500 text-sm">{error}</div>}

          {!loading && userSlots.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p className="font-medium">No availability for this date</p>
              <p className="text-sm">Please select another day to continue booking.</p>
            </div>
          )}

          {!loading &&
            userSlots.map((user) => (
              <div key={user.id} className="border rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-3">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-500" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{user.name}</p>
                    {user.description && (
                      <p className="text-xs text-gray-500">{user.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
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
                        className={`p-2 border rounded transition ${
                          isSelected
                            ? "bg-green-600 text-white border-green-600"
                            : "hover:bg-green-50 border-gray-300"
                        }`}
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

      {/* STICKY SUMMARY */}
      {formData.selectedSlot && selectedUser && (
        <div className="rounded-xl border p-4 bg-green-50 space-y-1 text-sm">
          <p className="font-semibold">Booking Summary</p>
          <p>Name: {formData.firstName} {formData.lastName}</p>
          <p>Phone: {formData.phone}</p>
          <p>Email: {formData.email}</p>
          <p>Service: {formData.serviceType}</p>
          <p>Date: {formatDate(selectedDate!)}</p>
          <p>Professional: {selectedUser.name}</p>
          <p>Time: {formData.selectedSlot}</p>
        </div>
      )}
    </div>
  )
}