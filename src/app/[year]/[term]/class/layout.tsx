import DashboardLayout from '@/components/layouts/dashboard-layout'
import { ClassProvider } from '@/hooks/app/use-class'

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{
    year: string
    term: string
  }>
}>) {
  return (
    <ClassProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </ClassProvider>
  )
}
