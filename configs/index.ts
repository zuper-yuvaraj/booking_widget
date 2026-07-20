import {
  Home,
  Search,
  Wrench,
  ClipboardCheck,
  Droplets,
  Layers,
  Hammer,
  Box,
  Sparkles,
  Lightbulb,
  Wind,
  type LucideIcon,
} from "lucide-react"

export const COMPANY_NAME = "Equity Roofing"
export const TERMS_OF_SERVICE = 'https://www.equityroofs.com/terms-and-conditions'
export const GET_SERVICES_WEBHOOK = "https://internalwf.zuper.co/webhook/5b866c62-a159-4fb6-b3cc-85ea2d0d9eff"
export const PRIVACY_POLICY = 'https://www.equityroofs.com/privacy-policy'
export const ASSISTED_SCHEDULING_WEBHOOK = "https://internalwf.zuper.co/webhook/391a245b-d74e-43c1-bf61-96910df436b1"
export const CREATE_BOOKING_WEBHOOK = "https://internalwf.zuper.co/webhook/5274c59a-f559-4d25-8e56-da2302590c9f"

export interface ServiceType {
  id: string
  title: string
  description: string
  icon: LucideIcon
}

export const SERVICE_TYPES: ServiceType[] = [
  {
    id: "roof_inspection",
    title: "Roof Inspection",
    description: "Thorough assessment of your roof's condition",
    icon: Search,
  },
  {
    id: "roof_replacement",
    title: "Roof Replacement",
    description: "Complete roof replacement for your home",
    icon: Home,
  },
  {
    id: "roof_repair",
    title: "Roof Repair",
    description: "Professional roof repair service",
    icon: Wrench,
  },
  {
    id: "insurance_real_estate_inspection",
    title: "Insurance/Real estate Inspection",
    description: "Inspection for insurance or real estate needs",
    icon: ClipboardCheck,
  },
  {
    id: "gutters_installation",
    title: "Gutters",
    description: "Gutter installation and maintenance",
    icon: Droplets,
  },
  {
    id: "siding_replacement",
    title: "Siding Replacement",
    description: "Full siding replacement service",
    icon: Layers,
  },
  {
    id: "siding_repair",
    title: "Siding Repair",
    description: "Professional siding repair service",
    icon: Hammer,
  },
  {
    id: "soffit_fascia_repair",
    title: "Soffit & Fascia",
    description: "Soffit and fascia repair or replacement",
    icon: Box,
  },
  {
    id: "roof_rejuvenation",
    title: "Roof Rejuvenation",
    description: "Extend the life of your existing roof",
    icon: Sparkles,
  },
  {
    id: "holiday_lights_installation",
    title: "Holiday Lights",
    description: "Professional holiday light installation",
    icon: Lightbulb,
  },
  {
    id: "ventilation_inspection",
    title: "Ventilation Inspection",
    description: "Assessment of your roof ventilation system",
    icon: Wind,
  },
]

export function getServiceTitle(serviceId: string): string {
  return SERVICE_TYPES.find((s) => s.id === serviceId)?.title ?? serviceId
}