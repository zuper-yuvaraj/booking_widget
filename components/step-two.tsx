"use client"

import { User, ChevronDown, CalendarDays } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import PhoneInput from "react-phone-number-input/input"
import { isValidPhoneNumber } from "react-phone-number-input"
import { isValidEmail } from "@/lib/utils"
import type { StepProps } from "@/types/booking"
import { COMPANY_NAME, PRIVACY_POLICY, TERMS_OF_SERVICE } from "@/configs"

const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
const labelClass = "block text-sm font-medium text-gray-700 mb-2"

const SERVICES = [
  "Residential Roofing",
  "Commercial Roofing",
  "Commercial Roof Maintenance",
  "Tile Roofing",
  "Shingle Roofing",
  "Foam Roofing",
  "Flat Roofing",
  "Roof Repair",
  "Roof Replacement",
  "Insurance Claims Management",
  "Storm Damage Roof Inspection",
  "Residential Roof Inspection",
  "Commercial Roof Inspection",
  "Residential real-estate presale roof inspection"
]

const SERVICE_CHILD_KEYS: Record<string, string[]> = {
 
}

type FieldType = "yesno" | "text" | "date" | "textarea"

const FIELD_TYPES: Record<string, FieldType> = {
 
}

function YesNoSelect({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={inputClass}
      aria-label={label}
    >
      <option value="">Select...</option>
      <option value="Yes">Yes</option>
      <option value="No">No</option>
    </select>
  )
}

