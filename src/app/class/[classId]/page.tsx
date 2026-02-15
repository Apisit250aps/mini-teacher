import ClassDetailView from '@/views/class-detail-view'
import { getClassByYearAndClassId, getYearActive } from '@/models/repositories'
import { ClassProvider } from '@/hooks/app/use-class'
import EmptyPage from '@/components/share/empty/empty-page'
import { Album, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function Page({
  params,
}: {
  params: Promise<{ classId: string }>
}) {
  const { classId } = await params
  const year = await getYearActive()
  if (!year) {
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
  const classRoom = await getClassByYearAndClassId(year.id, classId)

  if (!classRoom) {
    return (
      <EmptyPage
        icon={<Album size={48} />}
        title="ไม่พบห้องเรียน"
        description={`ไม่พบห้องเรียนที่คุณกำลังค้นหา ในปีการศึกษา ${year.term}/${year.year} กรุณาตรวจสอบอีกครั้งหรือสร้างห้องเรียนใหม่ `}
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
