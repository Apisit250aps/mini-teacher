import React from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'

type PageLayoutProps = {
  children?: React.ReactNode
  description?: string
  title: string
  actions?: React.ReactNode
}

export default function PageLayout({
  children,
  description,
  title,
  actions,
}: PageLayoutProps) {
  return (
    <Card className="w-full max-w-full overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="min-w-0 truncate">{title}</CardTitle>
          <div className="shrink-0">{actions}</div>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="w-full max-w-full overflow-x-auto">{children}</CardContent>
    </Card>
  )
}
