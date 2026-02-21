'use client'

import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { Controller, useForm } from 'react-hook-form'
import z from 'zod'

type ScoreInputCellForm = {
  score: string
}

type ScoreInputCellProps = {
  value: string | number
  minScore: number
  maxScore: number
  onDraftChange: (value: string) => void
  onCommit: (score: number) => Promise<void>
  disabled?: boolean
}

export function ScoreInputCell({
  value,
  minScore,
  maxScore,
  onDraftChange,
  onCommit,
  disabled = false,
}: ScoreInputCellProps) {
  const schema = useMemo(
    () =>
      z.object({
        score: z
          .string()
          .min(1, 'กรุณากรอกคะแนน')
          .refine((v) => !Number.isNaN(Number(v)), 'ต้องเป็นตัวเลข')
          .refine((v) => Number(v) >= minScore, `ต้องไม่น้อยกว่า ${minScore}`)
          .refine((v) => Number(v) <= maxScore, `ต้องไม่เกิน ${maxScore}`),
      }),
    [maxScore, minScore],
  )

  const methods = useForm<ScoreInputCellForm>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: {
      score: String(value ?? ''),
    },
  })

  const isFocusedRef = useRef(false)

  useEffect(() => {
    if (isFocusedRef.current) return
    methods.reset({ score: String(value ?? '') })
  }, [methods, value])

  const commitValue = useCallback(
    async (rawValue: string) => {
      const normalized = rawValue.trim() === '' ? String(minScore) : rawValue
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
    [methods, minScore, onCommit, onDraftChange],
  )

  const errorMessage = methods.formState.errors.score?.message

  return (
    <Controller
      control={methods.control}
      name="score"
      render={({ field }) => (
        <Input
          className="[&::-webkit-outer-spin-button]:hidden [&::-webkit-inner-spin-button]:hidden max-w-20 w-full"
          type="number"
          min={minScore}
          max={maxScore}
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
          disabled={disabled}
        />
      )}
    />
  )
}
