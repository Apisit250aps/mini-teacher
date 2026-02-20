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
import { useOverlay } from '@/hooks/contexts/use-overlay'
import { useYearQueries } from '@/hooks/queries/use-year'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'

const schema = z.object({
  year: z.number().min(4, 'กรุณากรอกปีการศึกษาอย่างน้อย 4 ตัวอักษร'),
  term: z.number().min(1).max(3),
})

export default function YearCreateForm() {
  const { onCreate } = useYearQueries()
  const { closeAll } = useOverlay()
  
  const methods = useForm<{ year: number; term: number }>({
    resolver: zodResolver(schema),
    defaultValues: {
      year: new Date().getFullYear() + 543,
      term: 1,
    },
  })

  const onSubmit = useCallback(
    async (data: { year: number; term: number }) => {
      await onCreate({
        year: data.year,
        term: data.term,
      })
      methods.reset()
      closeAll()
    },
    [onCreate, methods, closeAll],
  )

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
