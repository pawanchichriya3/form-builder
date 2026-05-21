"use client"

import { useForm } from "react-hook-form"
import type { SubmitHandler } from "react-hook-form"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { useSignup } from "~/hooks/api/auth"

type SignupFormValues = {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export function SignupForm({ className, ...props }: React.ComponentProps<"form">) {
  const { createUserWithEmailAndPasswordAsync, status } = useSignup()
  const router = useRouter()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormValues>({
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  })

  const onSubmit: SubmitHandler<SignupFormValues> = async (values) => {
    try {
      await createUserWithEmailAndPasswordAsync({
        email: values.email,
        fullName: values.name,
        password: values.password,
      })
      router.push("/login")
    } catch (err) {
      console.error("Signup failed", err)
    }
  }

  const isLoading = status === "pending"
  const password = watch("password")

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("flex flex-col gap-4", className)}
      {...props}
    >
      <div className="grid gap-2">
        <Label htmlFor="name" className="text-xs font-medium text-muted-foreground">
          Full name
        </Label>
        <Input
          id="name"
          type="text"
          autoComplete="name"
          placeholder="Jane Doe"
          className="h-10"
          {...register("name", { required: true, minLength: 1 })}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="email" className="text-xs font-medium text-muted-foreground">
          Work email
        </Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          className="h-10"
          {...register("email", { required: true })}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="password" className="text-xs font-medium text-muted-foreground">
          Password
        </Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          className="h-10"
          {...register("password", { required: true, minLength: 8 })}
        />
        <span className="text-xs text-muted-foreground">
          At least 8 characters.
        </span>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="confirmPassword" className="text-xs font-medium text-muted-foreground">
          Confirm password
        </Label>
        <Input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          className="h-10"
          {...register("confirmPassword", {
            required: true,
            validate: (v) => v === password || "Passwords don't match",
          })}
        />
        {errors.confirmPassword && (
          <span className="text-xs text-destructive">{errors.confirmPassword.message as string}</span>
        )}
      </div>

      <Button type="submit" disabled={isLoading} className="mt-2 h-10 gap-2 font-medium">
        {isLoading && <Loader2 className="size-4 animate-spin" />}
        {isLoading ? "Creating account…" : "Create account"}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        By signing up, you agree to our{" "}
        <a href="#" className="underline underline-offset-4 hover:text-foreground">Terms</a>
        {" "}and{" "}
        <a href="#" className="underline underline-offset-4 hover:text-foreground">Privacy Policy</a>.
      </p>
    </form>
  )
}
