'use client'
import React from 'react'
import PageLayout from '@/presentations/components/layouts/page-layout'
import UserDataTable from '@/presentations/components/app/user/table/user-data-table'

export default function AdminUserView() {
  return (
    <PageLayout
      title="จัดการผู้ใช้งาน"
      description="แก้ไขสถานะ สิทธิ์ และข้อมูลของผู้ใช้งานในระบบ"
    >
      <UserDataTable />
    </PageLayout>
  )
}
