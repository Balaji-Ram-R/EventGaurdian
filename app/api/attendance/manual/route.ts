import { createClient } from "@/lib/supabase/server"
import { withAuth, getCollegeId } from "@/lib/api-utils"
import { type NextRequest, NextResponse } from "next/server"

// POST /api/attendance/manual - Manually mark attendance (admin only)
export const POST = withAuth(async (request: NextRequest, user: any) => {
  const supabase = await createClient()
  const collegeId = getCollegeId(user)
  const body = await request.json()

  const { registration_id } = body

  if (!registration_id) {
    return NextResponse.json({ error: "Registration ID is required" }, { status: 400 })
  }

  // Verify registration exists and belongs to admin's college
  const { data: registration, error: regError } = await supabase
    .from("registrations")
    .select(`
      id,
      status,
      student:user_profiles!registrations_student_id_fkey(name),
      event:events(
        id,
        title,
        college_id
      )
    `)
    .eq("id", registration_id)
    .single()

  if (regError || !registration) {
    return NextResponse.json({ error: "Registration not found" }, { status: 404 })
  }

  if (registration.event.college_id !== collegeId) {
    return NextResponse.json({ error: "Registration not found" }, { status: 404 })
  }

  // Check if already checked in
  const { data: existingAttendance } = await supabase
    .from("attendance")
    .select("id")
    .eq("registration_id", registration_id)
    .single()

  if (existingAttendance) {
    return NextResponse.json({ error: "Student already checked in" }, { status: 409 })
  }

  // Create attendance record
  const { data: attendance, error: attendanceError } = await supabase
    .from("attendance")
    .insert({
      registration_id: registration_id,
      method: "manual",
      checked_in_by: user.id,
      checked_in_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (attendanceError) {
    return NextResponse.json({ error: attendanceError.message }, { status: 500 })
  }

  return NextResponse.json({
    success: true,
    attendance,
    student: registration.student,
    event: registration.event,
  })
}, "admin")
