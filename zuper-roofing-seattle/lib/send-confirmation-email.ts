import emailjs from "@emailjs/browser"

export interface ConfirmationEmailParams {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  selectedDate: string
  selectedSlot: string
  services: string[]
}

const SERVICE_LABEL: Record<string, string> = {
  total_exterior_inspection: "Total Exterior Inspection",
  roof_inspection: "Roof Inspection",
  gutter_inspection: "Gutter Inspection",
  siding_inspection: "Siding Inspection",
  storm_damage: "Storm Damage Assessment",
  insurance_claim: "Insurance Claim Assistance",
}

function formatDate(ds: string): string {
  if (!ds) return ""
  const [y, m, d] = ds.split("-").map(Number)
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export async function sendConfirmationEmail(params: ConfirmationEmailParams): Promise<void> {
  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? ""
  const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? ""
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? ""

  if (!serviceId || !templateId || !publicKey) {
    console.warn("[sendConfirmationEmail] EmailJS credentials not configured — skipping email")
    return
  }

  const serviceList = params.services
    .map((s) => SERVICE_LABEL[s] ?? s)
    .join(", ")

  await emailjs.send(
    serviceId,
    templateId,
    {
      to_name: params.firstName,
      to_email: params.email,
      full_name: `${params.firstName} ${params.lastName}`,
      phone: params.phone,
      address: params.address,
      inspection_date: formatDate(params.selectedDate),
      time_slot: params.selectedSlot,
      services: serviceList,
      company_name: "Zuper Roofing Seattle",
      company_phone: "(206) 555-0000",
    },
    publicKey
  )
}
