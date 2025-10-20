import "./globals.css";

import type { Metadata } from "next";
import { QueryProvider } from "@apis/query";
import { Tajawal } from "next/font/google";

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
  variable: "--font-tajawal",
});

export const metadata: Metadata = {
  title: "بسمة - نظام إدارة الصيانة",
  description: "نظام إدارة الصيانة لشركة بسمة للاستثمار والتطوير العقاري",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${tajawal.variable} font-sans bg-background text-foreground`}>
        <QueryProvider>
        {children}
        </QueryProvider>
      </body>
    </html>
  );
}
