'use client'
import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import PageLayout from '@/components/layouts/page-layout'
import { Class } from '@/models/entities'
import ClassMemberSection from '@/components/app/class/class-member-section'
import { useStoredTab } from '@/hooks/contexts/tab-storage'
import { useClassContext } from '@/hooks/app/use-class'
import StudentCheckTable from '@/components/app/student/student-check-table'
import StudentScoreTable from '@/components/app/student/student-score-table'

const DEFAULT_ACTIVE_TAB = 'check'
const ALLOWED_TABS = [DEFAULT_ACTIVE_TAB, 'member', 'score']

export default function ClassDetailView({ classRoom }: { classRoom: Class }) {
  const { activeClass } = useClassContext()

  const { value: activeTab, onValueChange } = useStoredTab({
    id: `class-detail-tabs-${classRoom.id}`,
    defaultValue: DEFAULT_ACTIVE_TAB,
    allowedValues: ALLOWED_TABS,
  })

  return (
    <PageLayout
      title={`ห้องเรียน: ${activeClass?.name || '...'}`}
      description={`วิชา: ${activeClass?.subject || '...'}`}
    >
      <Tabs value={activeTab} onValueChange={onValueChange} className="w-auto">
        <TabsList>
          <TabsTrigger value="check">เช็คชื่อ</TabsTrigger>
          <TabsTrigger value="score">คะแนน</TabsTrigger>
          <TabsTrigger value="member">รายชื่อนักเรียน</TabsTrigger>
        </TabsList>
        <TabsContent value="check">
          <StudentCheckTable />
        </TabsContent>
        <TabsContent value="score">
          <StudentScoreTable />
        </TabsContent>
        <TabsContent value="member">
          <ClassMemberSection />
        </TabsContent>
      </Tabs>
    </PageLayout>
  )
}
