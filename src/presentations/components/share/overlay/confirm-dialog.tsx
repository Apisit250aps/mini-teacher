'use client'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useOverlay } from '@/hooks/contexts/use-overlay'

type ConfirmDialogProps = {
  title: string
  description?: string
  trigger?: React.ReactNode
  cancelText?: string
  confirmText?: string
  onConfirm?: () => void
  dialogKey: string
}

export function ConfirmDialog({
  title,
  description,
  trigger,
  onConfirm,
  cancelText = 'ยกเลิก',
  confirmText = 'ดำเนินการต่อ',
  dialogKey,
}: ConfirmDialogProps) {
  const { openOverlay, open, closeOverlay } = useOverlay()
  return (
    <AlertDialog
      open={open[dialogKey] || false}
      onOpenChange={(v) =>
        v ? openOverlay(dialogKey) : closeOverlay(dialogKey)
      }
    >
      {trigger && (
        <AlertDialogTrigger
          asChild
          onClick={(e) => {
            e.preventDefault()
            openOverlay(dialogKey)
          }}
        >
          {trigger}
        </AlertDialogTrigger>
      )}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => closeOverlay(dialogKey)}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
