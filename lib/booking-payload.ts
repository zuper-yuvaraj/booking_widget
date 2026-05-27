import type { FormData } from "@/types/booking"

type LeadCustomFieldInput = Pick<
  FormData,
  "serviceInterestedIn" | "heardAboutUs" | "questionsOrComments"
>

/** Zuper custom field keys → values, e.g. { "Services": "Roof Repair" } */
export function buildLeadCustomFields(
  input: LeadCustomFieldInput
): Record<string, string> {
  const fields: Record<string, string> = {}

  if (input.serviceInterestedIn?.trim()) {
    fields.Services = input.serviceInterestedIn.trim()
  }

  if (input.heardAboutUs?.trim()) {
    fields["How did you hear about us?"] = input.heardAboutUs.trim()
  }

  if (input.questionsOrComments?.trim()) {
    fields["Questions or Comments"] = input.questionsOrComments.trim()
  }

  return fields
}

export function buildBookingSubmissionPayload(
  formData: FormData,
  companyUid: string
) {
  const {
    serviceInterestedIn,
    heardAboutUs,
    questionsOrComments,
    ...bookingData
  } = formData

  const customFields = buildLeadCustomFields({
    serviceInterestedIn,
    heardAboutUs,
    questionsOrComments,
  })

  return {
    ...bookingData,
    company_uid: companyUid,
    ...(Object.keys(customFields).length > 0
      ? { custom_fields: customFields }
      : {}),
  }
}
