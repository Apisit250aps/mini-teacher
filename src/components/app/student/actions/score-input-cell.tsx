'use client'

import { Input } from '@/components/ui/input'
import { useClassContext } from '@/hooks/app/use-class'
import { useYearContext } from '@/hooks/app/use-year'
import { useScoreQueries } from '@/hooks/queries/use-score'
import type { ScoreAssignDetail } from '@/models/domain'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { Controller, useForm } from 'react-hook-form'
import z from 'zod'

type ScoreInputCellProps = {
  assign: ScoreAssignDetail
  studentId: string
  disabled?: boolean
}

export function ScoreInputCell({
  disabled = false,
  assign,
  studentId,
}: ScoreInputCellProps) {
  const { activeClass } = useClassContext()
  const { activeYear } = useYearContext()
  const { scoreStudent, onInputScore } = useScoreQueries()
  const schema = useMemo(
    () =>
      z.object({
        score: z
          .string()
          .min(1, 'กรุณากรอกคะแนน')
          .refine((v) => !Number.isNaN(Number(v)), 'ต้องเป็นตัวเลข')
          .refine(
            (v) => Number(v) >= assign.minScore,
            `ต้องไม่น้อยกว่า ${assign.minScore}`,
          )
          .refine(
            (v) => Number(v) <= assign.maxScore,
            `ต้องไม่เกิน ${assign.maxScore}`,
          ),
      }),
    [assign.minScore, assign.maxScore],
  )

  const methods = useForm({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: {
      score: String(
        assign.scores.find((s) => s.studentId === studentId)?.score ?? '',
      ),
    },
  })

  const isFocusedRef = useRef(false)

  useEffect(() => {
    if (isFocusedRef.current) return
    methods.reset({
      score: String(
        assign.scores.find((s) => s.studentId === studentId)?.score ?? '',
      ),
    })
  }, [methods, assign.scores, studentId])

  const onDraftChange = useCallback(
    (value: string) => {
      methods.setValue('score', value, {
        shouldDirty: true,
      })
    },
    [methods],
  )

  const onCommit = useCallback(
    async (score: number) => {
      if (!activeYear.id || !activeClass?.id) return

      await onInputScore(assign.id, studentId, score)
    },
    [activeYear.id, activeClass, onInputScore, assign.id, studentId],
  )

  const commitValue = useCallback(
    async (rawValue: string) => {
      const normalized =
        rawValue.trim() === '' ? String(assign.minScore) : rawValue
      methods.setValue('score', normalized, {
        shouldDirty: true,
        shouldValidate: true,
      })

      const isValid = await methods.trigger('score')
      if (!isValid) return

      const safeScore = Number(methods.getValues('score'))
      onDraftChange(String(safeScore))
      await onCommit(safeScore)
    },
    [methods, assign.minScore, onDraftChange, onCommit],
  )

  const errorMessage = methods.formState.errors.score?.message

  return (
    <Controller
      key={`${assign.id}-${studentId}`}
      control={methods.control}
      name="score"
      render={({ field }) => (
        <Input
          className="[&::-webkit-outer-spin-button]:hidden [&::-webkit-inner-spin-button]:hidden max-w-20 w-full"
          type="number"
          min={assign.minScore}
          max={assign.maxScore}
          value={field.value ?? ''}
          aria-invalid={!!errorMessage}
          title={errorMessage ? String(errorMessage) : undefined}
          onFocus={() => {
            isFocusedRef.current = true
          }}
          onChange={(e) => {
            field.onChange(e.target.value)
            onDraftChange(e.target.value)
          }}
          onBlur={async (e) => {
            field.onBlur()
            isFocusedRef.current = false
            await commitValue(e.target.value)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              e.currentTarget.blur()
            }
          }}
          disabled={disabled || scoreStudent.isPending || !assign.isEditable}
        />
      )}
    />
  )
}
