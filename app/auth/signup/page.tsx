"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    role: "",
    collegeId: "",
    department: "",
    studentId: "",
  })
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [colleges, setColleges] = useState<Array<{ id: string; name: string }>>([])
  const [loadingColleges, setLoadingColleges] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const response = await fetch("/api/colleges")
        if (response.ok) {
          const data = await response.json()
          setColleges(data)
        } else {
          console.error("Failed to fetch colleges")
          // Fallback to empty array if API fails
          setColleges([])
        }
      } catch (error) {
        console.error("Error fetching colleges:", error)
        setColleges([])
      } finally {
        setLoadingColleges(false)
      }
    }

    fetchColleges()
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (!formData.collegeId || !formData.role) {
      setError("Please select college and role")
      setIsLoading(false)
      return
    }

    if (formData.role === "student" && !formData.studentId) {
      setError("Student ID is required for students")
      setIsLoading(false)
      return
    }

    try {
      console.log("[v0] Attempting signup with data:", {
        email: formData.email,
        college_id: formData.collegeId,
        role: formData.role,
        name: formData.name,
      })

      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/auth/callback`,
          data: {
            name: formData.name,
            role: formData.role,
            college_id: formData.collegeId,
            department: formData.department || null,
            student_id: formData.studentId || null,
          },
        },
      })

      if (error) {
        console.error("[v0] Signup error:", error)
        throw error
      }

      console.log("[v0] Signup successful, redirecting to verify email")
      router.push("/auth/verify-email")
    } catch (error: unknown) {
      console.error("[v0] Signup failed:", error)
      setError(error instanceof Error ? error.message : "An error occurred during signup")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Sign Up</CardTitle>
            <CardDescription>Create your account to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp}>
              <div className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="college">College</Label>
                  <Select
                    value={formData.collegeId}
                    onValueChange={(value) => handleInputChange("collegeId", value)}
                    disabled={loadingColleges}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={loadingColleges ? "Loading colleges..." : "Select your college"} />
                    </SelectTrigger>
                    <SelectContent>
                      {colleges.map((college) => (
                        <SelectItem key={college.id} value={college.id}>
                          {college.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.role === "student" && (
                  <>
                    <div className="grid gap-2">
                      <Label htmlFor="studentId">Student ID</Label>
                      <Input
                        id="studentId"
                        type="text"
                        required
                        value={formData.studentId}
                        onChange={(e) => handleInputChange("studentId", e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        type="text"
                        value={formData.department}
                        onChange={(e) => handleInputChange("department", e.target.value)}
                      />
                    </div>
                  </>
                )}

                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  />
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <Button type="submit" className="w-full" disabled={isLoading || loadingColleges}>
                  {isLoading ? "Creating account..." : "Sign Up"}
                </Button>
              </div>

              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link href="/auth/login" className="underline underline-offset-4">
                  Sign in
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
