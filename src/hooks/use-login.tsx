'use client'

import { UserLogin, UserLoginSchema } from '@/models/entities'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { createContext, useContext, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

type LoginContextValue = {
  onSubmit: (data: UserLogin) => void
  form: ReturnType<typeof useForm<UserLogin>>
}

const LoginContext = createContext<LoginContextValue | null>(null)

export function LoginProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  const onSubmit = useCallback(
    async (data: UserLogin) => {
      const result = await signIn('credentials', {
        redirect: false,
        name: data.name,
        password: data.password,
      })
      if (!result.error) {
        toast.success('เข้าสู่ระบบสำเร็จ')
        router.refresh()
        return
      }
      toast.error(`เข้าสู่ระบบไม่สำเร็จ!`)
      return
    },
    [router],
  )
  const methods = useForm<UserLogin>({
    resolver: zodResolver(UserLoginSchema),
    defaultValues: {
      name: '',
      password: '',
    },
  })

  return (
    <LoginContext.Provider value={{ onSubmit, form: methods }}>
      {children}
    </LoginContext.Provider>
  )
}

export function useLogin() {
  const ctx = useContext(LoginContext)
  if (!ctx) {
    throw new Error('useLogin must be used inside LoginProvider')
  }
  return ctx
}
