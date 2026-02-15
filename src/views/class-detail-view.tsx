'use client'
import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import PageLayout from '@/components/layouts/page-layout'
import { Class } from '@/models/entities'
import ClassMemberSection from '@/components/app/class/class-member-section'
import { useStoredTab } from '@/hooks/contexts/tab-storage'

const DEFAULT_ACTIVE_TAB = 'account'
const ALLOWED_TABS = [DEFAULT_ACTIVE_TAB, 'member']

export default function ClassDetailView({ classRoom }: { classRoom: Class }) {
  const { value: activeTab, onValueChange } = useStoredTab({
    id: `class-detail-tabs-${classRoom.id}`,
    defaultValue: DEFAULT_ACTIVE_TAB,
    allowedValues: ALLOWED_TABS,
  })

  return (
    <PageLayout title={'รายละเอียดห้องเรียน'}>
      <Tabs value={activeTab} onValueChange={onValueChange} className="w-auto">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="member">สมาชิก</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <pre>{JSON.stringify(classRoom, null, 2)}</pre>
        </TabsContent>
        <TabsContent value="member">
          <ClassMemberSection />
        </TabsContent>
      </Tabs>
    </PageLayout>
  )
}
