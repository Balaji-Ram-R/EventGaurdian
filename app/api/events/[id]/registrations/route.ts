import { createClient } from "@/lib/supabase/server"
import { withAuth, getCollegeId } from "@/lib/api-utils"
import { type NextRequest, NextResponse } from "next/server"

// POST /api/events/[id]/registrations - Register for event
export const POST = withAuth(async (request: NextRequest, user: any, { params }: { params: { id: string } }) => {
  const supabase = await createClient()
  const collegeId = getCollegeId(user)

  // Check if event exists and is in same college
  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("id, capacity, status, registration_opens_at, registration_closes_at")
    .eq("id", params.id)
    .eq("college_id", collegeId)
    .single()

  if (eventError || !event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 })
  }

  if (event.status !== "active") {
    return NextResponse.json({ error: "Event is not active" }, { status: 400 })
  }

  const now = new Date()
  const registrationOpens = new Date(event.registration_opens_at)
  const registrationCloses = new Date(event.registration_closes_at)

  if (now < registrationOpens) {
    return NextResponse.json({ error: "Registration not yet open" }, { status: 400 })
  }

  if (now > registrationCloses) {
    return NextResponse.json({ error: "Registration has closed" }, { status: 400 })
  }

  // Check current registrations count
  const { count: currentRegistrations } = await supabase
    .from("registrations")
    .select("*", { count: "exact", head: true })
    .eq("event_id", params.id)
    .eq("status", "registered")

  const registrationData = {
    event_id: params.id,
    student_id: user.id,
    status: (currentRegistrations || 0) >= event.capacity ? "waitlisted" : "registered",
  }

  const { data: registration, error } = await supabase.from("registrations").insert(registrationData).select().single()

  if (error) {
    if (error.code === "23505") {
      // Unique constraint violation
      return NextResponse.json({ error: "Already registered for this event" }, { status: 409 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ registration }, { status: 201 })
})

// DELETE /api/events/[id]/registrations - Unregister from event
export const DELETE = withAuth(async (request: NextRequest, user: any, { params }: { params: { id: string } }) => {
  const supabase = await createClient()

  const { data: registration, error } = await supabase
    .from("registrations")
    .update({ status: "cancelled" })
    .eq("event_id", params.id)
    .eq("student_id", user.id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ registration })
})
