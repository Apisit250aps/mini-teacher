'use client'
import React, { useState, useCallback } from 'react'
import { useDocumentListQuery, useDocumentMutations } from '@/hooks/queries'
import PageLayout from '@/presentations/components/layouts/page-layout'
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/presentations/components/ui/tabs'
import { Badge } from '@/presentations/components/ui/badge'
import { Button } from '@/presentations/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/presentations/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/presentations/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/presentations/components/ui/alert-dialog'
import DocumentCreateAction from '@/presentations/components/app/document/action/document-create-action'
import DocumentForm, {
  DocumentFormData,
} from '@/presentations/components/app/document/form/document-form'
import MarkdownEditor from '@/presentations/components/app/document/markdown-editor'
import type { Document } from '@/core/domain/entities'
import type { DocumentType } from '@/core/domain/entities/enums'

const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  TOS: 'ข้อกำหนดการใช้งาน',
  PRIVACY_POLICY: 'นโยบายความเป็นส่วนตัว',
}

const DOCUMENT_TABS: { value: DocumentType; label: string }[] = [
  { value: 'TOS', label: 'Terms of Service' },
  { value: 'PRIVACY_POLICY', label: 'Privacy Policy' },
]

export default function AdminDocumentView() {
  const { data: documents, isLoading } = useDocumentListQuery()
  const { update, remove } = useDocumentMutations()

  const [previewDoc, setPreviewDoc] = useState<Document | null>(null)
  const [editDoc, setEditDoc] = useState<Document | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const handleUpdate = useCallback(
    async (data: DocumentFormData) => {
      if (!editDoc) return
      await update(editDoc.id, {
        content: data.content,
        isActive: data.isActive,
      })
      setEditDoc(null)
    },
    [editDoc, update],
  )

  const handleDelete = useCallback(async () => {
    if (!deleteId) return
    await remove(deleteId)
    setDeleteId(null)
  }, [deleteId, remove])

  return (
    <PageLayout
      title="จัดการเอกสาร"
      description="เขียนและจัดการ Privacy Policy และ Terms of Service ในรูปแบบ Markdown"
    >
      <Tabs defaultValue="TOS" className="w-full">
        <TabsList>
          {DOCUMENT_TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {DOCUMENT_TABS.map((tab) => {
          const typeDocuments = documents.filter(
            (d) => String(d.type) === tab.value,
          )
          return (
            <TabsContent key={tab.value} value={tab.value}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-base font-semibold">
                  {DOCUMENT_TYPE_LABELS[tab.value]}
                </h2>
                <DocumentCreateAction defaultType={tab.value} />
              </div>

              {isLoading ? (
                <p className="text-muted-foreground text-sm">กำลังโหลด...</p>
              ) : typeDocuments.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  ยังไม่มีเอกสารในประเภทนี้
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>เวอร์ชัน</TableHead>
                      <TableHead>สถานะ</TableHead>
                      <TableHead>วันที่สร้าง</TableHead>
                      <TableHead className="text-right">จัดการ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {typeDocuments.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell className="font-mono font-medium">
                          {doc.version}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={doc.isActive ? 'default' : 'secondary'}
                          >
                            {doc.isActive ? 'ใช้งานอยู่' : 'ไม่ใช้งาน'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {new Date(doc.createdAt).toLocaleDateString('th-TH', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setPreviewDoc(doc)}
                            >
                              ดูตัวอย่าง
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditDoc(doc)}
                            >
                              แก้ไข
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => setDeleteId(doc.id)}
                            >
                              ลบ
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
          )
        })}
      </Tabs>

      {/* Preview Dialog */}
      <Dialog
        open={!!previewDoc}
        onOpenChange={(open) => !open && setPreviewDoc(null)}
      >
        <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {previewDoc
                ? `${DOCUMENT_TYPE_LABELS[previewDoc.type as DocumentType]} — v${previewDoc.version}`
                : ''}
            </DialogTitle>
            <DialogDescription>ดูตัวอย่างเอกสาร Markdown</DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-auto">
            {previewDoc && (
              <MarkdownEditor
                value={previewDoc.content}
                readOnly
                minHeight="500px"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={!!editDoc}
        onOpenChange={(open) => !open && setEditDoc(null)}
      >
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editDoc
                ? `แก้ไข ${DOCUMENT_TYPE_LABELS[editDoc.type as DocumentType]} — v${editDoc.version}`
                : ''}
            </DialogTitle>
            <DialogDescription>
              แก้ไขเนื้อหาเอกสาร (สามารถดูตัวอย่างได้ในแท็บ
              &quot;ดูตัวอย่าง&quot;)
            </DialogDescription>
          </DialogHeader>
          {editDoc && (
            <DocumentForm value={editDoc} lockType onSubmit={handleUpdate} />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ยืนยันการลบ</AlertDialogTitle>
            <AlertDialogDescription>
              คุณแน่ใจหรือไม่ที่จะลบเอกสารนี้?
              การดำเนินการนี้ไม่สามารถย้อนกลับได้
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>ลบ</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageLayout>
  )
}
