'use client'

import React from 'react'

import { CheckDateWithStudents } from '@/core/domain/data'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import { Pen, Lock, LockOpen, Trash } from 'lucide-react'

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
      <ContextMenuTrigger>{date}</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuLabel>{date}</ContextMenuLabel>
        <ContextMenuItem>
          {checkDate.isEditable ? <LockOpen /> : <Lock />}
          ล็อค
        </ContextMenuItem>
        <ContextMenuItem>
          <Pen />
          แก้ไข
        </ContextMenuItem>
        <ContextMenuSub>
          <ContextMenuSubTrigger>เช็คทั้งหมด</ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuGroup>
              <ContextMenuItem>มา</ContextMenuItem>
              <ContextMenuItem>สาย</ContextMenuItem>
              <ContextMenuItem>ขาด</ContextMenuItem>
              <ContextMenuItem>ลา</ContextMenuItem>
            </ContextMenuGroup>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive">
          <Trash />
          ลบ
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}