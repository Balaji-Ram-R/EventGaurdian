export interface College {
  id: string
  name: string
  timezone: string
  created_at: string
  updated_at: string
}

export interface UserProfile {
  id: string
  college_id: string
  role: "admin" | "student"
  name: string
  email: string
  department?: string
  student_id?: string
  created_at: string
  updated_at: string
}

export interface Event {
  id: string
  college_id: string
  title: string
  description?: string
  type: string
  venue: string
  capacity: number
  starts_at: string
  ends_at: string
  registration_opens_at: string
  registration_closes_at: string
  status: "active" | "cancelled" | "completed"
  created_by: string
  created_at: string
  updated_at: string
}

export interface Registration {
  id: string
  event_id: string
  student_id: string
  status: "registered" | "cancelled" | "waitlisted"
  created_at: string
  updated_at: string
}

export interface Attendance {
  id: string
  registration_id: string
  checked_in_at: string
  method: "qr" | "manual"
  checked_in_by?: string
  created_at: string
}

export interface Feedback {
  id: string
  registration_id: string
  rating: number
  comment?: string
  created_at: string
  updated_at: string
}

export interface QRToken {
  id: string
  event_id: string
  token: string
  expires_at: string
  created_by: string
  created_at: string
}
