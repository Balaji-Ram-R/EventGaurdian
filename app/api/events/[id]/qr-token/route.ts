import { createClient } from "@/lib/supabase/server"
import { withAuth, getCollegeId } from "@/lib/api-utils"
import { type NextRequest, NextResponse } from "next/server"
import { randomBytes } from "crypto"

// POST /api/events/[id]/qr-token - Generate QR token for event check-in
export const POST = withAuth(async (request: NextRequest, user: any, { params }: { params: { id: string } }) => {
  const supabase = await createClient()
  const collegeId = getCollegeId(user)
  const body = await request.json()

  const expiryMinutes = body.expiry_minutes || 30 // Default 30 minutes

  // Verify event exists and belongs to admin's college
  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("id, title, college_id")
    .eq("id", params.id)
    .eq("college_id", collegeId)
    .single()

  if (eventError || !event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 })
  }

  // Generate unique token
  const token = randomBytes(32).toString("hex")
  const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000).toISOString()

  // Clean up any existing tokens for this event
  await supabase.from("qr_tokens").delete().eq("event_id", params.id)

  // Create new QR token
  const { data: qrToken, error } = await supabase
    .from("qr_tokens")
    .insert({
      event_id: params.id,
      token,
      expires_at: expiresAt,
      created_by: user.id,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    token: qrToken.token,
    expires_at: qrToken.expires_at,
    qr_data: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/checkin/${qrToken.token}`,
  })
}, "admin")

// GET /api/events/[id]/qr-token - Get current QR token for event
export const GET = withAuth(async (request: NextRequest, user: any, { params }: { params: { id: string } }) => {
  const supabase = await createClient()
  const collegeId = getCollegeId(user)

  // Verify event exists and belongs to admin's college
  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("id, title, college_id")
    .eq("id", params.id)
    .eq("college_id", collegeId)
    .single()

  if (eventError || !event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 })
  }

  // Get current valid token
  const { data: qrToken, error } = await supabase
    .from("qr_tokens")
    .select("*")
    .eq("event_id", params.id)
    .gt("expires_at", new Date().toISOString())
    .single()

  if (error || !qrToken) {
    return NextResponse.json({ error: "No valid QR token found" }, { status: 404 })
  }

  return NextResponse.json({
    token: qrToken.token,
    expires_at: qrToken.expires_at,
    qr_data: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/checkin/${qrToken.token}`,
  })
}, "admin")
