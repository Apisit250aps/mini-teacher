import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { IconBell } from '@tabler/icons-react'
type EmptyPageProps = {
  title: string
  description?: string
  action?: React.ReactNode
  icon?: React.ReactNode
}

export default function EmptyPage({
  title,
  description,
  action,
  icon,
}: EmptyPageProps) {
  return (
    <Empty className="bg-muted/30 h-dvh">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          {icon || <IconBell className="h-8 w-8 text-muted-foreground" />}
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription className="max-w-xs text-pretty">
          {description}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        {action}
      </EmptyContent>
    </Empty>
  )
}
