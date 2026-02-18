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

const sarabun = Sarabun({
  variable: '--font-sarabun',
  subsets: ['latin', 'thai'],
  weight: ['100', '200', '300', '400', '500'],
})

export const metadata: Metadata = {
  title: 'Mini Teacher',
  description: 'Mini Teacher Management App ',
  authors: [{ name: 'Apisit Saithong' }],
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
          <SessionProvider session={session}>
            <TabStorageProvider>
              <OverlayProvider>{children}</OverlayProvider>
            </TabStorageProvider>
          </SessionProvider>
        </TanstackQueryProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
