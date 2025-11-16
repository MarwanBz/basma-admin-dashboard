"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login page
    router.push("/login");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">بسمة</h1>
        <p className="text-muted-foreground">نظام إدارة الصيانة</p>
        <p className="text-sm text-muted-foreground mt-2">
          جاري التوجيه إلى صفحة الدخول...
        </p>
      </div>
    </div>
  );
}
