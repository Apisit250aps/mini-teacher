'use client'
import DashboardLayout from '@/presentations/components/layouts/dashboard-layout'

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <DashboardLayout>{children}</DashboardLayout>
}
