'use client'

import { Score } from '@/core/domain/entities'
import { useScoreStudentMutations } from '@/hooks/queries'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import z from 'zod'
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
                  disabled={disabled}
                  placeholder="-"
                  {...field}
                  value={field.value ?? ''}
                  onChange={(e) => {
                    const num = e.target.valueAsNumber
                    field.onChange(isNaN(num) ? undefined : num)
                  }}
                  onFocus={(e) => e.target.select()}
                  onBlur={(e) => {
                    field.onBlur()
                    form.handleSubmit(onSubmit, onError)()
                    e.target.blur()
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
