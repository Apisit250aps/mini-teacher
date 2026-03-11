'use client'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/presentations/components/ui/dialog'

import { DIALOG_KEY, useOverlay } from '@/hooks/contexts/use-overlay'

import React from 'react'

const DIALOG_SIZE = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-lg',
  lg: 'sm:max-w-2xl',
  xl: 'sm:max-w-5xl',
  full: 'sm:max-w-[90vw]',
} as const

type DialogSize = keyof typeof DIALOG_SIZE

type ModalDialogProps = {
  title: string
  description?: string
  trigger?: React.ReactNode
  children?: React.ReactNode
  closeOutside?: boolean
  dialogKey?: string
  size?: DialogSize
}

export default function ModalDialog({
  title,
  description,
  trigger,
  children,
  closeOutside = true,
  dialogKey = DIALOG_KEY.MODAL_DIALOG,
  size = 'md',
}: ModalDialogProps) {
  const { open, closeOverlay, openOverlay } = useOverlay()
  return (
    <Dialog
      open={open[dialogKey] || false}
      onOpenChange={(v) =>
        v ? openOverlay(dialogKey) : closeOverlay(dialogKey)
      }
    >
      {trigger && (
        <DialogTrigger
          asChild
          onClick={(e) => {
            e.preventDefault()
            openOverlay(dialogKey)
          }}
        >
          {trigger}
        </DialogTrigger>
      )}
      <DialogContent
        className={DIALOG_SIZE[size]}
        onInteractOutside={closeOutside ? undefined : (e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  )
}
