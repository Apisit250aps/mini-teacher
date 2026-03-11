'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { yearCreateSchema } from '@/core/domain/schema/year.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Textarea } from '../../../ui/textarea'
import { useYearMutations } from '@/hooks/queries/year-query'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function YearCreateCard() {
  const router = useRouter()
  const session = useSession()
  const methods = useForm({
    resolver: zodResolver(yearCreateSchema),
    defaultValues: {
      year: new Date().getFullYear() + 543,
      userId: session.data?.user.id,
      term: 1,
      description: '',
      isActive: true,
    },
  })

  const { create } = useYearMutations()

  return (
    <>
      <Form {...methods}>
        <form
          className="w-full"
          onSubmit={methods.handleSubmit((data) =>
            create(data).then(() => router.refresh()),
          )}
        >
          <Card className="w-full">
            <CardHeader>
              <CardTitle>สร้างปีการศึกษา</CardTitle>
              <CardDescription className="text-pretty">
                เริ่มต้นการจัดการห้องเรียนของคุณด้วยการสร้างปีการศึกษาใหม่
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6">
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
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <Button type="submit" className="w-full">
                สร้างปีการศึกษา
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </>
  )
}
