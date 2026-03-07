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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useClassContext } from '@/hooks/app/use-class'
import { useYearContext } from '@/hooks/app/use-year'
import { useOverlay } from '@/hooks/contexts/use-overlay'
import { useScoreQueries } from '@/hooks/queries/use-score'
import { assignEnum } from '@/models/entities'
import { onSettledToast } from '@/lib/utils/hooks'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'

const CreateScoreAssignFormSchema = z.object({
  name: z.string().min(1, 'กรุณากรอกชื่องาน/ข้อสอบ'),
  description: z.string().optional().nullable(),
  minScore: z
    .number()
    .refine((v) => !v || !isNaN(Number(v)), 'ต้องเป็นตัวเลข')
    .refine((v) => !v || Number(v) >= 0, 'คะแนนต่ำสุดต้องไม่น้อยกว่า 0'),
  maxScore: z
    .number()
    .refine((v) => !v || !isNaN(Number(v)), 'ต้องเป็นตัวเลข')
    .refine((v) => !v || Number(v) <= 10, 'คะแนนสูงสุดต้องไม่เกิน 10'),
  type: z.enum(assignEnum).optional(),
  assignDate: z.string().optional().nullable(),
  finalDate: z.string().optional().nullable(),
})

type CreateScoreAssignForm = z.infer<typeof CreateScoreAssignFormSchema>

export function ScoreAssignCreateAction() {
  const { activeClass } = useClassContext()
  const { activeYear } = useYearContext()
  const { create } = useScoreQueries()
  const { closeAll } = useOverlay()

  const methods = useForm<CreateScoreAssignForm>({
    resolver: zodResolver(CreateScoreAssignFormSchema),
    defaultValues: {
      name: '',
      description: null,
      minScore: 0,
      maxScore: 10,
      type: undefined,
      assignDate: null,
      finalDate: null,
    },
  })

  const onSubmit = useCallback(
    async (data: CreateScoreAssignForm) => {
      if (!activeClass || !activeYear) return

      await create
        .mutateAsync(
          {
            body: {
              name: data.name,
              description: data.description,
              minScore: data.minScore ? Number(data.minScore) : undefined,
              maxScore: data.maxScore ? Number(data.maxScore) : undefined,
              type: data.type,
              assignDate: data.assignDate
                ? new Date(data.assignDate).toISOString()
                : null,
              finalDate: data.finalDate
                ? new Date(data.finalDate).toISOString()
                : null,
            },
            params: {
              path: {
                classId: activeClass.id,
              },
            },
          },
          {
            onSettled(data, error, _variables, _, context) {
              onSettledToast(data, error)
              context.client.refetchQueries({})
              methods.reset()
              closeAll()
            },
          },
        )
        .then((res) => console.log(res))
    },
    [create, activeClass, activeYear, methods, closeAll],
  )

  return (
    <ModalDialog
      title="สร้างงาน/ข้อสอบใหม่"
      description="กรอกข้อมูลเพื่อสร้างงาน/ข้อสอบใหม่"
      dialogKey="CREATE_SCORE_ASSIGN_ACTION"
      closeOutside={false}
      trigger={
        <Button>
          <Plus />
        </Button>
      }
    >
      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={methods.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ชื่องาน/ข้อสอบ *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="เช่น งานที่ 1, สอบกลางภาค" />
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
                <FormLabel>รายละเอียด</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ''}
                    placeholder="รายละเอียดเพิ่มเติม (ถ้ามี)"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={methods.control}
              name="minScore"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>คะแนนต่ำสุด</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" placeholder="0" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={methods.control}
              name="maxScore"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>คะแนนสูงสุด</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" placeholder="100" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={methods.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ประเภท</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกประเภท" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {assignEnum.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type === 'ASSIGNMENT'
                          ? 'งาน'
                          : type === 'EXAM'
                            ? 'สอบ'
                            : 'แบบทดสอบ'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={methods.control}
              name="assignDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>วันที่มอบหมาย</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="date"
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={methods.control}
              name="finalDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>วันที่ส่ง</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="date"
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="submit">สร้างงาน/ข้อสอบ</Button>
          </div>
        </form>
      </Form>
    </ModalDialog>
  )
}
