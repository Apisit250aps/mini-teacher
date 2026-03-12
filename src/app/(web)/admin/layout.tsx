import AdminLayout from '@/presentations/components/layouts/admin-layout'
import React from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>
}
