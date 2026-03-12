'use client'

import { useEffect, useState } from 'react'
import MDEditor from '@uiw/react-md-editor'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/presentations/components/ui/dialog'
import { Button } from '@/presentations/components/ui/button'
import { Checkbox } from '@/presentations/components/ui/checkbox'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/presentations/components/ui/tabs'

type DocumentData = { content: string; version: string } | null

interface ConsentDialogProps {
  open: boolean
  onAccept: () => void
  onDecline: () => void
  readOnly?: boolean
  initialTab?: 'tos' | 'pp'
  onClose?: () => void
}

// Inner component — only mounted when dialog is open, so useEffect runs once on mount
function ConsentContent({
  onAccept,
  onDecline,
  readOnly = false,
  initialTab = 'tos',
  onClose,
}: Pick<
  ConsentDialogProps,
  'onAccept' | 'onDecline' | 'readOnly' | 'initialTab' | 'onClose'
>) {
  const [tos, setTos] = useState<DocumentData>(null)
  const [pp, setPp] = useState<DocumentData>(null)
  const [loading, setLoading] = useState(true)
  const [acceptedTos, setAcceptedTos] = useState(false)
  const [acceptedPp, setAcceptedPp] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch('/api/document?latestType=TOS').then((r) => r.json()),
      fetch('/api/document?latestType=PRIVACY_POLICY').then((r) => r.json()),
    ])
      .then(([tosRes, ppRes]) => {
        setTos(tosRes.data ?? null)
        setPp(ppRes.data ?? null)
      })
      .catch(() => {
        setTos(null)
        setPp(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const canAccept = acceptedTos && acceptedPp

  return (
    <>
      <DialogHeader className="shrink-0 px-6 pt-6 pb-3">
        <DialogTitle>ข้อกำหนดและนโยบายความเป็นส่วนตัว</DialogTitle>
        <DialogDescription>
          {readOnly
            ? 'ข้อกำหนดการใช้งานและนโยบายความเป็นส่วนตัวของ Mini Teacher'
            : 'กรุณาอ่านและยอมรับข้อกำหนดการใช้งานและนโยบายความเป็นส่วนตัวก่อนเข้าสู่ระบบ'}
        </DialogDescription>
      </DialogHeader>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-6">
        {loading ? (
          <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
            กำลังโหลดเอกสาร...
          </div>
        ) : (
          <Tabs
            defaultValue={initialTab}
            className="flex min-h-0 flex-1 flex-col"
          >
            <TabsList className="shrink-0">
              <TabsTrigger value="tos">ข้อกำหนดการใช้งาน</TabsTrigger>
              <TabsTrigger value="pp">นโยบายความเป็นส่วนตัว</TabsTrigger>
            </TabsList>
            <TabsContent
              value="tos"
              className="mt-3 min-h-0 flex-1 overflow-y-auto rounded-md border p-4"
            >
              {tos ? (
                <div data-color-mode="light">
                  <MDEditor.Markdown source={tos.content} />
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  ไม่พบเอกสารข้อกำหนดการใช้งาน
                </p>
              )}
            </TabsContent>
            <TabsContent
              value="pp"
              className="mt-3 min-h-0 flex-1 overflow-y-auto rounded-md border p-4"
            >
              {pp ? (
                <div data-color-mode="light">
                  <MDEditor.Markdown source={pp.content} />
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  ไม่พบเอกสารนโยบายความเป็นส่วนตัว
                </p>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>

      <DialogFooter className="shrink-0 flex-col items-start gap-3 border-t px-6 py-4 sm:flex-col sm:items-start">
        {readOnly ? (
          <div className="flex w-full justify-end">
            <Button type="button" onClick={onClose}>
              ปิด
            </Button>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-2">
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <Checkbox
                  checked={acceptedTos}
                  onCheckedChange={(v) => setAcceptedTos(v === true)}
                  id="consent-tos"
                />
                <span>
                  ฉันได้อ่านและยอมรับ <strong>ข้อกำหนดการใช้งาน</strong>
                  {tos?.version ? ` (${tos.version})` : ''}
                </span>
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <Checkbox
                  checked={acceptedPp}
                  onCheckedChange={(v) => setAcceptedPp(v === true)}
                  id="consent-pp"
                />
                <span>
                  ฉันได้อ่านและยอมรับ <strong>นโยบายความเป็นส่วนตัว</strong>
                  {pp?.version ? ` (${pp.version})` : ''}
                </span>
              </label>
            </div>
            <div className="flex w-full justify-end gap-2">
              <Button variant="outline" type="button" onClick={onDecline}>
                ยกเลิก
              </Button>
              <Button type="button" disabled={!canAccept} onClick={onAccept}>
                ยอมรับและเข้าสู่ระบบ
              </Button>
            </div>
          </>
        )}
      </DialogFooter>
    </>
  )
}

export function ConsentDialog({
  open,
  onAccept,
  onDecline,
  readOnly = false,
  initialTab = 'tos',
  onClose,
}: ConsentDialogProps) {
  return (
    <Dialog open={open}>
      <DialogContent
        showCloseButton={false}
        className="flex max-h-[90vh] flex-col gap-0 p-0 sm:max-w-2xl"
      >
        {open && (
          <ConsentContent
            onAccept={onAccept}
            onDecline={onDecline}
            readOnly={readOnly}
            initialTab={initialTab}
            onClose={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
