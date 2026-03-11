'use client'

import * as React from 'react'
import { Calendar1, ChartArea, GraduationCap, LibraryBig } from 'lucide-react'

import { NavMain } from '@/presentations/components/app/base/nav-main'
import { NavMenu } from '@/presentations/components/app/base/nav-menu'
import { NavUser } from '@/presentations/components/app/base/nav-user'
import { YearSwitcher } from '@/presentations/components/app/year/year-switcher'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/presentations/components/ui/sidebar'
import { useClassContext } from '@/hooks/app/use-class'
import { useYearContext } from '@/hooks/app/use-year'
import Link from 'next/link'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { active } = useYearContext()
  const { classes } = useClassContext()

  const basePath = React.useMemo(
    () => (active ? `/${active.year}/${active.term}/class` : '/class'),
    [active],
  )

  const nav = React.useMemo(
    () => [
      { name: 'ห้องเรียน', url: `${basePath}/manage`, icon: LibraryBig },
      { name: 'นักเรียน', url: `${basePath}/student`, icon: GraduationCap },
      { name: 'เทอม', url: `${basePath}/term`, icon: Calendar1 },
    ],
    [basePath],
  )

  const classNavItems = React.useMemo(() => {
    if (!classes.length) return []
    return classes.map((cls) => ({
      title: cls.name,
      url: `${basePath}/${cls.id}`,
      icon: LibraryBig,
      isActive: false,
      items: [
        { title: 'ภาพรวม', url: `${basePath}/${cls.id}` },
        { title: 'การเช็คชื่อ', url: `${basePath}/${cls.id}/checks` },
        { title: 'งานที่มอบหมาย', url: `${basePath}/${cls.id}/assignments` },
        { title: 'รายชื่อนักเรียน', url: `${basePath}/${cls.id}/members` },
      ],
    }))
  }, [basePath, classes])

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <YearSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href={`${basePath}/`}>
                <ChartArea />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarGroup>
        {classNavItems.length > 0 && <NavMain items={classNavItems} />}
        <NavMenu nav={nav} label="การจัดการ" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
