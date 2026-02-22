'use client'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import z from 'zod'

const schema = z.object({
  year: z.number().min(4, 'กรุณากรอกปีการศึกษาอย่างน้อย 4 ตัวอักษร'),
  term: z.number().min(1).max(3),
})

export default function YearCreateForm({
  value,
  onSubmit,
}: {
  value?: { year: number; term: number }
  onSubmit: (data: { year: number; term: number }) => void
}) {
  const methods = useForm<{ year: number; term: number }>({
    resolver: zodResolver(schema),
    defaultValues: {
      year: value?.year ?? new Date().getFullYear() + 543,
      term: value?.term ?? 1,
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
        <div className="flex justify-end">
          <Button type="submit">สร้าง</Button>
        </div>
      </form>
    </Form>
  )
}
