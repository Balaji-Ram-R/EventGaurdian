"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { TrendingUp, Users, Calendar, Award, Download } from "lucide-react"
import { useState, useEffect } from "react"

interface EventPopularity {
  id: string
  title: string
  type: string
  registration_count: number
  capacity: number
  fill_percentage: number
}

interface EventSummary {
  id: string
  title: string
  type: string
  total_registrations: number
  attended_count: number
  attendance_percentage: number
  average_rating: number
  capacity_utilization: number
}

interface StudentParticipation {
  id: string
  name: string
  student_id: string
  department: string
  attended_count: number
  total_registrations: number
  attendance_rate: number
}

export default function ReportsPage() {
  const [popularityData, setPopularityData] = useState<EventPopularity[]>([])
  const [summaryData, setSummaryData] = useState<EventSummary[]>([])
  const [participationData, setParticipationData] = useState<StudentParticipation[]>([])
  const [filters, setFilters] = useState({
    type: "all",
    startDate: "",
    endDate: "",
    limit: "10",
  })

  useEffect(() => {
    // Mock data - in real app, fetch from API
    setPopularityData([
      {
        id: "1",
        title: "Tech Innovation Summit",
        type: "academic",
        registration_count: 85,
        capacity: 100,
        fill_percentage: 85,
      },
      {
        id: "2",
        title: "Cultural Night 2024",
        type: "cultural",
        registration_count: 120,
        capacity: 150,
        fill_percentage: 80,
      },
      {
        id: "3",
        title: "Career Fair",
        type: "academic",
        registration_count: 180,
        capacity: 200,
        fill_percentage: 90,
      },
      {
        id: "4",
        title: "Basketball Tournament",
        type: "sports",
        registration_count: 200,
        capacity: 500,
        fill_percentage: 40,
      },
    ])

    setSummaryData([
      {
        id: "1",
        title: "Tech Innovation Summit",
        type: "academic",
        total_registrations: 85,
        attended_count: 72,
        attendance_percentage: 84.7,
        average_rating: 4.5,
        capacity_utilization: 85,
      },
      {
        id: "2",
        title: "Cultural Night 2024",
        type: "cultural",
        total_registrations: 120,
        attended_count: 110,
        attendance_percentage: 91.7,
        average_rating: 4.8,
        capacity_utilization: 80,
      },
      {
        id: "3",
        title: "Career Fair",
        type: "academic",
        total_registrations: 180,
        attended_count: 165,
        attendance_percentage: 91.7,
        average_rating: 4.2,
        capacity_utilization: 90,
      },
    ])

    setParticipationData([
      {
        id: "1",
        name: "Alex Johnson",
        student_id: "STU2024001",
        department: "Computer Science",
        attended_count: 12,
        total_registrations: 15,
        attendance_rate: 80,
      },
      {
        id: "2",
        name: "Sarah Chen",
        student_id: "STU2024002",
        department: "Engineering",
        attended_count: 10,
        total_registrations: 12,
        attendance_rate: 83.3,
      },
      {
        id: "3",
        name: "Michael Brown",
        student_id: "STU2024003",
        department: "Business",
        attended_count: 8,
        total_registrations: 10,
        attendance_rate: 80,
      },
    ])
  }, [])

  const typeColors = {
    academic: "#059669",
    cultural: "#10b981",
    sports: "#ea580c",
    workshop: "#d97706",
  }

  const pieData = popularityData.map((event) => ({
    name: event.title,
    value: event.registration_count,
    fill: typeColors[event.type as keyof typeof typeColors] || "#6b7280",
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground">Comprehensive insights into event performance and student engagement</p>
        </div>
        <Button variant="outline" className="bg-transparent">
          <Download className="mr-2 h-4 w-4" />
          Export Reports
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-chart-1" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
            <Users className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">585</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Attendance Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-chart-3" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89.1%</div>
            <p className="text-xs text-muted-foreground">+5.2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <Award className="h-4 w-4 text-chart-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.5</div>
            <p className="text-xs text-muted-foreground">+0.3 from last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="popularity" className="space-y-4">
        <TabsList>
          <TabsTrigger value="popularity">Event Popularity</TabsTrigger>
          <TabsTrigger value="summary">Event Summary</TabsTrigger>
          <TabsTrigger value="participation">Student Participation</TabsTrigger>
        </TabsList>

        <TabsContent value="popularity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Event Popularity Report</CardTitle>
              <CardDescription>Events ranked by registration count</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 lg:grid-cols-2">
                <div>
                  <h4 className="text-sm font-medium mb-4">Registration Count by Event</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={popularityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="title" angle={-45} textAnchor="end" height={80} fontSize={12} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="registration_count" fill="#059669" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-4">Registration Distribution</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Events by Registration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {popularityData.map((event, index) => (
                  <div key={event.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-medium">{event.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary">{event.type}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {event.registration_count}/{event.capacity} registered
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{event.fill_percentage.toFixed(1)}%</div>
                      <div className="text-sm text-muted-foreground">capacity</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Event Performance Summary</CardTitle>
              <CardDescription>Attendance rates and feedback scores</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={summaryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="title" angle={-45} textAnchor="end" height={80} fontSize={12} />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="attendance_percentage" fill="#059669" name="Attendance %" />
                  <Bar yAxisId="right" dataKey="average_rating" fill="#10b981" name="Avg Rating" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Detailed Event Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Event</th>
                      <th className="text-left p-2">Type</th>
                      <th className="text-right p-2">Registrations</th>
                      <th className="text-right p-2">Attended</th>
                      <th className="text-right p-2">Attendance %</th>
                      <th className="text-right p-2">Avg Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summaryData.map((event) => (
                      <tr key={event.id} className="border-b">
                        <td className="p-2 font-medium">{event.title}</td>
                        <td className="p-2">
                          <Badge variant="secondary">{event.type}</Badge>
                        </td>
                        <td className="p-2 text-right">{event.total_registrations}</td>
                        <td className="p-2 text-right">{event.attended_count}</td>
                        <td className="p-2 text-right">{event.attendance_percentage.toFixed(1)}%</td>
                        <td className="p-2 text-right">{event.average_rating.toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="participation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Active Students</CardTitle>
              <CardDescription>Students with highest event participation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {participationData.map((student, index) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-medium">{student.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {student.student_id} • {student.department}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{student.attended_count}</div>
                      <div className="text-sm text-muted-foreground">events attended</div>
                      <div className="text-xs text-muted-foreground">
                        {student.attendance_rate.toFixed(1)}% attendance rate
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Participation Trends</CardTitle>
              <CardDescription>Student engagement over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={participationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="attended_count" stroke="#059669" strokeWidth={2} />
                  <Line type="monotone" dataKey="total_registrations" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
