'use client'

import React from 'react'

import { CheckDateWithStudents } from '@/core/domain/data'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import CheckLockAction from './check-lock-action'
import CheckEditAction from './check-edit-action'
import CheckAllAction from './check-all-action'
import CheckDeleteAction from './check-delete-action'

export default function CheckHeaderAction({
  checkDate,
}: {
  checkDate: CheckDateWithStudents
}) {
  const date = new Date(checkDate.date).toLocaleDateString('th-TH', {
    day: 'numeric',
    month: 'short',
  })
  return (
    <ContextMenu>
      <ContextMenuTrigger>{date} </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuLabel>{date}</ContextMenuLabel>
        <CheckLockAction checkDate={checkDate} />
        <CheckEditAction checkDate={checkDate} />
        <CheckAllAction checkDate={checkDate} />
        <ContextMenuSeparator />
        <CheckDeleteAction checkDateId={checkDate.id} />
      </ContextMenuContent>
    </ContextMenu>
  )
}
