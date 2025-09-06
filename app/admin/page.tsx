"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Users, TrendingUp, Clock } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

interface DashboardStats {
  totalEvents: number
  activeEvents: number
  totalRegistrations: number
  upcomingEvents: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalEvents: 0,
    activeEvents: 0,
    totalRegistrations: 0,
    upcomingEvents: 0,
  })
  const [recentEvents, setRecentEvents] = useState<any[]>([])

  useEffect(() => {
    // Mock data - in real app, fetch from API
    setStats({
      totalEvents: 24,
      activeEvents: 8,
      totalRegistrations: 156,
      upcomingEvents: 5,
    })

    setRecentEvents([
      {
        id: "1",
        title: "Tech Innovation Summit",
        type: "academic",
        starts_at: "2024-01-15T10:00:00Z",
        registrations: 45,
        capacity: 100,
      },
      {
        id: "2",
        title: "Cultural Night 2024",
        type: "cultural",
        starts_at: "2024-01-20T18:00:00Z",
        registrations: 78,
        capacity: 150,
      },
      {
        id: "3",
        title: "Career Fair",
        type: "academic",
        starts_at: "2024-01-25T09:00:00Z",
        registrations: 120,
        capacity: 200,
      },
    ])
  }, [])

  const statCards = [
    {
      title: "Total Events",
      value: stats.totalEvents,
      description: "All time events created",
      icon: Calendar,
      color: "text-chart-1",
    },
    {
      title: "Active Events",
      value: stats.activeEvents,
      description: "Currently accepting registrations",
      icon: TrendingUp,
      color: "text-chart-2",
    },
    {
      title: "Total Registrations",
      value: stats.totalRegistrations,
      description: "Across all events",
      icon: Users,
      color: "text-chart-3",
    },
    {
      title: "Upcoming Events",
      value: stats.upcomingEvents,
      description: "Next 7 days",
      icon: Clock,
      color: "text-chart-4",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your events.</p>
        </div>
        <Button asChild>
          <Link href="/admin/events/new">Create Event</Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Events */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-card-foreground">Recent Events</CardTitle>
            <CardDescription>Your latest created events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium text-card-foreground">{event.title}</p>
                    <p className="text-sm text-muted-foreground capitalize">{event.type}</p>
                    <p className="text-xs text-muted-foreground">{new Date(event.starts_at).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-card-foreground">
                      {event.registrations}/{event.capacity}
                    </p>
                    <p className="text-xs text-muted-foreground">registered</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4 bg-transparent" asChild>
              <Link href="/admin/events">View All Events</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-card-foreground">Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full justify-start" asChild>
                <Link href="/admin/events/new">
                  <Calendar className="mr-2 h-4 w-4" />
                  Create New Event
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                <Link href="/admin/registrations">
                  <Users className="mr-2 h-4 w-4" />
                  View Registrations
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                <Link href="/admin/reports">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Generate Reports
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
