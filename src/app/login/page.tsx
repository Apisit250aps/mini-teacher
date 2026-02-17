import { auth } from '@/auth'
import { LoginForm } from '@/components/login-form'
import { LoginProvider } from '@/hooks/use-login'
import { redirect } from 'next/navigation'

export default async function LoginPage() {
  const session = await auth()
  if (session) {
    redirect('/')
  }
  return (
    <LoginProvider>
      <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
    </LoginProvider>
  )
}
