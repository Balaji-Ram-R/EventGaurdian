"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Calendar, Clock } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function CheckInPage({ params }: { params: { token: string } }) {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")
  const [eventData, setEventData] = useState<any>(null)

  useEffect(() => {
    handleCheckIn()
  }, [params.token])

  const handleCheckIn = async () => {
    try {
      const response = await fetch("/api/attendance/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: params.token }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus("success")
        setMessage("Successfully checked in!")
        setEventData(data.event)
      } else {
        setStatus("error")
        setMessage(data.error || "Check-in failed")
      }
    } catch (error) {
      setStatus("error")
      setMessage("Network error occurred")
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            {status === "loading" && (
              <>
                <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                <CardTitle>Checking you in...</CardTitle>
                <CardDescription>Please wait while we process your check-in</CardDescription>
              </>
            )}
            {status === "success" && (
              <>
                <CheckCircle className="mx-auto mb-4 h-12 w-12 text-primary" />
                <CardTitle className="text-primary">Check-in Successful!</CardTitle>
                <CardDescription>You have been successfully checked in to the event</CardDescription>
              </>
            )}
            {status === "error" && (
              <>
                <XCircle className="mx-auto mb-4 h-12 w-12 text-destructive" />
                <CardTitle className="text-destructive">Check-in Failed</CardTitle>
                <CardDescription>{message}</CardDescription>
              </>
            )}
          </CardHeader>
          <CardContent>
            {status === "success" && eventData && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground">{eventData.title}</h3>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4" />
                      {new Date(eventData.starts_at).toLocaleDateString()} at{" "}
                      {new Date(eventData.starts_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4" />
                      Checked in at {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>
                <Button className="w-full" asChild>
                  <Link href="/student">Go to Dashboard</Link>
                </Button>
              </div>
            )}
            {status === "error" && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground text-center">
                  Please make sure you're registered for this event and the QR code is still valid.
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 bg-transparent" asChild>
                    <Link href="/student/events">Browse Events</Link>
                  </Button>
                  <Button className="flex-1" asChild>
                    <Link href="/student">Dashboard</Link>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
