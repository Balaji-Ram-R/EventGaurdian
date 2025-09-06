import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Campus Event Management Platform</h1>
          <p className="text-lg text-muted-foreground">
            Streamline event management, registrations, and attendance tracking for your campus
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>For Students</CardTitle>
              <CardDescription>Browse events, register, and check-in with QR codes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <ul className="text-sm space-y-2">
                  <li>• Browse upcoming campus events</li>
                  <li>• Register for events you're interested in</li>
                  <li>• Quick QR code check-in</li>
                  <li>• Provide feedback after events</li>
                </ul>
                <Button asChild className="w-full">
                  <Link href="/auth/login">Student Login</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>For Administrators</CardTitle>
              <CardDescription>Create events, manage registrations, and view analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <ul className="text-sm space-y-2">
                  <li>• Create and manage events</li>
                  <li>• Track registrations and attendance</li>
                  <li>• Generate QR codes for check-in</li>
                  <li>• View detailed reports and analytics</li>
                </ul>
                <Button asChild className="w-full">
                  <Link href="/auth/login">Admin Login</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            New to the platform?{" "}
            <Link href="/auth/signup" className="underline underline-offset-4">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
