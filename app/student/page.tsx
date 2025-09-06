"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, TrendingUp, Clock } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

interface Event {
  id: string
  title: string
  description: string
  type: string
  venue: string
  starts_at: string
  registrations: number
  capacity: number
}

export default function StudentDashboard() {
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([])
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([])
  const [stats, setStats] = useState({
    registeredEvents: 3,
    attendedEvents: 8,
    upcomingEvents: 2,
  })

  useEffect(() => {
    // Mock data - in real app, fetch from API
    setFeaturedEvents([
      {
        id: "1",
        title: "Tech Innovation Summit",
        description: "Annual technology conference featuring industry leaders and cutting-edge innovations",
        type: "academic",
        venue: "Main Auditorium",
        starts_at: "2024-01-15T10:00:00Z",
        registrations: 45,
        capacity: 100,
      },
      {
        id: "2",
        title: "Cultural Night 2024",
        description: "Celebrating diversity through music, dance, and food from around the world",
        type: "cultural",
        venue: "Student Center",
        starts_at: "2024-01-20T18:00:00Z",
        registrations: 78,
        capacity: 150,
      },
    ])

    setUpcomingEvents([
      {
        id: "3",
        title: "Career Fair",
        description: "Connect with top employers",
        type: "academic",
        venue: "Exhibition Hall",
        starts_at: "2024-01-25T09:00:00Z",
        registrations: 120,
        capacity: 200,
      },
      {
        id: "4",
        title: "Photography Workshop",
        description: "Learn professional photography",
        type: "workshop",
        venue: "Art Building",
        starts_at: "2024-01-28T14:00:00Z",
        registrations: 25,
        capacity: 30,
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

  return (
    <div className="p-4 space-y-6">
      {/* Welcome Section */}
      <div className="text-center py-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">Discover Amazing Events</h1>
        <p className="text-muted-foreground">Find and join events that match your interests</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="text-center">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-primary">{stats.registeredEvents}</div>
            <p className="text-xs text-muted-foreground">Registered</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-secondary">{stats.attendedEvents}</div>
            <p className="text-xs text-muted-foreground">Attended</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-accent">{stats.upcomingEvents}</div>
            <p className="text-xs text-muted-foreground">Upcoming</p>
          </CardContent>
        </Card>
      </div>

      {/* Featured Events */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Featured Events</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/student/events">View All</Link>
          </Button>
        </div>
        <div className="space-y-4">
          {featuredEvents.map((event) => (
            <Card key={event.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-lg leading-tight">{event.title}</CardTitle>
                    <Badge className={getTypeColor(event.type)}>{event.type}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
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
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="mr-2 h-4 w-4" />
                    {event.registrations}/{event.capacity} registered
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${(event.registrations / event.capacity) * 100}%` }}
                  />
                </div>
                <Button className="w-full" asChild>
                  <Link href={`/student/events/${event.id}`}>View Details</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Upcoming Events */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Coming Up Soon</h2>
        <div className="grid gap-3">
          {upcomingEvents.map((event) => (
            <Card key={event.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground truncate">{event.title}</h3>
                  <p className="text-sm text-muted-foreground truncate">{event.description}</p>
                  <div className="flex items-center mt-1 text-xs text-muted-foreground">
                    <Clock className="mr-1 h-3 w-3" />
                    {new Date(event.starts_at).toLocaleDateString()}
                  </div>
                </div>
                <Button size="sm" variant="outline" className="ml-3 bg-transparent" asChild>
                  <Link href={`/student/events/${event.id}`}>View</Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-auto py-4 flex-col bg-transparent" asChild>
              <Link href="/student/events">
                <Calendar className="h-6 w-6 mb-2" />
                <span className="text-sm">Browse Events</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col bg-transparent" asChild>
              <Link href="/student/my-events">
                <TrendingUp className="h-6 w-6 mb-2" />
                <span className="text-sm">My Events</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
