"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { QrCode, RefreshCw, Copy, Clock } from "lucide-react"
import { useState, useEffect } from "react"
import QRCodeLib from "qrcode"

interface QRCodeGeneratorProps {
  eventId: string
  eventTitle: string
}

export function QRCodeGenerator({ eventId, eventTitle }: QRCodeGeneratorProps) {
  const [qrData, setQrData] = useState<{
    token: string
    expires_at: string
    qr_data: string
  } | null>(null)
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("")
  const [expiryMinutes, setExpiryMinutes] = useState(30)
  const [isGenerating, setIsGenerating] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState<string>("")

  useEffect(() => {
    // Check for existing QR token
    fetchCurrentToken()
  }, [eventId])

  useEffect(() => {
    if (qrData) {
      generateQRCode(qrData.qr_data)
      startCountdown()
    }
  }, [qrData])

  const fetchCurrentToken = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}/qr-token`)
      if (response.ok) {
        const data = await response.json()
        setQrData(data)
      }
    } catch (error) {
      console.error("Error fetching current token:", error)
    }
  }

  const generateNewToken = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch(`/api/events/${eventId}/qr-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expiry_minutes: expiryMinutes }),
      })

      if (response.ok) {
        const data = await response.json()
        setQrData(data)
      } else {
        const error = await response.json()
        console.error("Error generating QR token:", error)
      }
    } catch (error) {
      console.error("Error generating QR token:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const generateQRCode = async (data: string) => {
    try {
      const url = await QRCodeLib.toDataURL(data, {
        width: 256,
        margin: 2,
        color: {
          dark: "#059669",
          light: "#FFFFFF",
        },
      })
      setQrCodeUrl(url)
    } catch (error) {
      console.error("Error generating QR code:", error)
    }
  }

  const startCountdown = () => {
    if (!qrData) return

    const updateCountdown = () => {
      const now = new Date().getTime()
      const expiry = new Date(qrData.expires_at).getTime()
      const distance = expiry - now

      if (distance > 0) {
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((distance % (1000 * 60)) / 1000)
        setTimeRemaining(`${minutes}m ${seconds}s`)
      } else {
        setTimeRemaining("Expired")
        setQrData(null)
        setQrCodeUrl("")
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)
    return () => clearInterval(interval)
  }

  const copyToClipboard = () => {
    if (qrData) {
      navigator.clipboard.writeText(qrData.qr_data)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-5 w-5" />
          QR Code Check-in
        </CardTitle>
        <CardDescription>Generate QR codes for student check-in to {eventTitle}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!qrData ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="expiry">Token Expiry (minutes)</Label>
              <Input
                id="expiry"
                type="number"
                value={expiryMinutes}
                onChange={(e) => setExpiryMinutes(Number.parseInt(e.target.value) || 30)}
                min="5"
                max="120"
              />
            </div>
            <Button onClick={generateNewToken} disabled={isGenerating} className="w-full">
              {isGenerating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <QrCode className="mr-2 h-4 w-4" />
                  Generate QR Code
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                <Clock className="mr-1 h-3 w-3" />
                {timeRemaining}
              </Badge>
              <Button variant="outline" size="sm" onClick={generateNewToken} disabled={isGenerating}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </div>

            {qrCodeUrl && (
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 bg-white rounded-lg border">
                  <img src={qrCodeUrl || "/placeholder.svg"} alt="QR Code for check-in" className="w-64 h-64" />
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Students can scan this QR code to check in to the event
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label>Check-in URL</Label>
              <div className="flex gap-2">
                <Input value={qrData.qr_data} readOnly className="font-mono text-sm" />
                <Button variant="outline" size="sm" onClick={copyToClipboard}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
