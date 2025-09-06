"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, Mail, GraduationCap, Calendar, Award, Settings } from "lucide-react"
import { useState } from "react"

export default function StudentProfilePage() {
  const [profile, setProfile] = useState({
    name: "Alex Johnson",
    email: "alex.johnson@university.edu",
    studentId: "STU2024001",
    department: "Computer Science",
    year: "Junior",
    joinDate: "2022-09-01",
  })

  const [stats, setStats] = useState({
    eventsAttended: 12,
    eventsRegistered: 3,
    favoriteCategory: "Academic",
    totalHours: 48,
  })

  const [achievements, setAchievements] = useState([
    { id: 1, title: "Event Explorer", description: "Attended 10+ events", earned: true },
    { id: 2, title: "Early Bird", description: "Registered for 5 events in advance", earned: true },
    { id: 3, title: "Feedback Champion", description: "Provided feedback for 10+ events", earned: false },
    { id: 4, title: "Social Butterfly", description: "Attended events in 5+ categories", earned: false },
  ])

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center py-4">
        <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl font-bold text-primary-foreground">{profile.name.charAt(0)}</span>
        </div>
        <h1 className="text-2xl font-bold text-foreground">{profile.name}</h1>
        <p className="text-muted-foreground">
          {profile.department} • {profile.year}
        </p>
      </div>

      {/* Profile Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{profile.email}</span>
          </div>
          <div className="flex items-center gap-3">
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Student ID: {profile.studentId}</span>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Member since {new Date(profile.joinDate).toLocaleDateString()}</span>
          </div>
          <Button variant="outline" className="w-full bg-transparent">
            <Settings className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        </CardContent>
      </Card>

      {/* Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Event Statistics</CardTitle>
          <CardDescription>Your event participation overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-primary">{stats.eventsAttended}</div>
              <p className="text-xs text-muted-foreground">Events Attended</p>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-secondary">{stats.eventsRegistered}</div>
              <p className="text-xs text-muted-foreground">Currently Registered</p>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-lg font-bold text-accent">{stats.favoriteCategory}</div>
              <p className="text-xs text-muted-foreground">Favorite Category</p>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-chart-3">{stats.totalHours}</div>
              <p className="text-xs text-muted-foreground">Total Hours</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Achievements
          </CardTitle>
          <CardDescription>Unlock badges by participating in events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  achievement.earned ? "bg-primary/5 border-primary/20" : "bg-muted/50 border-border opacity-60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      achievement.earned ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{achievement.title}</h4>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  </div>
                </div>
                {achievement.earned && <Badge className="bg-primary text-primary-foreground">Earned</Badge>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
