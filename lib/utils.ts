import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import parsePhoneNumber from "libphonenumber-js"

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

/** True only for a valid phone number assigned to the United States (excludes Canada +1, etc.). */
export function isValidUSPhoneNumber(phone: string): boolean {
  if (!phone?.trim()) return false
  try {
    const parsed = parsePhoneNumber(phone)
    if (!parsed?.isValid()) return false
    return parsed.country === "US"
  } catch {
    return false
  }
}
