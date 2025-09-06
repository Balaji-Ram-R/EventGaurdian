"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, MapPin, Clock, Star, MessageSquare } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

interface MyEvent {
  id: string
  title: string
  type: string
  venue: string
  starts_at: string
  status: "registered" | "attended" | "cancelled"
  hasAttended?: boolean
  hasFeedback?: boolean
  rating?: number
}

export default function MyEventsPage() {
  const [registeredEvents, setRegisteredEvents] = useState<MyEvent[]>([])
  const [attendedEvents, setAttendedEvents] = useState<MyEvent[]>([])

  useEffect(() => {
    // Mock data - in real app, fetch from API
    setRegisteredEvents([
      {
        id: "1",
        title: "Tech Innovation Summit",
        type: "academic",
        venue: "Main Auditorium",
        starts_at: "2024-01-15T10:00:00Z",
        status: "registered",
      },
      {
        id: "2",
        title: "Cultural Night 2024",
        type: "cultural",
        venue: "Student Center",
        starts_at: "2024-01-20T18:00:00Z",
        status: "registered",
      },
    ])

    setAttendedEvents([
      {
        id: "3",
        title: "AI Workshop",
        type: "workshop",
        venue: "Computer Lab",
        starts_at: "2024-01-10T14:00:00Z",
        status: "attended",
        hasAttended: true,
        hasFeedback: true,
        rating: 5,
      },
      {
        id: "4",
        title: "Music Concert",
        type: "cultural",
        venue: "Amphitheater",
        starts_at: "2024-01-08T19:00:00Z",
        status: "attended",
        hasAttended: true,
        hasFeedback: false,
      },
    ])
  }, [])

  const getTypeColor = (type: string) => {
    switch (type) {
      case "academic":
        return "bg-chart-1 text-white"
      case "cultural":
        return "bg-chart-2 text-white"
      case "sports":
        return "bg-chart-3 text-white"
      case "workshop":
        return "bg-chart-4 text-white"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "registered":
        return "bg-secondary text-secondary-foreground"
      case "attended":
        return "bg-primary text-primary-foreground"
      case "cancelled":
        return "bg-destructive text-destructive-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="text-center py-4">
        <h1 className="text-2xl font-bold text-foreground mb-2">My Events</h1>
        <p className="text-muted-foreground">Track your event registrations and history</p>
      </div>

      <Tabs defaultValue="registered" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="registered">Registered ({registeredEvents.length})</TabsTrigger>
          <TabsTrigger value="attended">Attended ({attendedEvents.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="registered" className="space-y-4 mt-4">
          {registeredEvents.length > 0 ? (
            registeredEvents.map((event) => (
              <Card key={event.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                      <div className="flex gap-2">
                        <Badge className={getTypeColor(event.type)}>{event.type}</Badge>
                        <Badge className={getStatusColor(event.status)}>{event.status}</Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="mr-2 h-4 w-4" />
                      {new Date(event.starts_at).toLocaleDateString()} at{" "}
                      {new Date(event.starts_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="mr-2 h-4 w-4" />
                      {event.venue}
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" className="flex-1 bg-transparent" asChild>
                      <Link href={`/student/events/${event.id}`}>View Details</Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 bg-transparent text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                    >
                      Cancel Registration
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No registered events</h3>
                <p className="text-muted-foreground mb-4">You haven't registered for any events yet.</p>
                <Button asChild>
                  <Link href="/student/events">Browse Events</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="attended" className="space-y-4 mt-4">
          {attendedEvents.length > 0 ? (
            attendedEvents.map((event) => (
              <Card key={event.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                      <div className="flex gap-2">
                        <Badge className={getTypeColor(event.type)}>{event.type}</Badge>
                        <Badge className={getStatusColor(event.status)}>{event.status}</Badge>
                      </div>
                    </div>
                    {event.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{event.rating}</span>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-2 h-4 w-4" />
                      Attended on {new Date(event.starts_at).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="mr-2 h-4 w-4" />
                      {event.venue}
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" className="flex-1 bg-transparent" asChild>
                      <Link href={`/student/events/${event.id}`}>View Details</Link>
                    </Button>
                    {!event.hasFeedback ? (
                      <Button className="flex-1">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Give Feedback
                      </Button>
                    ) : (
                      <Button variant="outline" className="flex-1 bg-transparent">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        View Feedback
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No attended events</h3>
                <p className="text-muted-foreground mb-4">You haven't attended any events yet.</p>
                <Button asChild>
                  <Link href="/student/events">Browse Events</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
