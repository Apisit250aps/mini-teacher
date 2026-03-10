'use client'
import { YearCreateData } from '@/core/domain/data'
import { yearCreateSchema } from '@/core/domain/schema/year.schema'
import { Button } from '@/presentations/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/presentations/components/ui/form'
import { Input } from '@/presentations/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Textarea } from '../../../ui/textarea'

export default function YearForm({
  value,
  onSubmit,
}: {
  value?: Omit<YearCreateData, 'userId'>
  onSubmit: (data: Omit<YearCreateData, 'userId'>) => void
}) {
  const methods = useForm({
    resolver: zodResolver(yearCreateSchema.omit({ userId: true })),
    defaultValues: {
      year: value?.year ?? new Date().getFullYear() + 543,
      term: value?.term ?? 1,
      description: value?.description ?? '',
      isActive: value?.isActive ?? true,
    },
  })

  return (
    <Form {...methods}>
      <form className="grid gap-4" onSubmit={methods.handleSubmit(onSubmit)}>
        <FormField
          control={methods.control}
          name="year"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ปีการศึกษา</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={(e) => {
                    field.onChange(Number(e.target.value))
                  }}
                  placeholder="กรอกปีการศึกษา"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={methods.control}
          name="term"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ภาคการศึกษา</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={(e) => {
                    field.onChange(Number(e.target.value))
                  }}
                  placeholder="กรอกภาคการศึกษา"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={methods.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>คำอธิบาย</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value ?? ''}
                  placeholder="กรอกคำอธิบาย"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit">
            {value ? 'บันทึกการเปลี่ยนแปลง' : 'สร้างปีการศึกษา'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
