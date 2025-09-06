import { createClient } from "@/lib/supabase/server"
import { withAuth, getCollegeId } from "@/lib/api-utils"
import { type NextRequest, NextResponse } from "next/server"

// GET /api/events - List events (admin: all, student: catalog)
export const GET = withAuth(async (request: NextRequest, user: any) => {
  const supabase = await createClient()
  const collegeId = getCollegeId(user)
  const userRole = user.user_metadata?.role
  const { searchParams } = new URL(request.url)

  let query = supabase
    .from("events")
    .select(`
      *,
      created_by_profile:user_profiles!events_created_by_fkey(name)
    `)
    .eq("college_id", collegeId)

  // Students only see active events
  if (userRole === "student") {
    query = query.eq("status", "active")
  }

  // Apply filters
  const type = searchParams.get("type")
  const status = searchParams.get("status")

  if (type) query = query.eq("type", type)
  if (status && userRole === "admin") query = query.eq("status", status)

  const { data: events, error } = await query.order("starts_at", { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ events })
})

// POST /api/events - Create event (admin only)
export const POST = withAuth(async (request: NextRequest, user: any) => {
  const supabase = await createClient()
  const collegeId = getCollegeId(user)
  const body = await request.json()

  const eventData = {
    college_id: collegeId,
    title: body.title,
    description: body.description,
    type: body.type,
    venue: body.venue,
    capacity: body.capacity,
    starts_at: body.starts_at,
    ends_at: body.ends_at,
    registration_opens_at: body.registration_opens_at,
    registration_closes_at: body.registration_closes_at,
    created_by: user.id,
  }

  const { data: event, error } = await supabase.from("events").insert(eventData).select().single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ event }, { status: 201 })
}, "admin")
