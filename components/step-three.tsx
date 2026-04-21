"use client"

import { useState } from "react"
import { ChevronLeft } from "lucide-react"
import type { StepProps } from "@/types/booking"

type FlowStep =
  | "main"
  | "diagnostic-system"
  | "tuneup-system"
  | "tuneup-heating-type"
  | "tuneup-cooling-type"
  | "tuneup-waterheater-type"
  | "newsystem-replace"

export default function StepThree({ formData, onUpdateFormData }: StepProps) {
  const [flowStep, setFlowStep] = useState<FlowStep>("main")
  const [mainChoice, setMainChoice] = useState<string | null>(null)
  const [mainChoiceLabel, setMainChoiceLabel] = useState<string | null>(null)
  const [diagnosticSystem, setDiagnosticSystem] = useState<string | null>(null)
  const [tuneUpSystem, setTuneUpSystem] = useState<string | null>(null)
  const [tuneUpSystemLabel, setTuneUpSystemLabel] = useState<string | null>(null)
  const [newSystemOption, setNewSystemOption] = useState<string | null>(null)

  const buildNotes = (lines: string[]) => lines.map((line) => `<p>${line}</p>`).join("")

  const handleMainSelect = (choice: string, label: string) => {
    setMainChoice(choice)
    setMainChoiceLabel(label)
    if (choice === "diagnostic") {
      onUpdateFormData("serviceType", "")
      onUpdateFormData("notes", "")
      setDiagnosticSystem(null)
      setFlowStep("diagnostic-system")
    } else if (choice === "tuneup") {
      onUpdateFormData("serviceType", "")
      onUpdateFormData("notes", "")
      setTuneUpSystem(null)
      setTuneUpSystemLabel(null)
      setFlowStep("tuneup-system")
    } else if (choice === "newsystem") {
      onUpdateFormData("serviceType", "")
      onUpdateFormData("notes", "")
      setNewSystemOption(null)
      setFlowStep("newsystem-replace")
    }
  }

  const handleDiagnosticSystemSelect = (system: string, label: string) => {
    setDiagnosticSystem(system)
    const notes = buildNotes([
      `What are you looking to schedule?: ${mainChoiceLabel}`,
      `What system is this for?: ${label}`,
    ])
    onUpdateFormData("serviceType", "Diagnostic")
    onUpdateFormData("notes", notes)
  }

  const handleTuneUpSystemSelect = (system: string, label: string) => {
    setTuneUpSystem(system)
    setTuneUpSystemLabel(label)
    if (system === "heating") {
      onUpdateFormData("serviceType", "")
      onUpdateFormData("notes", "")
      setFlowStep("tuneup-heating-type")
    } else if (system === "cooling") {
      onUpdateFormData("serviceType", "")
      onUpdateFormData("notes", "")
      setFlowStep("tuneup-cooling-type")
    } else if (system === "ductless") {
      const notes = buildNotes([
        `What are you looking to schedule?: ${mainChoiceLabel}`,
        `What system is this for?: ${label}`,
      ])
      onUpdateFormData("serviceType", "DuctlessMiniSplit-Maint/TU")
      onUpdateFormData("notes", notes)
    } else if (system === "waterheater") {
      onUpdateFormData("serviceType", "")
      onUpdateFormData("notes", "")
      setFlowStep("tuneup-waterheater-type")
    }
  }

  const heatingServiceMap: Record<string, string> = {
    furnace: "Furnace - Maint/Tune-Up",
    heatpump: "Heat Pump - Maint/TuneUp",
    notsure: "Diagnostic",
  }

  const coolingServiceMap: Record<string, string> = {
    airconditioner: "Air-Con - Maint/Tune Up",
    heatpump: "Heat Pump - Maint/TuneUp",
    notsure: "Diagnostic",
  }

  const waterHeaterServiceMap: Record<string, string> = {
    standardtank: "WaterHeater(Tank) - Maint",
    tankless: "Tankless WH - Maintenance",
    notsure: "Diagnostic",
  }

  const handleHeatingTypeSelect = (typeLabel: string, serviceType: string) => {
    const notes = buildNotes([
      `What are you looking to schedule?: ${mainChoiceLabel}`,
      `What system is this for?: ${tuneUpSystemLabel}`,
      `Which type of heating system do you have?: ${typeLabel}`,
    ])
    onUpdateFormData("serviceType", serviceType)
    onUpdateFormData("notes", notes)
  }

  const handleCoolingTypeSelect = (typeLabel: string, serviceType: string) => {
    const notes = buildNotes([
      `What are you looking to schedule?: ${mainChoiceLabel}`,
      `What system is this for?: ${tuneUpSystemLabel}`,
      `Which type of cooling system do you have?: ${typeLabel}`,
    ])
    onUpdateFormData("serviceType", serviceType)
    onUpdateFormData("notes", notes)
  }

  const handleWaterHeaterTypeSelect = (typeLabel: string, serviceType: string) => {
    const notes = buildNotes([
      `What are you looking to schedule?: ${mainChoiceLabel}`,
      `What system is this for?: ${tuneUpSystemLabel}`,
      `Which type of water heater do you have?: ${typeLabel}`,
    ])
    onUpdateFormData("serviceType", serviceType)
    onUpdateFormData("notes", notes)
  }

  const handleNewSystemSelect = (optionId: string, optionLabel: string) => {
    setNewSystemOption(optionId)
    const notes = buildNotes([
      `What are you looking to schedule?: ${mainChoiceLabel}`,
      `What system are you looking to replace or install?: ${optionLabel}`,
    ])
    onUpdateFormData("serviceType", "New System Exact Quote")
    onUpdateFormData("notes", notes)
  }

  const goBack = () => {
    onUpdateFormData("serviceType", "")
    onUpdateFormData("notes", "")
    if (flowStep === "diagnostic-system") {
      setFlowStep("main")
      setDiagnosticSystem(null)
    } else if (flowStep === "tuneup-system") {
      setFlowStep("main")
      setTuneUpSystem(null)
      setTuneUpSystemLabel(null)
    } else if (
      flowStep === "tuneup-heating-type" ||
      flowStep === "tuneup-cooling-type" ||
      flowStep === "tuneup-waterheater-type"
    ) {
      setFlowStep("tuneup-system")
      setTuneUpSystem(null)
      setTuneUpSystemLabel(null)
    } else if (flowStep === "newsystem-replace") {
      setFlowStep("main")
      setNewSystemOption(null)
    }
  }

  function SelectionCard({
    title,
    description,
    price,
    isSelected,
    onClick,
  }: {
    title: string
    description: string
    price?: string
    isSelected: boolean
    onClick: () => void
  }) {
    return (
      <div
        onClick={onClick}
        className={`relative cursor-pointer rounded-lg border-2 p-6 transition-all duration-200 hover:shadow-md ${
          isSelected
            ? "border-green-500 bg-green-50 shadow-md"
            : "border-gray-200 bg-white hover:border-gray-300"
        }`}
      >
        {isSelected && (
          <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
        <h3 className={`text-lg font-semibold mb-2 ${isSelected ? "text-green-900" : "text-gray-900"}`}>
          {title}
        </h3>
        <p className={`text-sm ${isSelected ? "text-green-700" : "text-gray-600"}`}>
          {description}
        </p>
        {price !== undefined && (
          <p className={`mt-3 text-base font-bold ${isSelected ? "text-green-800" : "text-gray-800"}`}>
            {price}
          </p>
        )}
      </div>
    )
  }

  function BackButton() {
    return (
      <button
        onClick={goBack}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Back
      </button>
    )
  }

  // ── Main screen ──────────────────────────────────────────────────────────────
  if (flowStep === "main") {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold text-gray-900">What are you looking to schedule?</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SelectionCard
            title="Diagnostic Visit"
            description="We inspect the problem, find the cause, explain what's wrong, and give you your exact repair quote."
            price="$99"
            isSelected={mainChoice === "diagnostic"}
            onClick={() => handleMainSelect("diagnostic", "Diagnostic Visit")}
          />
          <SelectionCard
            title="Tune-Up"
            description="We clean, inspect, and test your system to help it run better and stay on track with maintenance."
            price="$129"
            isSelected={mainChoice === "tuneup"}
            onClick={() => handleMainSelect("tuneup", "Tune-Up")}
          />
          <SelectionCard
            title="New System Exact Quote"
            description="We evaluate your home, explain your options, and give you a free exact quote."
            price="Free"
            isSelected={mainChoice === "newsystem"}
            onClick={() => handleMainSelect("newsystem", "New System Exact Quote")}
          />
        </div>
      </div>
    )
  }

  // ── Diagnostic: What system is this for? ─────────────────────────────────────
  if (flowStep === "diagnostic-system") {
    const systems = [
      { id: "heating", title: "Heating", description: "For heating problems like no heat, weak heat, or uneven comfort." },
      { id: "cooling", title: "Cooling", description: "For cooling problems like no AC, weak airflow, or warm air." },
      { id: "ductless", title: "Ductless Mini-Split", description: "For ductless zoned systems that are not heating or cooling properly." },
      { id: "waterheater", title: "Water Heater", description: "For no hot water, low hot water, leaks, or other water heater issues." },
      { id: "notsure", title: "Not Sure", description: "Choose this if you are not sure what system is causing the problem." },
    ]

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <BackButton />
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold text-gray-900">What system is this for?</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {systems.map((system) => (
            <SelectionCard
              key={system.id}
              title={system.title}
              description={system.description}
              isSelected={diagnosticSystem === system.id}
              onClick={() => handleDiagnosticSystemSelect(system.id, system.title)}
            />
          ))}
        </div>
      </div>
    )
  }

  // ── Tune-Up: What system is this for? ────────────────────────────────────────
  if (flowStep === "tuneup-system") {
    const systems = [
      { id: "heating", title: "Heating", description: "Seasonal maintenance for your home heating system." },
      { id: "cooling", title: "Cooling", description: "Seasonal maintenance for your air conditioning system." },
      { id: "ductless", title: "Ductless Mini-Split", description: "Routine maintenance for your ductless zoned comfort system." },
      { id: "waterheater", title: "Water Heater", description: "Maintenance for your standard or tankless water heater." },
    ]

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <BackButton />
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold text-gray-900">What system is this for?</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {systems.map((system) => (
            <SelectionCard
              key={system.id}
              title={system.title}
              description={system.description}
              isSelected={tuneUpSystem === system.id}
              onClick={() => handleTuneUpSystemSelect(system.id, system.title)}
            />
          ))}
        </div>
      </div>
    )
  }

  // ── Tune-Up > Heating ────────────────────────────────────────────────────────
  if (flowStep === "tuneup-heating-type") {
    const types = [
      { id: "furnace", title: "Furnace", description: "Maintenance for a gas or electric furnace." },
      { id: "heatpump", title: "Heat Pump", description: "Maintenance for a heat pump system used for home heating." },
      { id: "notsure", title: "Not Sure", description: "If you are not sure, we will schedule a diagnostic visit instead." },
    ]

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <BackButton />
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold text-gray-900">Which type of heating system do you have?</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {types.map((type) => (
            <SelectionCard
              key={type.id}
              title={type.title}
              description={type.description}
              isSelected={formData.serviceType === heatingServiceMap[type.id]}
              onClick={() => handleHeatingTypeSelect(type.title, heatingServiceMap[type.id])}
            />
          ))}
        </div>
      </div>
    )
  }

  // ── Tune-Up > Cooling ────────────────────────────────────────────────────────
  if (flowStep === "tuneup-cooling-type") {
    const types = [
      { id: "airconditioner", title: "Air Conditioner", description: "Maintenance for a central air conditioning system." },
      { id: "heatpump", title: "Heat Pump", description: "Maintenance for a heat pump system used for home cooling." },
      { id: "notsure", title: "Not Sure", description: "If you are not sure, we will schedule a diagnostic visit instead." },
    ]

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <BackButton />
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold text-gray-900">Which type of cooling system do you have?</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {types.map((type) => (
            <SelectionCard
              key={type.id}
              title={type.title}
              description={type.description}
              isSelected={formData.serviceType === coolingServiceMap[type.id]}
              onClick={() => handleCoolingTypeSelect(type.title, coolingServiceMap[type.id])}
            />
          ))}
        </div>
      </div>
    )
  }

  // ── Tune-Up > Water Heater ───────────────────────────────────────────────────
  if (flowStep === "tuneup-waterheater-type") {
    const types = [
      { id: "standardtank", title: "Standard Tank Water Heater", description: "Maintenance for a traditional tank-style water heater." },
      { id: "tankless", title: "Tankless Water Heater", description: "Maintenance for a tankless water heater." },
      { id: "notsure", title: "Not Sure", description: "If you are not sure, we will schedule a diagnostic visit instead." },
    ]

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <BackButton />
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold text-gray-900">Which type of water heater do you have?</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {types.map((type) => (
            <SelectionCard
              key={type.id}
              title={type.title}
              description={type.description}
              isSelected={formData.serviceType === waterHeaterServiceMap[type.id]}
              onClick={() => handleWaterHeaterTypeSelect(type.title, waterHeaterServiceMap[type.id])}
            />
          ))}
        </div>
      </div>
    )
  }

  // ── New System: What system to replace or install? ───────────────────────────
  if (flowStep === "newsystem-replace") {
    const systems = [
      { id: "heating", title: "Heating System", description: "For replacing or installing a furnace, heat pump, or other home heating system." },
      { id: "cooling", title: "Cooling System", description: "For replacing or installing an air conditioner or other home cooling system." },
      { id: "fullhvac", title: "Full HVAC System", description: "For replacing both your heating and cooling system together." },
      { id: "ductless", title: "Ductless Mini-Split", description: "For ductless zoned systems that are not heating or cooling properly." },
      { id: "waterheater", title: "Water Heater", description: "For no hot water, low hot water, leaks, or other water heater issues." },
      { id: "notsure", title: "Not Sure", description: "Choose this if you want help figuring out the best system for your home." },
    ]

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <BackButton />
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold text-gray-900">What system are you looking to replace or install?</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {systems.map((system) => (
            <SelectionCard
              key={system.id}
              title={system.title}
              description={system.description}
              isSelected={newSystemOption === system.id}
              onClick={() => handleNewSystemSelect(system.id, system.title)}
            />
          ))}
        </div>
      </div>
    )
  }

  return null
}