function ServicesMultiSelect({ selected, onChange }: { selected: string[]; onChange: (v: string[]) => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const toggle = (service: string) => {
    if (selected.includes(service)) {
      onChange(selected.filter(s => s !== service))
    } else {
      onChange([...selected, service])
    }
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-left flex justify-between items-center bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none"
      >
        <span className={`text-sm truncate ${selected.length ? "text-gray-900" : "text-gray-400"}`}>
          {selected.length ? selected.join(", ") : "Select services..."}
        </span>
        <ChevronDown className={`w-4 h-4 ml-2 shrink-0 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && (
        <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-60 overflow-auto">
          {SERVICES.map(service => (
            <label
              key={service}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-700"
            >
              <input
                type="checkbox"
                checked={selected.includes(service)}
                onChange={() => toggle(service)}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              {service}
            </label>
          ))}
        </div>
      )}
    </div>
  )
}

const ISSUE_TYPES = ["Leak", "Broken Materials", "Ponding Water", "Cracks / Foam Damage", "Storm Damage", "General Wear", "Other"]

function IssueTypeMultiSelect({ selected, onChange }: { selected: string[]; onChange: (v: string[]) => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const toggle = (item: string) => {
    if (selected.includes(item)) {
      onChange(selected.filter(s => s !== item))
    } else {
      onChange([...selected, item])
    }
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-left flex justify-between items-center bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none"
      >
        <span className={`text-sm truncate ${selected.length ? "text-gray-900" : "text-gray-400"}`}>
          {selected.length ? selected.join(", ") : "Select all that apply"}
        </span>
        <ChevronDown className={`w-4 h-4 ml-2 shrink-0 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && (
        <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-60 overflow-auto">
          {ISSUE_TYPES.map(item => (
            <label
              key={item}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-700"
            >
              <input
                type="checkbox"
                checked={selected.includes(item)}
                onChange={() => toggle(item)}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              {item}
            </label>
          ))}
        </div>
      )}
    </div>
  )
}

export default function StepTwo({ formData, onUpdateFormData, onNext, isValid }: StepProps) {
  const firstNameInputRef = useRef<HTMLInputElement>(null)
  const dateInputRef = useRef<HTMLInputElement>(null)
  const cf = formData.custom_fields || {}
  const selectedServices = cf["SERVICES"]
    ? cf["SERVICES"].split(",").map(s => s.trim()).filter(Boolean)
    : []

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
    const updated = { ...cf }
    if (value) {
      updated[key] = value
    } else {
      delete updated[key]
    }
    onUpdateFormData("custom_fields", updated)
  }

  const handleServicesChange = (services: string[]) => {
    const updated = { ...cf }
    // Clear child fields for any deselected services
    SERVICES.forEach(service => {
      if (!services.includes(service)) {
        SERVICE_CHILD_KEYS[service]?.forEach(key => delete updated[key])
      }
    })
    if (services.length > 0) {
      updated["SERVICES"] = services.join(", ")
    } else {
      delete updated["SERVICES"]
    }
    onUpdateFormData("custom_fields", updated)
  }

  const renderSubField = (fieldKey: string) => {
    const type = FIELD_TYPES[fieldKey] || "text"
    const value = cf[fieldKey] || ""
    return (
      <div key={fieldKey}>
        <label className={labelClass}>{fieldKey}</label>
        {type === "yesno" && (
          <YesNoSelect label={fieldKey} value={value} onChange={(v) => updateCustomField(fieldKey, v)} />
        )}
        {type === "date" && (
          <input
            type="date"
            value={value}
            onChange={(e) => updateCustomField(fieldKey, e.target.value)}
            className={inputClass}
          />
        )}
        {type === "textarea" && (
          <textarea
            value={value}
            onChange={(e) => updateCustomField(fieldKey, e.target.value)}
            className={`${inputClass} resize-none`}
            rows={3}
          />
        )}
        {type === "text" && (
          <input
            type="text"
            value={value}
            onChange={(e) => updateCustomField(fieldKey, e.target.value)}
            className={inputClass}
          />
        )}
      </div>
    )
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

        {/* Preferred Date */}
        <div>
          <label className={labelClass}>
            Preferred Date <span className="text-red-500">*</span>
          </label>
          <button
            type="button"
            onClick={() => dateInputRef.current?.showPicker()}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white flex items-center justify-between text-sm"
          >
            <span className={formData.preferredDate ? "text-gray-900" : "text-gray-400"}>
              {formData.preferredDate
                ? new Date(formData.preferredDate + "T00:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
                : "Select a date"}
            </span>
            <CalendarDays className="w-4 h-4 text-gray-400 shrink-0" />
          </button>
          <input
            ref={dateInputRef}
            type="date"
            value={formData.preferredDate}
            onChange={(e) => onUpdateFormData("preferredDate", e.target.value)}
            onKeyPress={handleKeyPress}
            className="sr-only"
          />
        </div>

        {/* Preferred Time Slot */}
        <div>
          <label className={labelClass}>
            Preferred Time Slot <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.preferredTimeSlot}
            onChange={(e) => onUpdateFormData("preferredTimeSlot", e.target.value)}
            className={inputClass}
          >
            <option value="">Select a time slot...</option>
            {[
              "8:00 AM - 10:00 AM",
              "10:00 AM - 12:00 PM",
              "12:00 PM - 2:00 PM",
              "2:00 PM - 4:00 PM",
            ].map((slot) => (
              <option key={slot} value={slot}>{slot}</option>
            ))}
          </select>
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

        {/* Services multi-select */}
        <div>
          <label className={labelClass}>SERVICES</label>
          <ServicesMultiSelect selected={selectedServices} onChange={handleServicesChange} />
        </div>

        {/* Sub-questions for each selected service */}
        {selectedServices.flatMap(service =>
          (SERVICE_CHILD_KEYS[service] || []).map(key => renderSubField(key))
        )}

        {/* Property Type */}
        <div>
          <label className={labelClass}>What type of property is this?</label>
          <select
            value={cf["Property Type"] || ""}
            onChange={(e) => {
              const updated = { ...cf, "Property Type": e.target.value }
              delete updated["Roof Type"]
              onUpdateFormData("custom_fields", updated)
            }}
            className={inputClass}
          >
            <option value="" disabled>This helps us send the right roofing specialist.</option>
            <option value="Residential">Residential</option>
            <option value="Commercial">Commercial</option>
          </select>
        </div>

        {/* Roof Type — Residential */}
        {cf["Property Type"] === "Residential" && (
          <div>
            <label className={labelClass}>What type of roof do you have?</label>
            <select
              value={cf["Roof Type"] || ""}
              onChange={(e) => updateCustomField("Roof Type", e.target.value)}
              className={inputClass}
            >
              <option value="" disabled>Not sure? No problem — we'll figure it out for you.</option>
              {["Tile", "Shingle", "Foam", "Flat", "Not Sure"].map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        )}

        {/* Roof Type — Commercial */}
        {cf["Property Type"] === "Commercial" && (
          <div>
            <label className={labelClass}>What type of roofing system is on your building?</label>
            <select
              value={cf["Roof Type"] || ""}
              onChange={(e) => updateCustomField("Roof Type", e.target.value)}
              className={inputClass}
            >
              <option value="" disabled>Not sure? No problem — we'll figure it out for you.</option>
              {["Flat", "Foam", "TPO", "Modified Bitumen", "Metal", "Shingle", "Tile", "Not Sure"].map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        )}

        {/* Service Type */}
        <div>
          <label className={labelClass}>What do you need help with?</label>
          <select
            value={cf["Service Type"] || ""}
            onChange={(e) => {
              const updated = { ...cf, "Service Type": e.target.value }
              delete updated["Issue Type"]
              delete updated["Roof Age"]
              delete updated["Financing Interest"]
              delete updated["Reason"]
              onUpdateFormData("custom_fields", updated)
            }}
            className={inputClass}
          >
            <option value="" disabled>Select the option that best fits — we'll handle the rest.</option>
            {["Roof Repair", "Roof Replacement", "Inspection Only", "Not Sure"].map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Issue Type — Roof Repair (multi-select dropdown) */}
        {cf["Service Type"] === "Roof Repair" && (
          <div>
            <label className={labelClass}>What issue are you experiencing?</label>
            <IssueTypeMultiSelect
              selected={(cf["Issue Type"] || "").split(",").map(s => s.trim()).filter(Boolean)}
              onChange={(vals) => updateCustomField("Issue Type", vals.join(", "))}
            />
          </div>
        )}

        {/* Roof Age — Roof Replacement */}
        {cf["Service Type"] === "Roof Replacement" && (
          <div>
            <label className={labelClass}>How old is your current roof?</label>
            <select
              value={cf["Roof Age"] || ""}
              onChange={(e) => updateCustomField("Roof Age", e.target.value)}
              className={inputClass}
            >
              <option value="" disabled>Select roof age...</option>
              {["0–5 yrs", "5–10 yrs", "10–20 yrs", "20+ yrs", "Not Sure"].map((age) => (
                <option key={age} value={age}>{age}</option>
              ))}
            </select>
          </div>
        )}

        {/* Financing Interest — Roof Replacement */}
        {cf["Service Type"] === "Roof Replacement" && (
          <div>
            <label className={labelClass}>Would you like to see financing options?</label>
            <select
              value={cf["Financing Interest"] || ""}
              onChange={(e) => updateCustomField("Financing Interest", e.target.value)}
              className={inputClass}
            >
              <option value="" disabled>We offer flexible payment options if needed.</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
        )}

        {/* Reason — Inspection Only */}
        {cf["Service Type"] === "Inspection Only" && (
          <div>
            <label className={labelClass}>What prompted your inspection?</label>
            <select
              value={cf["Reason"] || ""}
              onChange={(e) => updateCustomField("Reason", e.target.value)}
              className={inputClass}
            >
              <option value="" disabled>Select a reason...</option>
              {["Buying/Selling", "Storm Damage", "Maintenance", "Insurance Requirement", "Peace of Mind"].map((reason) => (
                <option key={reason} value={reason}>{reason}</option>
              ))}
            </select>
          </div>
        )}

        {/* Storm Damage */}
        <div>
          <label className={labelClass}>Has your property been hit by a recent storm?</label>
          <select
            value={cf["Storm Damage"] || ""}
            onChange={(e) => {
              const updated = { ...cf, "Storm Damage": e.target.value }
              if (!["Yes", "Not Sure"].includes(e.target.value)) {
                delete updated["Storm Type"]
              }
              onUpdateFormData("custom_fields", updated)
            }}
            className={inputClass}
          >
            <option value="" disabled>Hail and wind damage is often not visible from the ground.</option>
            {["Yes", "No", "Not Sure"].map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        {/* Storm Type — dependent on Storm Damage: Yes or Not Sure */}
        {["Yes", "Not Sure"].includes(cf["Storm Damage"] || "") && (
          <div>
            <label className={labelClass}>Storm Type</label>
            <select
              value={cf["Storm Type"] || ""}
              onChange={(e) => updateCustomField("Storm Type", e.target.value)}
              className={inputClass}
            >
              <option value="" disabled>Select storm type...</option>
              {["Hail", "Wind", "Monsoon", "Other"].map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        )}

        {/* Insurance */}
        <div>
          <label className={labelClass}>Are you working with insurance?</label>
          <select
            value={cf["Insurance Qualification"] || ""}
            onChange={(e) => updateCustomField("Insurance Qualification", e.target.value)}
            className={inputClass}
          >
            <option value="" disabled>We help homeowners get approved for roof replacements every day.</option>
            {[
              "Yes – Claim Filed",
              "No – Need Help Filing",
              "Not Sure – Open to seeing if I qualify",
              "No – Just Exploring Options",
            ].map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        {/* Timeline */}
        <div>
          <label className={labelClass}>How soon do you need service?</label>
          <select
            value={cf["Urgency"] || ""}
            onChange={(e) => updateCustomField("Urgency", e.target.value)}
            className={inputClass}
          >
            <option value="" disabled>We prioritize emergency leaks and storm damage.</option>
            {["ASAP (Emergency)", "1–2 Weeks", "30 Days", "Just Researching"].map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        {/* Additional Notes */}
        <div>
          <label className={labelClass}>Anything else we should know?</label>
          <textarea
            value={cf["Additional Note"] || ""}
            onChange={(e) => updateCustomField("Additional Note", e.target.value)}
            className={`${inputClass} resize-none`}
            rows={4}
            placeholder="Anything else we should know?"
          />
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
      </div>
    </div>
  )
}
