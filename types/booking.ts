export interface FormData {
  firstName: string
  lastName: string
  phone: string
  email: string
  serviceType: string
  address: string
  street: string
  city: string
  state: string
  zipcode: string
  latitude: string
  longitude: string
  selectedDate: string
  selectedSlot: string
  start_time: string
  end_time: string
  selectedUser: string
  preferredDate: string
  hearAboutUs?: string
  comments?: string
  services?: string[]
  marketingConsent?: boolean
  territory?: string
}

export interface UserSlot {
  id: string
  name: string
  avatar: string
  description: string
  slots: Array<{ display: string; original: TimeSlot }>
}

// API Response Types
export interface ApiUser {
  user_uid: string
  emp_code: string
  first_name: string
  last_name: string
  email: string
  designation: string
  bio: string | ''
  profile_picture: string
  hourly_labor_charge: number | null
  is_active: boolean
  role: {
    role_uid: string
    role_name: string
    role_key: string
  }
}

export interface TimeSlot {
  start_time: string
  end_time: string
  users_available: number
  users: string[]
}

export interface AvailabilityData {
  date: string
  holiday: boolean
  slots: TimeSlot[]
}

export interface ApiResponse {
  type: string,
  message?: string,
  success?: boolean,
  data: {
    availability: AvailabilityData[]
    users: ApiUser[]
  }
}


export interface UserProfile {
  user_uid: string
  first_name: string
  last_name: string
  designation: string
  profile_picture: string
  bio: string
}

export interface GoogleMapsPrediction {
  place_id: string
  description: string
  structured_formatting: {
    main_text: string
    secondary_text: string
  }
}

export interface Territory {
  id: string
  name: string
}

export type ServiceAreaStatus = 'idle' | 'checking' | 'serviced' | 'not_serviced' | 'unknown'

export interface StepProps {
  formData: FormData
  onUpdateFormData: (field: keyof FormData, value: string | boolean | string[]) => void
  onNext: () => void
  onPrev: () => void
  isValid: boolean
  territories?: Territory[]
  serviceAreaStatus?: ServiceAreaStatus
  onCheckServiceArea?: (address: string, lat: string, lng: string, zipcode?: string) => void
}
