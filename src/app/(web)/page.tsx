import { auth } from '@/auth'
import { yearRepository } from '@/core/repositories'
import YearCreateCard from '@/presentations/components/app/year/year-create-card'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/presentations/components/ui/empty'
import { School } from 'lucide-react'
import { forbidden } from 'next/navigation'

export default async function Home() {
  const session = await auth()
  if (!session) {
    forbidden()
  }

  const years = await yearRepository.getAll({
    where: { userId: session.user.id },
  })

  return (
    <div className="h-full">
      <Empty className="bg-muted/30 h-dvh">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <School />
          </EmptyMedia>
          <EmptyTitle>ยินดีต้อนรับ</EmptyTitle>
          <EmptyDescription className="max-w-2xl text-pretty">
            สวัสดีครับ ยินดีต้อนรับสู่ระบบจัดการห้องเรียนของเรา!
            เริ่มต้นด้วยการสร้างห้องเรียนใหม่หรือเข้าร่วมห้องเรียนที่มีอยู่แล้วเพื่อเริ่มต้นการเรียนรู้และการสอนอย่างมีประสิทธิภาพ
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          {years.length === 0 ? (
            <YearCreateCard />
          ) : (
            <>
              {years.map((year) => (
                <div key={year.id} className="p-4 border rounded">
                  <h3 className="text-lg font-semibold">
                    {year.year} เทอม {year.term}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {year.description}
                  </p>
                </div>
              ))}
            </>
          )}
        </EmptyContent>
      </Empty>
    </div>
  )
}
