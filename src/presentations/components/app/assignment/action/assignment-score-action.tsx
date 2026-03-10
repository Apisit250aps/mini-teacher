'use client'

import { Score } from '@/core/domain/entities'
import { useScoreStudentMutations } from '@/hooks/queries'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'
import React from 'react'
import { toast } from 'sonner'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from '@/presentations/components/ui/form'
import { Input } from '@/presentations/components/ui/input'

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
  const inputRef = useRef<HTMLInputElement>(null)

  const scoreSchema = z.object({
    score: z
      .number({ error: 'กรุณากรอกคะแนน' })
      .min(minScore, `คะแนนต้องไม่น้อยกว่า ${minScore}`)
      .max(maxScore, `คะแนนต้องไม่เกิน ${maxScore}`),
  })

  type FormValues = z.infer<typeof scoreSchema>

  const form = useForm<FormValues>({
    resolver: zodResolver(scoreSchema),
    defaultValues: { score: record?.score },
  })

  // Sync form value when record changes from server (e.g. after another cell's
  // mutation invalidates the query), but only if this input is NOT focused so
  // we never interrupt the user while they are typing.
  useEffect(() => {
    if (document.activeElement !== inputRef.current) {
      form.reset({ score: record?.score })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [record?.id, record?.score])

  const onSubmit = async ({ score }: FormValues) => {
    if (record) {
      if (score === record.score) return
      await mutations.update(record.id, { score })
    } else {
      await mutations.create({ assignmentId, studentId, score })
    }
  }

  const onError = (errors: object) => {
    const first = Object.values(errors)[0] as { message?: string } | undefined
    if (first?.message) toast.error(first.message)
  }

  return (
    <Form {...form}>
      <form className="absolute inset-0">
        <FormField
          control={form.control}
          name="score"
          render={({ field }) => (
            <FormItem className="h-full space-y-0">
              <FormControl>
                <Input
                  type="number"
                  min={minScore}
                  max={maxScore}
                  readOnly={disabled}
                  placeholder="-"
                  {...field}
                  ref={(el) => {
                    field.ref(el)
                    ;(
                      inputRef as React.MutableRefObject<HTMLInputElement | null>
                    ).current = el
                  }}
                  value={field.value ?? ''}
                  onChange={(e) => {
                    const num = e.target.valueAsNumber
                    field.onChange(isNaN(num) ? undefined : num)
                  }}
                  onFocus={(e) => e.target.select()}
                  onBlur={() => {
                    field.onBlur()
                    form.handleSubmit(onSubmit, onError)()
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') e.currentTarget.blur()
                  }}
                  className="h-full w-full rounded-none border-none bg-transparent text-center text-xs shadow-none focus-visible:bg-blue-50 focus-visible:ring-inset [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
