"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { QRCodeGenerator } from "@/components/admin/qr-code-generator"
import { ArrowLeft, Users, UserCheck, Search, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

interface Registration {
  id: string
  student: {
    name: string
    student_id: string
    department: string
  }
  status: string
  created_at: string
  attendance?: {
    id: string
    checked_in_at: string
    method: string
  }
}

export default function EventAttendancePage({ params }: { params: { id: string } }) {
  const [event, setEvent] = useState<any>(null)
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchEventData()
    fetchRegistrations()
  }, [params.id])

  const fetchEventData = async () => {
    try {
      const response = await fetch(`/api/events/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setEvent(data.event)
      }
    } catch (error) {
      console.error("Error fetching event:", error)
    }
  }

  const fetchRegistrations = async () => {
    try {
      // Mock data - in real app, fetch from API
      setRegistrations([
        {
          id: "1",
          student: {
            name: "Alex Johnson",
            student_id: "STU2024001",
            department: "Computer Science",
          },
          status: "registered",
          created_at: "2024-01-10T10:00:00Z",
          attendance: {
            id: "1",
            checked_in_at: "2024-01-15T09:45:00Z",
            method: "qr",
          },
        },
        {
          id: "2",
          student: {
            name: "Sarah Chen",
            student_id: "STU2024002",
            department: "Engineering",
          },
          status: "registered",
          created_at: "2024-01-10T11:00:00Z",
        },
        {
          id: "3",
          student: {
            name: "Michael Brown",
            student_id: "STU2024003",
            department: "Business",
          },
          status: "registered",
          created_at: "2024-01-10T12:00:00Z",
        },
      ])
    } catch (error) {
      console.error("Error fetching registrations:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleManualCheckIn = async (registrationId: string) => {
    try {
      const response = await fetch("/api/attendance/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registration_id: registrationId }),
      })

      if (response.ok) {
        // Refresh registrations
        fetchRegistrations()
      } else {
        const error = await response.json()
        console.error("Error checking in student:", error)
      }
    } catch (error) {
      console.error("Error checking in student:", error)
    }
  }

  const filteredRegistrations = registrations.filter(
    (reg) =>
      reg.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.student.student_id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const attendedCount = registrations.filter((reg) => reg.attendance).length
  const attendanceRate = registrations.length > 0 ? (attendedCount / registrations.length) * 100 : 0

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/events">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Event Attendance</h1>
          <p className="text-muted-foreground">{event?.title || "Loading..."}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Registered</CardTitle>
            <Users className="h-4 w-4 text-chart-1" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{registrations.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Checked In</CardTitle>
            <UserCheck className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendedCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-chart-3" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceRate.toFixed(1)}%</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* QR Code Generator */}
        <QRCodeGenerator eventId={params.id} eventTitle={event?.title || ""} />

        {/* Manual Check-in */}
        <Card>
          <CardHeader>
            <CardTitle>Manual Check-in</CardTitle>
            <CardDescription>Manually mark attendance for registered students</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredRegistrations.map((registration) => (
                <div
                  key={registration.id}
                  className="flex items-center justify-between p-3 border border-border rounded-lg"
                >
                  <div className="flex-1">
                    <h4 className="font-medium">{registration.student.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {registration.student.student_id} • {registration.student.department}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {registration.attendance ? (
                      <Badge className="bg-primary text-primary-foreground">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Checked In
                      </Badge>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleManualCheckIn(registration.id)}
                        className="bg-secondary hover:bg-secondary/80"
                      >
                        Check In
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {filteredRegistrations.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm ? "No students found matching your search." : "No registered students."}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
