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
import { useYearContext } from '@/hooks/app/use-year'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import z from 'zod'

export default function YearCreateForm() {
  const methods = useForm<{ year: string; term: string }>({
    resolver: zodResolver(
      z.object({
        year: z.string().min(4, 'กรุณากรอกปีการศึกษาอย่างน้อย 4 ตัวอักษร'),
        term: z.string().min(1).max(3),
      }),
    ),
    defaultValues: {
      year: (new Date().getFullYear() + 543).toString(),
      term: '1',
    },
  })

  const { onCreate } = useYearContext()

  return (
    <Form {...methods}>
      <form
        className="grid gap-4"
        onSubmit={methods.handleSubmit(onCreate)}
      >
        <FormField
          control={methods.control}
          name="year"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ปีการศึกษา</FormLabel>
              <FormControl>
                <Input {...field} placeholder="กรอกปีการศึกษา" />
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
                <Input {...field} placeholder="กรอกภาคการศึกษา" />
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
