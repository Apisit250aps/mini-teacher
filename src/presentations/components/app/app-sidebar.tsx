'use client'

import * as React from 'react'
import { Calendar1, GraduationCap, LibraryBig } from 'lucide-react'

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
import { useYearContext } from '@/hooks/app/use-year'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { active } = useYearContext()

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

  const classRoutes = React.useMemo(
    () => [{ name: 'จัดการ', url: `${basePath}/manage`, icon: LibraryBig }],
    [basePath],
  )

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <YearSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMenu nav={classRoutes} label="ห้องเรียน" />
        <NavMenu nav={nav} label="การจัดการ" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
