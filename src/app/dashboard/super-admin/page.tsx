"use client"

import { ArrowLeft, ArrowRight, BarChart3, Building, Database, Home, LogOut, Settings, Shield, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function SuperAdminDashboard() {
  const router = useRouter()

  const handleLogout = () => {
    router.push("/auth/login")
  }

  const systemStats = [
    {
      title: "إجمالي المستخدمين",
      value: "1,247",
      description: "15 مستخدم جديد هذا الأسبوع",
      icon: <Users className="h-6 w-6" />,
      color: "text-blue-600"
    },
    {
      title: "المنشآت النشطة",
      value: "8",
      description: "3 منشآت جديدة هذا الشهر",
      icon: <Building className="h-6 w-6" />,
      color: "text-green-600"
    },
    {
      title: "معدل النظام",
      value: "99.8%",
      description:"وقت التشغيل",
      icon: <Shield className="h-6 w-6" />,
      color: "text-orange-600"
    },
    {
      title: "حجم البيانات",
      value: "2.4 TB",
      description: "مستخدمة",
      icon: <Database className="h-6 w-6" />,
      color: "text-purple-600"
    }
  ]

  const recentActivity = [
    { action: "مستخدم جديد", user: "أحمد محمد", role: "فني", time: "منذ 5 دقائق" },
    { action: "تحديث النظام", version: "v2.1.0", time: "منذ ساعة" },
    { action: "إنشاء منشأة", name: "برج النخيل", time: "منذ 3 ساعات" },
    { action: "نسخ احتياطي", status: "مكتمل", time: "منذ 6 ساعات" }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-reverse space-x-4">
              <h1 className="text-2xl font-bold text-primary">لوحة التحكم التنفيذية</h1>
            </div>
            <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              تسجيل الخروج
            </Button>
          </div>
        </div>
      </header>

      {/* Sidebar Navigation */}
      <div className="flex">
        <aside className="w-64 bg-white min-h-screen border-l">
          <nav className="p-4 space-y-2">
            <Button variant="ghost" className="w-full justify-start flex-row-reverse">
              <Home className="ml-2 h-4 w-4" />
              الرئيسية
            </Button>
            <Button variant="ghost" className="w-full justify-start flex-row-reverse">
              <Users className="ml-2 h-4 w-4" />
              إدارة المستخدمين
            </Button>
            <Button variant="ghost" className="w-full justify-start flex-row-reverse">
              <Building className="ml-2 h-4 w-4" />
              المنشآت
            </Button>
            <Button variant="ghost" className="w-full justify-start flex-row-reverse">
              <BarChart3 className="ml-2 h-4 w-4" />
              التقارير والتحليلات
            </Button>
            <Button variant="ghost" className="w-full justify-start flex-row-reverse">
              <Database className="ml-2 h-4 w-4" />
              النسخ الاحتياطي
            </Button>
            <Button variant="ghost" className="w-full justify-start flex-row-reverse">
              <Settings className="ml-2 h-4 w-4" />
              إعدادات النظام
            </Button>
            <Button variant="ghost" className="w-full justify-start flex-row-reverse">
              <Shield className="ml-2 h-4 w-4" />
              الأمان والسجلات
            </Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">مرحباً بك، المدير التنفيذي</h2>
            <p className="text-muted-foreground">هذا هو ملخص نظام بسمة للإدارة الشاملة</p>
          </div>

          {/* System Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {systemStats.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <div className={stat.color}>{stat.icon}</div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>النشاط الحديث في النظام</CardTitle>
              <CardDescription>آخر التحديثات والإجراءات في النظام</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">
                        {activity.user || activity.version || activity.name || activity.status}
                      </p>
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4">
                عرض السجلات الكاملة
                <ArrowLeft className="mr-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}