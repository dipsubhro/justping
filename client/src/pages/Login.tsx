import { LoginForm } from "@/components/login-form"


export default function Login() {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="flex flex-col justify-center p-6 md:p-10">
        <div className="mx-auto w-full max-w-[420px] space-y-6">
          <div className="flex flex-col space-y-2 text-center md:text-left">
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome back
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
      <div className="hidden bg-muted lg:block" />
    </div>
  )
}
