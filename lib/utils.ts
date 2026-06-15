import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

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

export function formatDateInput(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8)
  if (digits.length <= 2) return digits
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`
}

export function mmddyyyyToISO(date: string): string {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(date)
  if (!match) return ""
  const [, month, day, year] = match
  return `${year}-${month}-${day}`
}

export function isoToMMDDYYYY(date: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date)
  if (!match) return ""
  const [, year, month, day] = match
  return `${month}/${day}/${year}`
}

export function isValidMMDDYYYY(date: string): boolean {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(date)
  if (!match) return false

  const month = Number(match[1])
  const day = Number(match[2])
  const year = Number(match[3])

  if (month < 1 || month > 12) return false

  const dateObj = new Date(year, month - 1, day)
  return (
    dateObj.getFullYear() === year &&
    dateObj.getMonth() === month - 1 &&
    dateObj.getDate() === day
  )
}
