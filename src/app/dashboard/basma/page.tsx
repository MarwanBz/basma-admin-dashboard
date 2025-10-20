"use client"

import { ArrowLeft, ArrowRight, BarChart3, Building, ClipboardList, Home, LogOut, Package, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function BasmaDashboard() {
  const router = useRouter()

  const handleLogout = () => {
    router.push("/auth/login")
  }

  const stats = [
    {
      title: "طلبات المنشأة",
      value: "18",
      description: "4 طلبات جديدة اليوم",
      icon: <Building className="h-6 w-6" />,
      color: "text-blue-600"
    },
    {
      title: "الطلبات المكتملة",
      value: "142",
      description: "هذا الشهر",
      icon: <ClipboardList className="h-6 w-6" />,
      color: "text-green-600"
    },
    {
      title: "معدل الرضا",
      value: "94%",
      description: "آخر 30 يوم",
      icon: <BarChart3 className="h-6 w-6" />,
      color: "text-orange-600"
    },
    {
      title: "القطع الخارجية",
      value: "23",
      description: "بانتظار الموافقة",
      icon: <Package className="h-6 w-6" />,
      color: "text-purple-600"
    }
  ]

  const pendingRequests = [
    { id: "REQ-005", title: "صيانة نظام إنذار الحريق", floor: "الدور الأرضي", priority: "عالي" },
    { id: "REQ-006", title: "إصلاح أنظمة الإضاءة", floor: "الدور الخامس", priority: "متوسط" },
    { id: "REQ-007", title: "صيانة مصاعد الشحنة", floor: "جميع الأدوار", priority: "عالي" },
    { id: "REQ-008", title: "فحص أنظمة التكييف المركزي", floor: "الدور الثاني", priority: "منخفض" }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-reverse space-x-4">
              <h1 className="text-2xl font-bold text-primary">لوحة تحكم مدير بسمة</h1>
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
              <ClipboardList className="ml-2 h-4 w-4" />
              طلبات الصيانة
            </Button>
            <Button variant="ghost" className="w-full justify-start flex-row-reverse">
              <Users className="ml-2 h-4 w-4" />
              الفنيون
            </Button>
            <Button variant="ghost" className="w-full justify-start flex-row-reverse">
              <Package className="ml-2 h-4 w-4" />
              القطع الخارجية
            </Button>
            <Button variant="ghost" className="w-full justify-start flex-row-reverse">
              <BarChart3 className="ml-2 h-4 w-4" />
              التقارير
            </Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">مرحباً بك، مدير المنشأة</h2>
            <p className="text-muted-foreground">هذا هو ملخص حالة المنشأة الحالية</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
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

          {/* Pending Requests */}
          <Card>
            <CardHeader>
              <CardTitle>الطلبات بانتظار المراجعة</CardTitle>
              <CardDescription>الطلبات التي تحتاج إلى موافقتك</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{request.title}</p>
                      <p className="text-sm text-muted-foreground">{request.id} • {request.floor}</p>
                    </div>
                    <div className="text-left">
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        request.priority === 'عالي' ? 'bg-red-100 text-red-800' :
                        request.priority === 'متوسط' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {request.priority}
                      </span>
                      <div className="mt-2 space-x-2">
                        <Button size="sm" variant="outline">مراجعة</Button>
                        <Button size="sm">موافقة</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4">
                عرض جميع الطلبات
                <ArrowLeft className="mr-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}