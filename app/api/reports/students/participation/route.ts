import { createClient } from "@/lib/supabase/server"
import { withAuth, getCollegeId } from "@/lib/api-utils"
import { type NextRequest, NextResponse } from "next/server"

// GET /api/reports/students/participation - Student participation report
export const GET = withAuth(async (request: NextRequest, user: any) => {
  const supabase = await createClient()
  const collegeId = getCollegeId(user)
  const { searchParams } = new URL(request.url)

  const limit = Number.parseInt(searchParams.get("limit") || "10")
  const sortBy = searchParams.get("sort_by") || "attended_count"

  const { data: students, error } = await supabase
    .from("user_profiles")
    .select(`
      id,
      name,
      student_id,
      department,
      registrations(
        id,
        event:events(title, type, starts_at),
        attendance(id)
      )
    `)
    .eq("college_id", collegeId)
    .eq("role", "student")

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const participationData = students?.map((student: any) => {
    const registrations = student.registrations || []
    const attendedEvents = registrations.filter((r: any) => r.attendance?.length > 0)

    return {
      id: student.id,
      name: student.name,
      student_id: student.student_id,
      department: student.department,
      total_registrations: registrations.length,
      attended_count: attendedEvents.length,
      attendance_rate: registrations.length > 0 ? (attendedEvents.length / registrations.length) * 100 : 0,
      recent_events: attendedEvents.slice(0, 3).map((r: any) => ({
        title: r.event?.title,
        type: r.event?.type,
        date: r.event?.starts_at,
      })),
    }
  })

  // Sort based on criteria
  if (sortBy === "attended_count") {
    participationData?.sort((a, b) => b.attended_count - a.attended_count)
  } else if (sortBy === "attendance_rate") {
    participationData?.sort((a, b) => b.attendance_rate - a.attendance_rate)
  } else if (sortBy === "total_registrations") {
    participationData?.sort((a, b) => b.total_registrations - a.total_registrations)
  }

  const topStudents = participationData?.slice(0, limit)

  return NextResponse.json({ students: topStudents })
}, "admin")
