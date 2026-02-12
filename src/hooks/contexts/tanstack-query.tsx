'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
const queryClient = new QueryClient()

export default function TanstackQueryProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
    </QueryClientProvider>
  )
}
