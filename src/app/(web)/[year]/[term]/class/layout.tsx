'use client'
import DashboardLayout from '@/components/layouts/dashboard-layout'
import { ClassProvider } from '@/hooks/app/use-class'

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClassProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </ClassProvider>
  )
}
