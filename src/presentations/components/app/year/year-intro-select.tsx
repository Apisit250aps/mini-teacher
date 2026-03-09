'use client'
import React, { useCallback } from 'react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { YearWithClasses } from '@/core/domain/repositories/year'
import { useRouter } from 'next/navigation'

export default function YearIntroSelect({
  years,
}: {
  years: YearWithClasses[]
}) {
  const router = useRouter()
  const [selectedYear, setSelectedYear] = React.useState<string>(
    years.length > 0 ? `${years[0].year}/${years[0].term}` : '',
  )

  const handleSubmit = useCallback(() => {
    const [year, term] = selectedYear.split('/')
    router.push(`/${year}/${term}/class`)
  }, [router, selectedYear])

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>เลือกปีการศึกษา</CardTitle>
        <CardDescription>
          กรุณาเลือกปีการศึกษาที่คุณต้องการจัดการหรือเข้าร่วม
          เพื่อเริ่มต้นการใช้งานระบบจัดการห้องเรียนของเรา
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="เลือกปีการศึกษา" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>ปีการศึกษา</SelectLabel>
              {years.map((item) => (
                <SelectItem key={item.id} value={`${item.year}/${item.term}`}>
                  ปีการศึกษา {item.year} เทอม {item.term}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full" onClick={handleSubmit}>
          เลือก
        </Button>
      </CardFooter>
    </Card>
  )
}
