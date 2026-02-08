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
