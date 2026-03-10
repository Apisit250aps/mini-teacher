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

export default function AssignmentHeaderAction({
  assignment,
}: {
  assignment: ScoreAssignWithScores
}) {
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <span className="block leading-tight">
          {assignment.title}
          <span className="block text-xs text-muted-foreground font-normal">
            /{assignment.maxScore}
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
