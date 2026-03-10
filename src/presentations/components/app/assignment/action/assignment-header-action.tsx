'use client'

import React from 'react'

import { ScoreAssignWithScores } from '@/core/domain/data'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import AssignmentLockAction from './assignment-lock-action'
import AssignmentEditAction from './assignment-edit-action'
import AssignmentDeleteAction from './assignment-delete-action'

const TYPE_CONFIG = {
  ASSIGNMENT: {
    label: 'งานมอบหมาย',
    bg: 'bg-violet-50',
    text: 'text-violet-700',
    badge: 'bg-violet-200 text-violet-700',
  },
  HOMEWORK: {
    label: 'การบ้าน',
    bg: 'bg-sky-50',
    text: 'text-sky-700',
    badge: 'bg-sky-200 text-sky-700',
  },
  QUIZ: {
    label: 'ทดสอบย่อย',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    badge: 'bg-amber-200 text-amber-700',
  },
  EXAM: {
    label: 'สอบ',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    badge: 'bg-rose-200 text-rose-700',
  },
  PROJECT: {
    label: 'โปรเจค',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    badge: 'bg-emerald-200 text-emerald-700',
  },
}

export default function AssignmentHeaderAction({
  assignment,
}: {
  assignment: ScoreAssignWithScores
}) {
  const cfg = TYPE_CONFIG[assignment.type as keyof typeof TYPE_CONFIG]

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <span
          className={`flex flex-col items-center gap-0.5 px-1 py-1  leading-tight ${cfg.bg} ${cfg.text}`}
        >
          <span className="font-medium truncate max-w-20">
            {assignment.title}
          </span>
          <span
            className={`text-[10px] px-1.5 rounded-full font-normal ${cfg.badge}`}
          >
            {cfg.label} /{assignment.maxScore}
          </span>
        </span>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuLabel>{assignment.title}</ContextMenuLabel>
        <AssignmentLockAction assignment={assignment} />
        <AssignmentEditAction assignment={assignment} />
        <ContextMenuSeparator />
        <AssignmentDeleteAction assignmentId={assignment.id} />
      </ContextMenuContent>
    </ContextMenu>
  )
}
