import type { Metadata } from 'next'
import { Sarabun } from 'next/font/google'
import '@/app/globals.css'
import '@/app/style.css'
import { Toaster } from '@/components/ui/sonner'
import { SessionProvider } from 'next-auth/react'
import { auth } from '@/auth'
import { OverlayProvider } from '@/hooks/contexts/use-overlay'
import TanstackQueryProvider from '@/hooks/contexts/tanstack-query'
import { TabStorageProvider } from '@/hooks/contexts/tab-storage'
import { AppProvider } from '@/hooks/contexts/app-context'

const sarabun = Sarabun({
  variable: '--font-sarabun',
  subsets: ['latin', 'thai'],
  weight: ['100', '200', '300', '400', '500'],
})

export const metadata: Metadata = {
  title: 'Mini Teacher | ระบบเช็คชื่อและจัดการคะแนนนักเรียนสำหรับคุณครู',
  description:
    'Mini Teacher แอปพลิเคชันช่วยคุณครูจัดการชั้นเรียน เช็คชื่อเข้าเรียน บันทึกคะแนน และติดตามพัฒนาการนักเรียนแบบเรียลไทม์ ใช้งานง่าย รวดเร็ว',
  keywords: [
    'Mini Teacher',
    'ระบบเช็คชื่อ',
    'จัดการคะแนน',
    'สมุดพกคุณครู',
    'แอปคุณครู',
    'ระบบจัดการห้องเรียน',
  ],
  authors: [{ name: 'Apisit Saithong' }],
  creator: 'Apisit Saithong',

  openGraph: {
    title: 'Mini Teacher | ระบบจัดการชั้นเรียนอัจฉริยะ',
    description: 'ช่วยคุณครูเช็คชื่อและบันทึกคะแนนนักเรียนได้ง่ายๆ ในที่เดียว',
    url: 'https://mini-teacher.vercel.app',
    siteName: 'Mini Teacher',
    locale: 'th_TH',
    type: 'website',
  },

  robots: {
    index: true,
    follow: true,
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()
  return (
    <html lang="en">
      <body className={`${sarabun.className} antialiased`}>
        <TanstackQueryProvider>
          <AppProvider>
            <SessionProvider session={session}>
              <TabStorageProvider>
                <OverlayProvider>{children}</OverlayProvider>
              </TabStorageProvider>
            </SessionProvider>
          </AppProvider>
        </TanstackQueryProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
