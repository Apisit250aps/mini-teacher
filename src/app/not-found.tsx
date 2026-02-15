import EmptyPage from '@/components/share/empty/empty-page'
import { Button } from '@/components/ui/button'
import { AlertCircleIcon } from 'lucide-react';
import Link from 'next/link'

export default function Page() {
  return (
    <EmptyPage
      icon={<AlertCircleIcon size={48} />}
      title={'404 Not Found'}
      description="ไม่พบหน้าที่คุณต้องการ"
      action={
        <Link href="/">
          <Button>กลับไปหน้าหลัก</Button>
        </Link>
      }
    />
  )
}
