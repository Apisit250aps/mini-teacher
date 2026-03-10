'use client'

import { Score } from '@/core/domain/entities'
import { useScoreStudentMutations } from '@/hooks/queries'
import { useCallback, useState } from 'react'

export type AssignmentScoreActionProps = {
  assignmentId: string
  studentId: string
  record: Score | undefined
  minScore: number
  maxScore: number
  disabled?: boolean
}

export default function AssignmentScoreAction({
  assignmentId,
  studentId,
  record,
  minScore,
  maxScore,
  disabled = false,
}: AssignmentScoreActionProps) {
  const mutations = useScoreStudentMutations()
  const [isFocused, setIsFocused] = useState(false)
  const [localValue, setLocalValue] = useState('')

  // When not focused, derive display value from server record
  const displayValue = isFocused
    ? localValue
    : record?.score !== undefined
      ? String(record.score)
      : ''

  const handleFocus = () => {
    setLocalValue(record?.score !== undefined ? String(record.score) : '')
    setIsFocused(true)
  }

  const handleSave = useCallback(async () => {
    setIsFocused(false)
    if (localValue === '') return
    const numValue = Number(localValue)
    if (isNaN(numValue)) return
    if (record) {
      if (numValue === record.score) return
      await mutations.update(record.id, { score: numValue })
    } else {
      await mutations.create({ assignmentId, studentId, score: numValue })
    }
  }, [localValue, record, assignmentId, studentId, mutations])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur()
    }
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <input
        type="number"
        min={minScore}
        max={maxScore}
        value={displayValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder="-"
        className="w-full h-full text-center text-xs bg-transparent border-none outline-none focus:bg-blue-50 focus:ring-1 focus:ring-inset focus:ring-blue-300 disabled:cursor-not-allowed disabled:text-muted-foreground [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
    </div>
  )
}
