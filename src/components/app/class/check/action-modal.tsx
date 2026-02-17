'use client'
import ModalDialog from '@/components/share/overlay/modal-dialog'
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
import { useClassContext } from '@/hooks/app/use-class'
import { useYearContext } from '@/hooks/app/use-year'
import { useOverlay } from '@/hooks/contexts/use-overlay'
import { useCheckQueries } from '@/hooks/queries/use-check'
import { zodResolver } from '@hookform/resolvers/zod'
import { Calendar } from 'lucide-react'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'

export function CheckDateCreateAction() {
  const { activeYear } = useYearContext()
  const { activeClass } = useClassContext()
  const { create } = useCheckQueries()
  const { closeAll } = useOverlay()
  const methods = useForm({
    resolver: zodResolver(
      z.object({
        date: z
          .string()
          .min(1, 'กรุณากรอกวันที่')
          .refine((value) => {
            const date = new Date(value)
            return !isNaN(date.getTime())
          }, 'กรุณากรอกวันที่ที่ถูกต้อง'),
      }),
    ),
    defaultValues: {
      date: '',
    },
  })

  const onSubmit = useCallback(
    async (data: { date: string }) => {
      await create
        .mutateAsync(
          {
            body: {
              date: data.date,
            },
            params: {
              path: {
                yearId: activeYear?.id ?? '',
                classId: activeClass?.id ?? '',
              },
            },
          },
          {
            onSuccess() {
              methods.reset()
              closeAll()
            },
          },
        )
        .then((res) => console.log(res))
    },
    [create, activeYear?.id, activeClass?.id, methods, closeAll],
  )
  return (
    <ModalDialog
      title={`สร้างรายการเช็คชื่อใหม่`}
      description={`กรอกข้อมูลเพื่อสร้างรายการเช็คชื่อใหม่`}
      dialogKey="CREATE_CHECK_DATE_ACTION"
      closeOutside={false}
      trigger={
        <Button>
          <Calendar />
        </Button>
      }
    >
      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={methods.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>วันที่</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="กรอกวันที่" type="date" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button type="submit">สร้างรายการเช็คชื่อ</Button>
          </div>
        </form>
      </Form>
    </ModalDialog>
  )
}
