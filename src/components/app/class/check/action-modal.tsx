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
import { useStudentCheck } from '@/hooks/app/use-check'
import { useClassContext } from '@/hooks/app/use-class'
import { useOverlay } from '@/hooks/contexts/use-overlay'
import { useCheckQueries } from '@/hooks/queries/use-check'
import { onSettledToast } from '@/lib/utils/hooks'
import { zodResolver } from '@hookform/resolvers/zod'
import { Calendar } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'

const toDateInputValue = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const getDefaultCheckDateValue = (checkDates: Array<{ date: string }>) => {
  if (!checkDates.length) {
    return toDateInputValue(new Date())
  }

  const latestDate = checkDates
    .map((item) => new Date(item.date))
    .filter((date) => !Number.isNaN(date.getTime()))
    .sort((a, b) => b.getTime() - a.getTime())[0]

  if (!latestDate) {
    return toDateInputValue(new Date())
  }

  const nextDate = new Date(latestDate)
  nextDate.setDate(nextDate.getDate() + 1)
  return toDateInputValue(nextDate)
}

export function CheckDateCreateAction() {
  const { activeClass } = useClassContext()
  const { create } = useCheckQueries()
  const { closeAll } = useOverlay()
  const { checkDates } = useStudentCheck()
  const defaultDate = useMemo(
    () => getDefaultCheckDateValue(checkDates),
    [checkDates],
  )

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
      date: defaultDate,
    },
  })

  useEffect(() => {
    if (methods.formState.isDirty) return
    methods.reset({
      date: defaultDate,
    })
  }, [defaultDate, methods])

  const onSubmit = async (data: { date: string }) => {
    await create
      .mutateAsync(
        {
          body: {
            date: data.date,
          },
          params: {
            path: {
              classId: activeClass?.id ?? '',
            },
          },
        },
        {
          onSettled(data, error, _variables, _, context) {
            onSettledToast(data, error)
            context.client.refetchQueries({})
            methods.reset({ date: defaultDate })
            closeAll()
          },
        },
      )
      .then((res) => console.log(res))
  }
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
