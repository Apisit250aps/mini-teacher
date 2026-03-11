'use client'
import React, { useMemo, useState } from 'react'
import { useClassContext } from '@/hooks/app/use-class'
import { Card, CardContent } from '@/presentations/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/presentations/components/ui/select'
import { IconSchool, IconUsers } from '@tabler/icons-react'
import ClassSummary from '@/presentations/components/app/class-summary'

export default function DashboardView() {
  const { classes } = useClassContext()
  const [selectedClassId, setSelectedClassId] = useState<string>('')

  // Derive summary stats
  const totalClasses = classes.length
  const totalStudents = useMemo(() => {
    const ids = new Set<string>()
    for (const cls of classes) {
      for (const member of cls.classMembers) {
        ids.add(member.studentId)
      }
    }
    return ids.size
  }, [classes])

  // Default to first class when classes load
  const effectiveClassId = selectedClassId || classes[0]?.id || ''

  return (
    <div className="flex flex-col gap-6">
      {/* Top stat cards */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-lg bg-muted p-2">
              <IconSchool size={18} className="text-blue-600" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs text-muted-foreground">
                ห้องเรียนทั้งหมด
              </p>
              <p className="text-xl font-bold leading-tight">{totalClasses}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-lg bg-muted p-2">
              <IconUsers size={18} className="text-purple-600" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs text-muted-foreground">
                นักเรียนทั้งหมด
              </p>
              <p className="text-xl font-bold leading-tight">{totalStudents}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Class selector */}
      <div className="flex items-center gap-3 justify-end">
        <span className="shrink-0 text-sm font-medium">เลือกห้องเรียน</span>
        <Select value={effectiveClassId} onValueChange={setSelectedClassId}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="เลือกห้องเรียน..." />
          </SelectTrigger>
          <SelectContent>
            {classes.map((cls) => (
              <SelectItem key={cls.id} value={cls.id}>
                {cls.name} — {cls.subject}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Class summary */}
      {effectiveClassId ? (
        <ClassSummary classId={effectiveClassId} />
      ) : (
        <p className="text-sm text-muted-foreground">
          ไม่มีห้องเรียนในปีการศึกษานี้
        </p>
      )}
    </div>
  )
}
