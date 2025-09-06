"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, MapPin, Users, Search, Filter } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

interface Event {
  id: string
  title: string
  description: string
  type: string
  venue: string
  capacity: number
  starts_at: string
  registrations: number
  status: string
}

export default function StudentEventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    // Mock data - in real app, fetch from API
    setEvents([
      {
        id: "1",
        title: "Tech Innovation Summit",
        description: "Annual technology conference featuring industry leaders and cutting-edge innovations",
        type: "academic",
        venue: "Main Auditorium",
        capacity: 100,
        starts_at: "2024-01-15T10:00:00Z",
        registrations: 45,
        status: "active",
      },
      {
        id: "2",
        title: "Cultural Night 2024",
        description: "Celebrating diversity through music, dance, and food from around the world",
        type: "cultural",
        venue: "Student Center",
        capacity: 150,
        starts_at: "2024-01-20T18:00:00Z",
        registrations: 78,
        status: "active",
      },
      {
        id: "3",
        title: "Career Fair",
        description: "Connect with top employers and explore career opportunities in various fields",
        type: "academic",
        venue: "Exhibition Hall",
        capacity: 200,
        starts_at: "2024-01-25T09:00:00Z",
        registrations: 120,
        status: "active",
      },
      {
        id: "4",
        title: "Photography Workshop",
        description: "Learn professional photography techniques from industry experts",
        type: "workshop",
        venue: "Art Building",
        capacity: 30,
        starts_at: "2024-01-28T14:00:00Z",
        registrations: 25,
        status: "active",
      },
      {
        id: "5",
        title: "Basketball Tournament",
        description: "Inter-college basketball championship with exciting matches",
        type: "sports",
        venue: "Sports Complex",
        capacity: 500,
        starts_at: "2024-02-01T16:00:00Z",
        registrations: 200,
        status: "active",
      },
    ])
  }, [])

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || event.type === filterType

    return matchesSearch && matchesType
  })

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
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="text-center py-4">
        <h1 className="text-2xl font-bold text-foreground mb-2">All Events</h1>
        <p className="text-muted-foreground">Discover events happening on campus</p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="bg-transparent">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          {filterType !== "all" && (
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              {filterType}
            </Badge>
          )}
        </div>

        {showFilters && (
          <Card>
            <CardContent className="pt-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Event Type</label>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="academic">Academic</SelectItem>
                      <SelectItem value="cultural">Cultural</SelectItem>
                      <SelectItem value="sports">Sports</SelectItem>
                      <SelectItem value="workshop">Workshop</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {filteredEvents.map((event) => (
          <Card key={event.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
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
              <div className="flex gap-2 pt-2">
                <Button className="flex-1" asChild>
                  <Link href={`/student/events/${event.id}`}>View Details</Link>
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent">
                  Register
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No events found</h3>
            <p className="text-muted-foreground">
              {searchTerm || filterType !== "all"
                ? "Try adjusting your search or filters."
                : "Check back later for new events."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
