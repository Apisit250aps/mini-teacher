'use client'

import { userEntitySchema } from '@/core/domain/schema';
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { createContext, useContext, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod';

const userLoginSchema = userEntitySchema.pick({ name: true, password: true })

type UserLogin = z.infer<typeof userLoginSchema>

type LoginContextValue = {
  onSubmit: (data: UserLogin) => void
  form: ReturnType<typeof useForm<UserLogin>>
  onGoogleSignIn: () => void
}

const LoginContext = createContext<LoginContextValue | null>(null)

export function LoginProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  const onSubmit = useCallback(
    async (data:UserLogin) => {
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
    resolver: zodResolver(userLoginSchema),
    defaultValues: {
      name: '',
      password: '',
    },
  })

  const onGoogleSignIn = useCallback(async () => {
    await signIn('google')
  }, [])

  return (
    <LoginContext.Provider value={{ onSubmit, form: methods, onGoogleSignIn }}>
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
