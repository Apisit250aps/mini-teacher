'use client'
import { useYearContext } from '@/hooks/app/use-year'
import { studentGenerator, StudentGeneratorOptions } from '@/lib/helpers/faker'
import ModalDialog from '@/presentations/components/share/overlay/modal-dialog'
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
import React from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useClassContext } from '@/hooks/app/use-class'
import { useClassMemberMutations, useStudentMutations } from '@/hooks/queries'
import { useOverlay } from '@/hooks/contexts/use-overlay'

export default function StudentSeederAction() {
  const { closeAll } = useOverlay()
  const { teacher } = useYearContext()
  const { classes } = useClassContext()
  const { create } = useStudentMutations()
  const { create: addMember } = useClassMemberMutations()

  const methods = useForm({
    resolver: zodResolver(
      z.object({
        teacherId: z.uuid(),
        length: z.number().min(1).max(50).default(10),
        code_prefix: z.string().default('STU'),
        male: z.number().min(0).max(50).default(5),
        classRoom: z.string().default('none'),
      }),
    ),
    defaultValues: {
      teacherId: teacher,
      length: 10,
      code_prefix: 'STU',
      male: 5,
      classRoom: 'none',
    },
  })

  const onSubmit = (data: StudentGeneratorOptions) => {
    const students = studentGenerator({
      teacherId: data.teacherId,
      length: data.length,
      code_prefix: data.code_prefix,
      male: data.male,
    })

    students.forEach(async (student) => {
      const result = await create(student)
      if (methods.getValues('classRoom') !== 'none') {
        await addMember({
          studentId: result.id,
          classId: methods.getValues('classRoom') as string,
        })
      }
    })
    closeAll()
  }

  return (
    <ModalDialog
      title={'เพิ่มนักเรียน'}
      description="สร้างข้อมูลนักเรียน"
      dialogKey={'SEED_STUDENT_ACTION'}
      trigger={<Button>เพิ่มนักเรียนอัตโนมัติ (จำลองข้อมูล)</Button>}
      closeOutside={false}
    >
      <Form {...methods}>
        <form
          className={'flex flex-col gap-4'}
          onSubmit={methods.handleSubmit(onSubmit)}
        >
          <div className="grid gap-4">
            <FormField
              control={methods.control}
              name="length"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>จำนวน</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      value={field.value ?? 10}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      placeholder="กรอกจำนวน"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={methods.control}
              name="code_prefix"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>คำนำหน้ารหัสนักเรียน</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="กรอกคำนำหน้ารหัสนักเรียน" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={methods.control}
              name="male"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>จำนวนชาย</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      max={methods.getValues('length')}
                      value={field.value ?? 5}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      placeholder="กรอกจำนวนชาย"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={methods.control}
              name="male"
              render={() => (
                <FormItem>
                  <FormLabel>จำนวนหญิง</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      value={
                        ((methods.getValues('length') as number) ?? 10) -
                        ((methods.getValues('male') as number) ?? 5)
                      }
                      placeholder="กรอกจำนวนหญิง"
                      readOnly
                      onChange={() => {}}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={methods.control}
              name="classRoom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>นำเข้าห้องเรียน</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) =>
                        field.onChange(value === 'none' ? '' : value)
                      }
                      defaultValue={field.value || 'none'}
                    >
                      <SelectTrigger className="w-full max-w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Classes</SelectLabel>
                          <SelectItem value="none">
                            ไม่เลือกห้องเรียน
                          </SelectItem>
                          {classes.map((item) => (
                            <SelectItem key={item.id} value={item.id}>
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit">สร้างข้อมูลนักเรียน</Button>
          </div>
        </form>
      </Form>
    </ModalDialog>
  )
}
