'use client'
'use no memo'
import { Button } from '@/presentations/components/ui/button'
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from '@/presentations/components/ui/table'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/presentations/components/ui/select'
import {
  IconChevronsLeft,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsRight,
} from '@tabler/icons-react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import React, { useEffect, useRef } from 'react'
import { useMemo } from 'react'
import { Label } from '@/presentations/components/ui/label'
import { Spinner } from '@/presentations/components/ui/spinner'
import { Input } from '../../ui/input'

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  value?: string[]
  onChange?: (value: string[]) => void
  limit?: number
  page?: number
  isLoading?: boolean
  autoWidth?: boolean
  filterCols?: (keyof TData)[]
}

export default function DataTable<TData, TValue>({
  columns,
  data,
  value,
  onChange,
  limit = 10,
  page = 1,
  isLoading = false,
  autoWidth = false,
  filterCols,
}: DataTableProps<TData & { id: string }, TValue>) {
  const memoData = useMemo(() => data || [], [data])
  const memoColumns = useMemo(() => columns, [columns])

  // Initialize rowSelection based on the initial value prop
  const initialRowSelection = useMemo(() => {
    if (value) {
      return value.reduce(
        (acc, id) => {
          acc[id] = true
          return acc
        },
        {} as Record<string, boolean>,
      )
    }
    return {}
  }, [value]) // Empty deps array ensures this only runs once on mount

  const [rowSelection, setRowSelection] = React.useState(initialRowSelection)
  const [globalFilter, setGlobalFilter] = React.useState('')
  const [pagination, setPagination] = React.useState({
    pageIndex: page - 1,
    pageSize: limit,
  })

  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: page - 1,
      pageSize: limit,
    }))
  }, [page, limit])

  // Use refs to track previous values and prevent infinite loops
  const prevValueRef = useRef<string[] | undefined>(undefined)
  const isInternalUpdateRef = useRef(false)
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: memoData,
    columns: memoColumns,
    state: {
      rowSelection,
      pagination,
      globalFilter,
    },
    enableRowSelection: true,
    getRowId: (row) => row.id,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, columnId, filterValue) => {
      if (!filterCols?.includes(columnId as keyof TData)) return false
      const value = row.getValue(columnId)
      return String(value ?? '')
        .toLowerCase()
        .includes(String(filterValue).toLowerCase())
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  // Handle row selection changes and notify parent component
  useEffect(() => {
    if (!isInternalUpdateRef.current) {
      const selectedIds = Object.keys(rowSelection)
      onChange?.(selectedIds)
    }
    isInternalUpdateRef.current = false
  }, [onChange, rowSelection])

  // Handle external value changes (from parent component)
  useEffect(() => {
    if (
      value &&
      JSON.stringify(value) !== JSON.stringify(prevValueRef.current)
    ) {
      prevValueRef.current = value
      isInternalUpdateRef.current = true

      const newSelection = value.reduce(
        (acc, id) => {
          acc[id] = true
          return acc
        },
        {} as Record<string, boolean>,
      )

      setRowSelection(newSelection)
    }
  }, [value])

  return (
    <div className="overflow-hidden rounded-md border p-4">
      {filterCols && filterCols.length > 0 && (
        <div className="flex items-center py-4">
          <Input
            placeholder="ค้นหา..."
            value={globalFilter}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="max-w-sm"
          />
        </div>
      )}
      <Table className={autoWidth ? 'w-auto' : ''}>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  style={{
                    width: header.getSize(),
                    minWidth: header.column.columnDef.minSize,
                    maxWidth: header.column.columnDef.maxSize,
                  }}
                  className={header.column.columnDef.meta?.className}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className={'h-10 text-center'}
              >
                <div className="flex items-center gap-2 justify-center">
                  <Spinner data-icon="inline-start" />
                  กำลังโหลด...
                </div>
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    style={{
                      width: cell.column.getSize(),
                      minWidth: cell.column.columnDef.minSize,
                      maxWidth: cell.column.columnDef.maxSize,
                    }}
                    className={cell.column.columnDef.meta?.className}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={memoColumns.length} className="text-center">
                ไม่มีข้อมูล
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between px-4 py-3">
        <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
          {table.getFilteredSelectedRowModel().rows.length > 0 && (
            <>
              เลือกแล้ว {table.getFilteredSelectedRowModel().rows.length} จาก{' '}
              {table.getFilteredRowModel().rows.length} แถว
            </>
          )}
        </div>
        <div className="flex w-full items-center gap-8 lg:w-fit">
          <div className="hidden items-center gap-2 lg:flex">
            <Label htmlFor="rows-per-page" className="text-sm font-medium">
              จำนวนที่แสดง
            </Label>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value))
              }}
            >
              <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
                <SelectItem value={`${memoData.length}`}>All</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-fit items-center justify-center text-sm font-medium">
            หน้า {table.getState().pagination.pageIndex + 1} จาก{' '}
            {table.getPageCount()}
          </div>
          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">หน้าแรก</span>
              <IconChevronsLeft />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">หน้าก่อนหน้า</span>
              <IconChevronLeft />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">หน้าถัดไป</span>
              <IconChevronRight />
            </Button>
            <Button
              variant="outline"
              className="hidden size-8 lg:flex"
              size="icon"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">หน้าสุดท้าย</span>
              <IconChevronsRight />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
