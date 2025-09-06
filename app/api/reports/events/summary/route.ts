import { createClient } from "@/lib/supabase/server"
import { withAuth, getCollegeId } from "@/lib/api-utils"
import { type NextRequest, NextResponse } from "next/server"

// GET /api/reports/events/summary - Event summary report
export const GET = withAuth(async (request: NextRequest, user: any) => {
  const supabase = await createClient()
  const collegeId = getCollegeId(user)
  const { searchParams } = new URL(request.url)

  const eventId = searchParams.get("event_id")

  if (eventId) {
    // Get summary for specific event
    const { data: event, error: eventError } = await supabase
      .from("events")
      .select(`
        *,
        registrations(
          id,
          status,
          attendance(id),
          feedback(rating, comment)
        )
      `)
      .eq("id", eventId)
      .eq("college_id", collegeId)
      .single()

    if (eventError) {
      return NextResponse.json({ error: eventError.message }, { status: 500 })
    }

    const registrations = event.registrations || []
    const totalRegistrations = registrations.length
    const attendedCount = registrations.filter((r: any) => r.attendance?.length > 0).length
    const feedbackCount = registrations.filter((r: any) => r.feedback?.length > 0).length

    const ratings = registrations.filter((r: any) => r.feedback?.length > 0).map((r: any) => r.feedback[0].rating)

    const avgRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0

    const summary = {
      event,
      total_registrations: totalRegistrations,
      attended_count: attendedCount,
      attendance_percentage: totalRegistrations > 0 ? (attendedCount / totalRegistrations) * 100 : 0,
      feedback_count: feedbackCount,
      average_rating: avgRating,
      capacity_utilization: (totalRegistrations / event.capacity) * 100,
    }

    return NextResponse.json({ summary })
  } else {
    // Get summary for all events
    const { data: events, error } = await supabase
      .from("events")
      .select(`
        id,
        title,
        type,
        capacity,
        starts_at,
        registrations(
          id,
          status,
          attendance(id),
          feedback(rating)
        )
      `)
      .eq("college_id", collegeId)
      .order("starts_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const summaries = events?.map((event: any) => {
      const registrations = event.registrations || []
      const totalRegistrations = registrations.length
      const attendedCount = registrations.filter((r: any) => r.attendance?.length > 0).length
      const feedbackCount = registrations.filter((r: any) => r.feedback?.length > 0).length

      const ratings = registrations.filter((r: any) => r.feedback?.length > 0).map((r: any) => r.feedback[0].rating)

      const avgRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0

      return {
        id: event.id,
        title: event.title,
        type: event.type,
        starts_at: event.starts_at,
        total_registrations: totalRegistrations,
        attended_count: attendedCount,
        attendance_percentage: totalRegistrations > 0 ? (attendedCount / totalRegistrations) * 100 : 0,
        feedback_count: feedbackCount,
        average_rating: avgRating,
        capacity_utilization: (totalRegistrations / event.capacity) * 100,
      }
    })

    return NextResponse.json({ summaries })
  }
}, "admin")
