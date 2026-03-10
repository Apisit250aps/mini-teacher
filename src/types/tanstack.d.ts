import '@tanstack/react-table'

declare module '@tanstack/react-table' {
  // 1. ระบุชื่อ Interface ที่ต้องการขยาย
  interface ColumnMeta<TData extends RowData, TValue> {
    // 2. เพิ่ม property ที่คุณต้องการใช้งาน
    className?: string
    // คุณสามารถเพิ่มอย่างอื่นได้ด้วย เช่น alignment, tooltip, ฯลฯ
    align?: 'left' | 'center' | 'right'
  }
}