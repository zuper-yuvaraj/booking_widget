import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { isValidPhoneNumber } from "react-phone-number-input"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Validates email format using a comprehensive regex pattern
 * @param email - The email string to validate
 * @returns boolean - True if email is valid, false otherwise
 */
export function isValidEmail(email: string): boolean {
  // More comprehensive email regex pattern
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  return emailRegex.test(email)
}

/** Strip formatting; keep up to 10 US national digits (handles pasted +1 / 1-prefix). */
export function normalizeUsPhoneDigits(value: string): string {
  let digits = value.replace(/\D/g, "")
  if (digits.length === 11 && digits.startsWith("1")) {
    digits = digits.slice(1)
  }
  return digits.slice(0, 10)
}

/** NANP shape + libphonenumber US check (area/exchange cannot start with 0 or 1). */
export function isValidUsPhone(digits: string): boolean {
  if (digits.length !== 10) return false
  if (!/^[2-9]\d{2}[2-9]\d{6}$/.test(digits)) return false
  return isValidPhoneNumber(`+1${digits}`, "US")
}

export function formatUsPhoneE164(digits: string): string {
  return `+1${digits}`
}

/** Display without brackets: 555 123 4567 */
export function formatUsPhoneDisplay(digits: string): string {
  const normalized = normalizeUsPhoneDigits(digits)
  if (normalized.length !== 10) return normalized
  return `${normalized.slice(0, 3)} ${normalized.slice(3, 6)} ${normalized.slice(6)}`
}

/** Format date for API/display as mm/dd/yyyy (accepts yyyy-mm-dd from date inputs). */
export function formatDateMmDdYyyy(dateString: string): string {
  if (!dateString) return dateString
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) return dateString

  const isoMatch = dateString.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (isoMatch) {
    const [, year, month, day] = isoMatch
    return `${month}/${day}/${year}`
  }

  return dateString
}
