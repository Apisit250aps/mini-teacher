'use client'
import React from 'react'
import DataTable from '@/components/share/table/data-table'
import { useStudentQueries } from '@/hooks/queries/use-student'
import { ColumnDef } from '@tanstack/react-table'
import { Student } from '@/models/entities'
import { Checkbox } from '@/components/ui/checkbox'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { useGetClassMembers } from '@/hooks/queries/use-class'

const columns: ColumnDef<Student>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="เลือกทั้งหมด"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="เลือกแถว"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'code',
    header: 'รหัสนักเรียน',
    cell: ({ row }) => {
      const student = row.original.code
      return student
    },
  },
  {
    accessorKey: 'prefix',
    header: 'คำนำหน้า',
    cell: ({ row }) => {
      const student = row.original.prefix
      return student
    },
  },
  {
    accessorKey: 'firstName',
    header: 'ชื่อ',
    cell: ({ row }) => {
      const student = row.original.firstName
      return student
    },
  },
  {
    accessorKey: 'lastName',
    header: 'นามสกุล',
    cell: ({ row }) => {
      const student = row.original.lastName
      return student
    },
  },
]

export default function StudentSelectTable({
  onSubmit,
}: {
  onSubmit: (studentIds: string[]) => void
}) {
  const membersQuery = useGetClassMembers()
  const { data: members } = membersQuery

  const { list } = useStudentQueries()
  const { data } = list
  const methods = useForm({
    resolver: zodResolver(
      z.object({
        students: z
          .array(z.string())
          .min(1, 'กรุณาเลือกนักเรียนอย่างน้อยหนึ่งคน'),
      }),
    ),
  })

  const excludeStudent = data?.data?.filter((student) => {
    return !members?.some((member) => member.student.id === student.id)
  })

  return (
    <Form {...methods}>
      <form
        className="flex flex-col items-center gap-4 w-full"
        onSubmit={methods.handleSubmit((data) => onSubmit(data.students))}
      >
        <FormField
          control={methods.control}
          name="students"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <DataTable
                  columns={columns}
                  data={excludeStudent ?? []}
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex w-full items-center justify-end">
          <Button type="submit">เพิ่มสมาชิกที่เลือก</Button>
        </div>
      </form>
    </Form>
  )
}
