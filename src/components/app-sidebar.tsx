'use client'

import * as React from 'react'
import { LibraryBig } from 'lucide-react'

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
import { useClass } from '@/hooks/app/use-class'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { classRoutes } = useClass()
  const nav = [{ name: 'ห้องเรียน', url: 'manage', icon: LibraryBig }]
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
