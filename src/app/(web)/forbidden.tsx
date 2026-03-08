import EmptyPage from '@/components/share/empty/empty-page'
import { Button } from '@/components/ui/button'
import { Ban } from 'lucide-react'
import Link from 'next/link'

export default function Forbidden() {
  return (
    <EmptyPage
      icon={<Ban size={64} />}
      title={'กรุณาเข้าสู่ระบบ'}
      description="เข้าสู่ระบบเพื่อเข้าถึงฟีเจอร์ทั้งหมดของแอปพลิเคชันนี้"
      action={
        <Link href="/login">
          <Button variant="outline">ไปที่หน้าเข้าสู่ระบบ</Button>
        </Link>
      }
    />
  )
}
