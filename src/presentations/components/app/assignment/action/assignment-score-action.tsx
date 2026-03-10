'use client'

import { Score } from '@/core/domain/entities'
import { scoreUpdateSchema } from '@/core/domain/schema'
import { useScoreStudentMutations } from '@/hooks/queries'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { Input } from '@/presentations/components/ui/input'

export type AssignmentScoreActionProps = {
  assignmentId: string
  studentId: string
  record: Score | undefined
  minScore: number
  maxScore: number
  disabled?: boolean
}

type FormValues = z.infer<typeof scoreUpdateSchema>

// Component is keyed by record?.id in the parent so it remounts
// whenever the record is created/updated, keeping defaultValues fresh.
export default function AssignmentScoreAction({
  assignmentId,
  studentId,
  record,
  minScore,
  maxScore,
  disabled = false,
}: AssignmentScoreActionProps) {
  const mutations = useScoreStudentMutations()

  const { register, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(scoreUpdateSchema),
    defaultValues: { score: record?.score },
  })

  const onSubmit = async ({ score }: FormValues) => {
    if (record) {
      if (score === record.score) return
      await mutations.update(record.id, { score })
    } else {
      await mutations.create({ assignmentId, studentId, score })
    }
  }

  const { onBlur, ...rest } = register('score', { valueAsNumber: true })

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <Input
        type="number"
        min={minScore}
        max={maxScore}
        disabled={disabled}
        placeholder="-"
        onFocus={(e) => e.target.select()}
        onBlur={(e) => {
          onBlur(e)
          handleSubmit(onSubmit)()
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') e.currentTarget.blur()
        }}
        className="h-full w-full rounded-none border-none bg-transparent text-center text-xs shadow-none focus-visible:bg-blue-50 focus-visible:ring-inset [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        {...rest}
      />
    </div>
  )
}
