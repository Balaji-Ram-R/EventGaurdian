import { createClient } from "@/lib/supabase/server"
import { withAuth, getCollegeId } from "@/lib/api-utils"
import { type NextRequest, NextResponse } from "next/server"

// GET /api/reports/events/popularity - Event popularity report
export const GET = withAuth(async (request: NextRequest, user: any) => {
  const supabase = await createClient()
  const collegeId = getCollegeId(user)
  const { searchParams } = new URL(request.url)

  const type = searchParams.get("type")
  const startDate = searchParams.get("start_date")
  const endDate = searchParams.get("end_date")

  let query = supabase
    .from("events")
    .select(`
      id,
      title,
      type,
      venue,
      starts_at,
      capacity,
      registrations(count)
    `)
    .eq("college_id", collegeId)

  // Apply filters
  if (type && type !== "all") {
    query = query.eq("type", type)
  }

  if (startDate) {
    query = query.gte("starts_at", startDate)
  }

  if (endDate) {
    query = query.lte("starts_at", endDate)
  }

  const { data: events, error } = await query.order("starts_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Transform data to include registration count
  const popularityData = events?.map((event: any) => ({
    ...event,
    registration_count: event.registrations?.[0]?.count || 0,
    fill_percentage: ((event.registrations?.[0]?.count || 0) / event.capacity) * 100,
  }))

  // Sort by registration count
  popularityData?.sort((a, b) => b.registration_count - a.registration_count)

  return NextResponse.json({ events: popularityData })
}, "admin")
