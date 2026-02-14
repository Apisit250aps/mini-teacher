declare module '*.css' {
  const content: string
  export default content
}

type ApiResponse<T = unknown> = {
  success: boolean
  message: string
  error?: string
  data?: T
}

type FormValueProps<T = unknown> = {
  value?: T
  onSubmit: (data: T) => void
}


// declare module "next/server" {
//   interface NextRequest extends NextRequest {
//     // กำหนด Type ของ user ตามที่คุณใช้งาน (เช่น Student หรือ User interface)
//     user?: {
//       id: string;
//       role: string;
//       teacher?: string;
//     };
//   }
// }