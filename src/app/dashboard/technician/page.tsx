"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Calendar, CheckCircle, Clock, Home, LogOut, MapPin, Wrench } from "lucide-react"
import { useRouter } from "next/navigation"

export default function TechnicianDashboard() {
  const router = useRouter()

  const handleLogout = () => {
    router.push("/auth/login")
  }

  const todayTasks = [
    { id: "TASK-001", title: "إصلاح تكييف الوحدة 205", location: "البرج أ - الدور الثاني", time: "9:00 ص", status: "مكتمل" },
    { id: "TASK-002", title: "صيانة مصعد المبنى ب", location: "المبنى ب - المدخل", time: "11:00 ص", status: "قيد التنفيذ" },
    { id: "TASK-003", title: "تسريب مياه الشقة 301", location: "البرج أ - الدور الثالث", time: "2:00 م", status: "قيد الانتظار" },
    { id: "TASK-004", title: "استبدال لمبات الممر", location: "المبنى ب - الطابق الأول", time: "4:00 م", status: "قيد الانتظار" }
  ]

  const stats = [
    {
      title: "مهام اليوم",
      value: "4",
      description: "1 مكتمل، 1 قيد التنفيذ",
      icon: <Calendar className="h-6 w-6" />,
      color: "text-blue-600"
    },
    {
      title: "معدل الإنجاز",
      value: "92%",
      description: "هذا الأسبوع",
      icon: <CheckCircle className="h-6 w-6" />,
      color: "text-green-600"
    },
    {
      title: "وقت الاستجابة",
      value: "15 دقيقة",
      description="متوسط الوقت",
      icon: <Clock className="h-6 w-6" />,
      color: "text-orange-600"
    },
    {
      title: "تقييم العملاء",
      value: "4.8/5",
      description="متوسط التقييم",
      icon: <Wrench className="h-6 w-6" />,
      color: "text-purple-600"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-reverse space-x-4">
              <h1 className="text-2xl font-bold text-primary">لوحة تحكم الفني</h1>
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
              <Calendar className="ml-2 h-4 w-4" />
              جدول المهام
            </Button>
            <Button variant="ghost" className="w-full justify-start flex-row-reverse">
              <CheckCircle className="ml-2 h-4 w-4" />
              المهام المكتملة
            </Button>
            <Button variant="ghost" className="w-full justify-start flex-row-reverse">
              <MapPin className="ml-2 h-4 w-4" />
              المواقع
            </Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">مرحباً بك، الفني</h2>
            <p className="text-muted-foreground">هذه هي مهامك لهذا اليوم</p>
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

          {/* Today's Tasks */}
          <Card>
            <CardHeader>
              <CardTitle>مهام اليوم</CardTitle>
              <CardDescription>قائمة المهام المخصصة لك لهذا اليوم</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todayTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-muted-foreground">{task.location}</p>
                      <p className="text-sm text-muted-foreground">{task.id} • {task.time}</p>
                    </div>
                    <div className="text-left">
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        task.status === 'مكتمل' ? 'bg-green-100 text-green-800' :
                        task.status === 'قيد التنفيذ' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {task.status}
                      </span>
                      <div className="mt-2 space-x-2">
                        {task.status === 'قيد الانتظار' && (
                          <Button size="sm">بدء المهمة</Button>
                        )}
                        {task.status === 'قيد التنفيذ' && (
                          <Button size="sm">إكمال المهمة</Button>
                        )}
                        <Button size="sm" variant="outline">تفاصيل</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4">
                عرض جميع المهام
                <ArrowLeft className="mr-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}