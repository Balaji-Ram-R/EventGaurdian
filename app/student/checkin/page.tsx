"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { QrCode, Camera, Type } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function StudentCheckInPage() {
  const [qrToken, setQrToken] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleManualCheckIn = async () => {
    if (!qrToken.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/attendance/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: qrToken.trim() }),
      })

      const data = await response.json()

      if (response.ok) {
        router.push(`/checkin/success?event=${encodeURIComponent(data.event.title)}`)
      } else {
        alert(data.error || "Check-in failed")
      }
    } catch (error) {
      alert("Network error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-4 space-y-6">
      <div className="text-center py-4">
        <h1 className="text-2xl font-bold text-foreground mb-2">Event Check-in</h1>
        <p className="text-muted-foreground">Scan QR code or enter check-in code manually</p>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              QR Code Scanner
            </CardTitle>
            <CardDescription>Scan the QR code displayed at the event</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Camera className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">Camera scanner coming soon!</p>
              <p className="text-sm text-muted-foreground">For now, please use the manual check-in option below</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Type className="h-5 w-5" />
              Manual Check-in
            </CardTitle>
            <CardDescription>Enter the check-in code manually</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="qr-token">Check-in Code</Label>
              <Input
                id="qr-token"
                placeholder="Enter the check-in code from the event"
                value={qrToken}
                onChange={(e) => setQrToken(e.target.value)}
                className="font-mono"
              />
            </div>
            <Button onClick={handleManualCheckIn} disabled={!qrToken.trim() || isLoading} className="w-full">
              {isLoading ? "Checking in..." : "Check In"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>How to Check In</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold">
                  1
                </div>
                <p>Make sure you're registered for the event</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold">
                  2
                </div>
                <p>Look for the QR code displayed at the event venue</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold">
                  3
                </div>
                <p>Scan the QR code or copy the check-in code and enter it above</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
