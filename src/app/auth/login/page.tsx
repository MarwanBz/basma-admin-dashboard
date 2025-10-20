"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowRight, Lock, Mail } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type React from "react";
import { setTokens } from "@/apis/token";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useState } from "react";

const ROLE_REDIRECT_MAP: Record<string, string> = {
  SUPER_ADMIN: "/dashboard/super-admin",
  MAINTENANCE_ADMIN: "/dashboard/maintenance",
  BASMA_ADMIN: "/dashboard/basma",
};

export default function DashboardLogin() {
  const router = useRouter();
  const { mutate, isPending, isError, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    mutate(
      { email, password },
      {
        onSuccess: async (response) => {
          const { user, accessToken, refreshToken } = response.data;

          // Store tokens in cookies
          await setTokens({ accessToken, refreshToken });

          // Store user data in sessionStorage for useRoleGuard
          sessionStorage.setItem(
            "basma_user",
            JSON.stringify({
              id: user.id,
              roles: [user.role], // Store as array for useRoleGuard
              email: user.email,
              name: user.name,
            })
          );

          // Redirect based on role
          const redirectPath =
            ROLE_REDIRECT_MAP[user.role] || "/dashboard/super-admin";
          router.push(redirectPath);
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex items-center p-4 border-b bg-white">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/")}
          className="p-2"
        >
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
            <CardTitle className="text-2xl mb-2">
              تسجيل الدخول للوحة التحكم
            </CardTitle>
            <CardDescription>
              الرجاء إدخال بيانات الدخول للوصول إلى لوحة التحكم
            </CardDescription>
          </CardHeader>

          <CardContent>
            {isError && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>
                  {error instanceof Error
                    ? error.message
                    : "حدث خطأ أثناء تسجيل الدخول"}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <div className="relative">
                  <Mail className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pr-10"
                    placeholder="أدخل البريد الإلكتروني"
                    disabled={isPending}
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
                    disabled={isPending}
                  />
                </div>
              </div>

              <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></span>
                    جاري تسجيل الدخول...
                  </>
                ) : (
                  "تسجيل الدخول"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
