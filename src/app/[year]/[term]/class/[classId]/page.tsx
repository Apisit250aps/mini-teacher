import ClassDetailView from '@/views/class-detail-view'
import {
  getUnique,
  getYearsByYearTerm,
} from '@/models/repositories/mongo'
import { ClassProvider } from '@/hooks/app/use-class'
import EmptyPage from '@/components/share/empty/empty-page'
import { Album, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { forbidden } from 'next/navigation'
import { auth } from '@/auth'

export default async function Page({
  params,
}: {
  params: Promise<{ classId: string; year: string; term: string }>
}) {
  const { classId, year, term } = await params
  const session = await auth()
  if (!session) {
    forbidden()
  }
  const yearData = await getYearsByYearTerm(
    parseInt(year),
    parseInt(term),
    session.user.id,
  )
  if (!yearData) {
    return (
      <EmptyPage
        icon={<Calendar size={48} />}
        title="ไม่พบปีการศึกษา"
        description="กรุณาตรวจสอบปีการศึกษาอีกครั้ง"
        action={
          <Button asChild>
            <Link href="/class">กลับไปหน้าหลัก</Link>
          </Button>
        }
      />
    )
  }
  const classRoom = await getUnique(yearData.id, classId)

  if (!classRoom) {
    return (
      <EmptyPage
        icon={<Album size={48} />}
        title="ไม่พบห้องเรียน"
        description={`ไม่พบห้องเรียนที่คุณกำลังค้นหา ในปีการศึกษา ${yearData.term}/${yearData.year} กรุณาตรวจสอบอีกครั้งหรือสร้างห้องเรียนใหม่ `}
        action={
          <Button asChild>
            <Link href="/class/manage">สร้างห้องเรียนใหม่</Link>
          </Button>
        }
      />
    )
  }
  return (
    <ClassProvider activeClass={classRoom}>
      <ClassDetailView classRoom={classRoom} />
    </ClassProvider>
  )
}
