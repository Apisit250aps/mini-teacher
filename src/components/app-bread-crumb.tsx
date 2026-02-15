'use client'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { z } from 'zod'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { useYearContext } from '@/hooks/app/use-year';

export default function AppBreadCrumb() {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean).slice(2)
  const {activeYear} = useYearContext()
  const uuidSchema = z.uuid()

  const isUuid = (value: string) => uuidSchema.safeParse(value).success

  const formatSegment = (segment: string) => {
    if (isUuid(segment)) {
      return '...'
    }

    return decodeURIComponent(segment)
      .replace(/[-_]+/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase())
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.map((segment, index) => {
          const href = `/${activeYear.year}/${activeYear.term}/${segments.slice(0, index + 1).join('/')}`
          const isLast = index === segments.length - 1
          const label = formatSegment(segment)
          return (
            <React.Fragment key={`${segment}-${index}`}>
              {index > 0 ? <BreadcrumbSeparator /> : null}
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={href}>{label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
