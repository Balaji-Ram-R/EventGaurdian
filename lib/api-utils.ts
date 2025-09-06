import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function withAuth(
  handler: (request: NextRequest, user: any) => Promise<NextResponse>,
  requiredRole?: "admin" | "student",
) {
  return async (request: NextRequest) => {
    try {
      const supabase = await createClient()
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      if (error || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }

      if (requiredRole && user.user_metadata?.role !== requiredRole) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
      }

      return handler(request, user)
    } catch (error) {
      return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
  }
}

export function getCollegeId(user: any): string {
  return user.user_metadata?.college_id
}

export function getUserRole(user: any): "admin" | "student" {
  return user.user_metadata?.role
}
