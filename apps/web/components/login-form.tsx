"use client"

import { useForm } from "react-hook-form"
import type { SubmitHandler } from "react-hook-form"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { useSignIn } from "~/hooks/api/auth"

type LoginFormValues = {
  email: string
  password: string
}

export function LoginForm({ className, ...props }: React.ComponentProps<"form">) {
  const { signInUserWithEmailAndPasswordAsync, status } = useSignIn()
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: { email: "", password: "" },
  })

  const onSubmit: SubmitHandler<LoginFormValues> = async (values) => {
    try {
      await signInUserWithEmailAndPasswordAsync({
        email: values.email,
        password: values.password,
      })
      router.push("/dashboard")
    } catch (err) {
      console.error("Sign-in failed", err)
    }
  }

  const isLoading = status === "pending"

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("flex flex-col gap-4", className)}
      {...props}
    >
      <div className="grid gap-2">
        <Label htmlFor="email" className="text-xs font-medium text-muted-foreground">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          className="h-10"
          {...register("email", { required: true })}
        />
        {errors.email && <span className="text-xs text-destructive">Email is required</span>}
      </div>

      <div className="grid gap-2">
        <div className="flex items-baseline justify-between">
          <Label htmlFor="password" className="text-xs font-medium text-muted-foreground">
            Password
          </Label>
          <a
            href="#"
            className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            Forgot password?
          </a>
        </div>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          className="h-10"
          {...register("password", { required: true })}
        />
      </div>

      <Button type="submit" disabled={isLoading} className="mt-2 h-10 gap-2 font-medium">
        {isLoading && <Loader2 className="size-4 animate-spin" />}
        {isLoading ? "Signing in…" : "Sign in"}
      </Button>

      <div className="relative my-2 flex items-center text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        <span className="px-3">or continue with</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <Button variant="outline" type="button" className="h-10 gap-2 font-medium">
        <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
          <path d="M22.5 12.27c0-.86-.07-1.5-.22-2.16H12.18v4.07h5.95c-.12.97-.77 2.43-2.2 3.41l-.02.14 3.2 2.46.22.02c2.04-1.86 3.17-4.6 3.17-7.94" fill="#4285F4"/>
          <path d="M12.18 22.5c2.91 0 5.35-.95 7.13-2.59l-3.4-2.62c-.91.63-2.13 1.07-3.73 1.07-2.85 0-5.27-1.86-6.13-4.43l-.13.01-3.34 2.55-.04.12c1.77 3.49 5.4 5.89 9.64 5.89" fill="#34A853"/>
          <path d="M6.05 13.93a6.84 6.84 0 0 1 0-4.36L6.04 9.43 2.66 6.83l-.1.05a11.04 11.04 0 0 0 0 9.74l3.49-2.69" fill="#FBBC04"/>
          <path d="M12.18 5.14c2.02 0 3.38.86 4.15 1.58l3.03-2.93C17.52 2.21 15.09 1.5 12.18 1.5 7.94 1.5 4.31 3.9 2.55 7.39l3.5 2.7c.87-2.57 3.28-4.95 6.13-4.95" fill="#EA4335"/>
        </svg>
        Continue with Google
      </Button>
    </form>
  )
}
