import { createClient } from "@/lib/supabase/server"
import { withAuth, getCollegeId } from "@/lib/api-utils"
import { type NextRequest, NextResponse } from "next/server"

// POST /api/attendance/checkin - Check in to event using QR token
export const POST = withAuth(async (request: NextRequest, user: any) => {
  const supabase = await createClient()
  const collegeId = getCollegeId(user)
  const body = await request.json()

  const { token } = body

  if (!token) {
    return NextResponse.json({ error: "QR token is required" }, { status: 400 })
  }

  // Validate QR token
  const { data: qrToken, error: tokenError } = await supabase
    .from("qr_tokens")
    .select(`
      *,
      event:events(
        id,
        title,
        college_id,
        starts_at,
        ends_at
      )
    `)
    .eq("token", token)
    .gt("expires_at", new Date().toISOString())
    .single()

  if (tokenError || !qrToken) {
    return NextResponse.json({ error: "Invalid or expired QR token" }, { status: 400 })
  }

  // Verify event belongs to user's college
  if (qrToken.event.college_id !== collegeId) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 })
  }

  // Check if user is registered for this event
  const { data: registration, error: regError } = await supabase
    .from("registrations")
    .select("id, status")
    .eq("event_id", qrToken.event.id)
    .eq("student_id", user.id)
    .eq("status", "registered")
    .single()

  if (regError || !registration) {
    return NextResponse.json({ error: "You are not registered for this event" }, { status: 400 })
  }

  // Check if already checked in
  const { data: existingAttendance } = await supabase
    .from("attendance")
    .select("id")
    .eq("registration_id", registration.id)
    .single()

  if (existingAttendance) {
    return NextResponse.json({ error: "Already checked in to this event" }, { status: 409 })
  }

  // Create attendance record
  const { data: attendance, error: attendanceError } = await supabase
    .from("attendance")
    .insert({
      registration_id: registration.id,
      method: "qr",
      checked_in_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (attendanceError) {
    return NextResponse.json({ error: attendanceError.message }, { status: 500 })
  }

  return NextResponse.json({
    success: true,
    event: qrToken.event,
    checked_in_at: attendance.checked_in_at,
  })
})
