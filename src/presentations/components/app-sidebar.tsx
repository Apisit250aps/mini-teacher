'use client'

import * as React from 'react'
import { Calendar1, GraduationCap, LibraryBig } from 'lucide-react'

import { NavMenu } from '@/components/nav-menu'
import { NavUser } from '@/components/nav-user'
import { TeamSwitcher } from '@/components/team-switcher'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { useClassContext } from '@/hooks/app/use-class'
import { useYearContext } from '@/hooks/app/use-year'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { classRoutes } = useClassContext()
  const { activeYear } = useYearContext()

  const basePath = `/${activeYear.year}/${activeYear.term}/class`

  const nav = [
    { name: 'ห้องเรียน', url: `${basePath}/manage`, icon: LibraryBig },
    { name: 'นักเรียน', url: `${basePath}/student`, icon: GraduationCap },
    { name: 'เทอม', url: `${basePath}/term`, icon: Calendar1 },
  ]
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
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
