"use client";

import { Button } from "@/components/ui/button";
import { ShieldX } from "lucide-react";
import { useRouter } from "next/navigation";

export function Unauthorized() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md p-8">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-red-100 p-6">
            <ShieldX className="h-16 w-16 text-red-600" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          غير مصرح بالدخول
        </h1>

        <p className="text-gray-600 mb-8">
          عذراً، ليس لديك الصلاحيات اللازمة للوصول إلى هذه الصفحة. يرجى التواصل
          مع المسؤول إذا كنت تعتقد أن هذا خطأ.
        </p>

        <div className="flex gap-4 justify-center">
          <Button onClick={() => router.back()} variant="outline">
            العودة للخلف
          </Button>

          <Button onClick={() => router.push("/auth/login")}>
            تسجيل الخروج
          </Button>
        </div>
      </div>
    </div>
  );
}
