'use client'

import * as React from 'react'
import { GraduationCap, LibraryBig } from 'lucide-react'

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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { classRoutes } = useClassContext()
  const nav = [
    { name: 'ห้องเรียน', url: 'manage', icon: LibraryBig },
    { name: 'นักเรียน', url: 'student', icon: GraduationCap },
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
