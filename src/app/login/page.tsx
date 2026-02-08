import { LoginForm } from '@/components/login-form'
import { LoginProvider } from '@/hooks/use-login'

export default function LoginPage() {
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
