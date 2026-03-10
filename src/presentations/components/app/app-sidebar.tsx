'use client'

import * as React from 'react'
import { Calendar1, GraduationCap, LibraryBig } from 'lucide-react'

import { NavMain } from '@/presentations/components/app/nav-main'
import { NavMenu } from '@/presentations/components/app/nav-menu'
import { NavUser } from '@/presentations/components/app/nav-user'
import { YearSwitcher } from '@/presentations/components/app/year/year-switcher'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/presentations/components/ui/sidebar'
import { useClassContext } from '@/hooks/app/use-class'
import { useYearContext } from '@/hooks/app/use-year'

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
        { title: 'งานที่มอบหมาย', url: `${basePath}/${cls.id}/assignments` },
        { title: 'การเช็คชื่อ', url: `${basePath}/${cls.id}/checks` },
        { title: 'รายชื่อ', url: `${basePath}/${cls.id}/members` },
      ],
    }))
  }, [basePath, classes])

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <YearSwitcher />
      </SidebarHeader>
      <SidebarContent>
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
