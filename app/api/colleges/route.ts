import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createClient()

    const { data: colleges, error } = await supabase.from("colleges").select("id, name").order("name")

    if (error) {
      console.error("Error fetching colleges:", error)
      return NextResponse.json({ error: "Failed to fetch colleges" }, { status: 500 })
    }

    return NextResponse.json(colleges)
  } catch (error) {
    console.error("Error in colleges API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
