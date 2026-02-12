'use client'

import * as React from 'react'
import { Calendar, ChevronsUpDown, Plus } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { useYear } from '@/hooks/app/use-year'
import ModalDialog from './share/overlay/modal-dialog'
import YearCreateForm from './app/year/year-create-form'

export function TeamSwitcher() {
  const { isMobile } = useSidebar()
  const { activeYear, years, onSetyearActive } = useYear()

  if (!activeYear) {
    return null
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <Calendar className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  ปีการศึกษา {activeYear.year}
                </span>
                <span className="truncate text-xs">
                  ภาคเรียนที่ {activeYear.term}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Years
            </DropdownMenuLabel>
            {years?.map((year) => (
              <DropdownMenuItem
                key={year.id}
                onClick={() => onSetyearActive(year!)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                  <Calendar className="size-3.5 shrink-0" />
                </div>
                {year.term} / {year.year}
                {activeYear.id === year.id && (
                  <DropdownMenuShortcut>Current</DropdownMenuShortcut>
                )}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <ModalDialog
              title={'เพิ่มปีการศึกษา'}
              description={'สร้างปีการศึกษาใหม่'}
              dialogKey="ADD_YEAR_DIALOG"
              closeOutside={false}
              trigger={
                <DropdownMenuItem className="gap-2 p-2">
                  <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                    <Plus className="size-4" />
                  </div>
                  <div className="text-muted-foreground font-medium">
                    เพิ่มปีการศึกษา
                  </div>
                </DropdownMenuItem>
              }
            >
              <YearCreateForm />
            </ModalDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
