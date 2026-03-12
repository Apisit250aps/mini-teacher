'use client'

import { userEntitySchema } from '@/core/domain/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { createContext, useContext, useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

const userLoginSchema = userEntitySchema.pick({ name: true, password: true })

type UserLogin = z.infer<typeof userLoginSchema>

type PendingAction =
  | { type: 'credentials'; data: UserLogin }
  | { type: 'google' }

type LoginContextValue = {
  form: ReturnType<typeof useForm<UserLogin>>
  onCredentialSubmit: (data: UserLogin) => void
  onGoogleSignIn: () => void
  showConsent: boolean
  onConsentAccept: () => void
  onConsentDecline: () => void
}

const LoginContext = createContext<LoginContextValue | null>(null)

export function LoginProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [showConsent, setShowConsent] = useState(false)
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null)

  const onCredentialSubmit = useCallback((data: UserLogin) => {
    setPendingAction({ type: 'credentials', data })
    setShowConsent(true)
  }, [])

  const onGoogleSignIn = useCallback(() => {
    setPendingAction({ type: 'google' })
    setShowConsent(true)
  }, [])

  const onConsentAccept = useCallback(async () => {
    setShowConsent(false)
    if (!pendingAction) return
    if (pendingAction.type === 'google') {
      await signIn('google')
      setPendingAction(null)
      return
    }
    const { data } = pendingAction
    const result = await signIn('credentials', {
      redirect: false,
      name: data.name,
      password: data.password,
    })
    setPendingAction(null)
    if (!result?.error) {
      toast.success('เข้าสู่ระบบสำเร็จ')
      router.refresh()
      return
    }
    toast.error('เข้าสู่ระบบไม่สำเร็จ!')
  }, [pendingAction, router])

  const onConsentDecline = useCallback(() => {
    setShowConsent(false)
    setPendingAction(null)
  }, [])

  const methods = useForm<UserLogin>({
    resolver: zodResolver(userLoginSchema),
    defaultValues: {
      name: '',
      password: '',
    },
  })

  return (
    <LoginContext.Provider
      value={{
        form: methods,
        onCredentialSubmit,
        onGoogleSignIn,
        showConsent,
        onConsentAccept,
        onConsentDecline,
      }}
    >
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
