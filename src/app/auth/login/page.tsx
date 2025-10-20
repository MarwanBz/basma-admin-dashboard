"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Lock, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function DashboardLogin() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Mock authentication - in a real app, this would be an API call
    setTimeout(() => {
      if (username.toLowerCase() === "maintenance" && password) {
        // Redirect to maintenance manager dashboard
        router.push("/dashboard/maintenance")
      } else if (username.toLowerCase() === "basma" && password) {
        // Redirect to basma manager dashboard
        router.push("/dashboard/basma")
      } else if (username.toLowerCase() === "super" && password) {
        // Redirect to super admin dashboard
        router.push("/dashboard/super-admin")
      } else if (username.toLowerCase() === "technician" && password) {
        // Redirect to technician dashboard
        router.push("/dashboard/technician")
      } else {
        setError("اسم المستخدم أو كلمة المرور غير صحيحة")
      }
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex items-center p-4 border-b bg-white">
        <Button variant="ghost" size="icon" onClick={() => router.push("/")} className="p-2">
          <ArrowRight className="h-6 w-6" />
        </Button>
        <div className="flex-1 flex justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-primary">بسمة</h1>
            <p className="text-sm text-muted-foreground">نظام إدارة الصيانة</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl mb-2">تسجيل الدخول للوحة التحكم</CardTitle>
            <CardDescription>الرجاء إدخال بيانات الدخول للوصول إلى لوحة التحكم</CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username">اسم المستخدم</Label>
                <div className="relative">
                  <User className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="pr-10"
                    placeholder="أدخل اسم المستخدم"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <div className="relative">
                  <Lock className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pr-10"
                    placeholder="أدخل كلمة المرور"
                  />
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></span>
                    جاري تسجيل الدخول...
                  </>
                ) : (
                  "تسجيل الدخول"
                )}
              </Button>

              <div className="text-center text-sm text-muted-foreground bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold mb-2">بيانات الدخول التجريبية:</p>
                <p>مدير الصيانة: "maintenance"</p>
                <p>مدير بسمة: "basma"</p>
                <p>المدير التنفيذي: "super"</p>
                <p>الفني: "technician"</p>
                <p className="text-xs mt-2 text-muted-foreground">يمكن استخدام أي كلمة مرور</p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}