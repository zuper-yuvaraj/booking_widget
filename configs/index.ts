import { Sun, Wind, Snowflake, Battery, Wrench, Search, Sparkles, Home, ShieldCheck, Settings } from "lucide-react"

export const COMPANY_NAME = "Sun Elevated"
export const TERMS_OF_SERVICE = 'https://sunelevated.com/wp-content/uploads/2026/02/Wash-Me-Solar-Terms-of-Service-12.14.23.pdf'
export const PRIVACY_POLICY = 'https://sunelevated.com/wp-content/uploads/2026/02/Wash-Me-Solar-Privacy-Policy-12.14.23.pdf'
//export const ASSISTED_SCHEDULING_WEBHOOK = "https://internalwf.zuper.co/webhook/ceb19ed2-76ce-4969-86a9-b09f563b7203"
export const CREATE_BOOKING_WEBHOOK = "https://internalwf.zuper.co/webhook/295af5d9-1302-4e8d-858f-2c3e7fbc9b5d"

export const SERVICE_TYPES = [
  { uiId: "roof_inspection", title: "Roof Inspection", icon: Search },
  { uiId: "roof_repair", title: "Roof Repair", icon: Wrench },
  { uiId: "roof_rejuvenation", title: "Roof Rejuvenation", icon: Sparkles },
  { uiId: "roof_replacement", title: "Roof Replacement", icon: Home },

  { uiId: "new_solar_system", title: "New or Add-on Solar System", icon: Sun },
  { uiId: "battery_addition", title: "Battery Addition", icon: Battery },
  { uiId: "solar_detach_reset", title: "Solar Panel Detach and Reset", icon: Settings },
  { uiId: "solar_maintenance_repair", title: "Solar Maintenance & Repair", icon: Wrench },

  { uiId: "pest_exclusion", title: "Pest Exclusion", icon: ShieldCheck },
  { uiId: "solar_panel_cleaning", title: "Solar Panel Cleaning", icon: Sparkles },
  { uiId: "solar_attic_fans", title: "Solar Attic Fans", icon: Wind },
  { uiId: "snow_guards", title: "Snow Guard Systems", icon: Snowflake }
]