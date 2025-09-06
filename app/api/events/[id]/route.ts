import { createClient } from "@/lib/supabase/server"
import { withAuth, getCollegeId } from "@/lib/api-utils"
import { type NextRequest, NextResponse } from "next/server"

// GET /api/events/[id] - Get event details
export const GET = withAuth(async (request: NextRequest, user: any, { params }: { params: { id: string } }) => {
  const supabase = await createClient()
  const collegeId = getCollegeId(user)

  const { data: event, error } = await supabase
    .from("events")
    .select(`
      *,
      created_by_profile:user_profiles!events_created_by_fkey(name),
      registrations(count),
      registrations!inner(
        id,
        status,
        student:user_profiles!registrations_student_id_fkey(name, student_id)
      )
    `)
    .eq("id", params.id)
    .eq("college_id", collegeId)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ event })
})

// PATCH /api/events/[id] - Update event (admin only)
export const PATCH = withAuth(async (request: NextRequest, user: any, { params }: { params: { id: string } }) => {
  const supabase = await createClient()
  const collegeId = getCollegeId(user)
  const body = await request.json()

  const { data: event, error } = await supabase
    .from("events")
    .update(body)
    .eq("id", params.id)
    .eq("college_id", collegeId)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ event })
}, "admin")

// DELETE /api/events/[id] - Cancel event (admin only)
export const DELETE = withAuth(async (request: NextRequest, user: any, { params }: { params: { id: string } }) => {
  const supabase = await createClient()
  const collegeId = getCollegeId(user)

  const { data: event, error } = await supabase
    .from("events")
    .update({ status: "cancelled" })
    .eq("id", params.id)
    .eq("college_id", collegeId)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ event })
}, "admin")
