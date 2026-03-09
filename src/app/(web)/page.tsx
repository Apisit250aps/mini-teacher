import { auth } from '@/auth'
import { yearRepository } from '@/core/repositories'
import YearCreateCard from '@/presentations/components/app/year/year-create-card'
import YearIntroSelect from '@/presentations/components/app/year/year-intro-select'
import { Empty, EmptyContent } from '@/presentations/components/ui/empty'
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
        <EmptyContent>
          {years.length === 0 ? (
            <YearCreateCard />
          ) : (
            <YearIntroSelect years={years} />
          )}
        </EmptyContent>
      </Empty>
    </div>
  )
}
