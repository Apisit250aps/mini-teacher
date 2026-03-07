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
import { ClassFormSchema, type ClassFormValue } from '@/models/entities'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Textarea } from '@/components/ui/textarea'

export default function ClassForm({
  value,
  onSubmit,
}: Readonly<FormValueProps<ClassFormValue>>) {
  // context
  const { activeYear } = useYearContext()
  // form
  const methods = useForm<ClassFormValue>({
    resolver: zodResolver(ClassFormSchema),
    defaultValues: {
      name: value?.name ?? '',
      subject: value?.subject ?? '',
      description: value?.description ?? '-',
      year: value?.year ?? activeYear?.id ?? '',
    },
  })

  const { handleSubmit } = methods

  return (
    <Form {...methods}>
      <form
        action=""
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 gap-4"
      >
        <FormField
          control={methods.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ชื่อชั้นเรียน</FormLabel>
              <FormControl>
                <Input {...field} placeholder="กรอกชื่อชั้นเรียน" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={methods.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>วิชา</FormLabel>
              <FormControl>
                <Input {...field} placeholder="กรอกชื่อวิชา" />
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
          <Button>{value ? 'บันทึกการเปลี่ยนแปลง' : 'สร้างชั้นเรียน'}</Button>
        </div>
      </form>
    </Form>
  )
}
