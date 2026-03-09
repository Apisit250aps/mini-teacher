'use client'
import { ClassProvider } from '@/hooks/app/use-class';
import DashboardLayout from '@/presentations/components/layouts/dashboard-layout'

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
