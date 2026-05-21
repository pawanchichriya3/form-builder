"use client"

import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field"
import { Input } from "~/components/ui/input"
import { useSignIn } from "~/hooks/api/auth"
import { useForm } from "react-hook-form"
import type { SubmitHandler } from "react-hook-form"
import { useRouter } from "next/navigation"

type LoginFormValues = {
  email: string;
  password: string;
};


export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const {signInUserWithEmailAndPasswordAsync} = useSignIn()
  const {register, handleSubmit} = useForm({
    defaultValues:{
      email:"",
      password:""
    }
  })
  const router = useRouter()

  const onSubmit: SubmitHandler<LoginFormValues> = async (values) => {
    console.log('Login form values:', values);
    try {
      const { id } = await signInUserWithEmailAndPasswordAsync({
        email: values.email,
        password: values.password,
      });
      console.log('Signed in user id:', id);
      router.push('/dashboard')
    } catch (err) {
      console.error('Sign-in failed', err);
    }
  };
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="mountain-glass border-white/10 shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 shadow-lg shadow-primary/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="size-6 text-primary-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m8 3 4 8 5-5 5 15H2L8 3z"/><path d="M4.14 15.08c2.62-1.57 5.24-1.43 7.86.42 2.74 1.94 5.49 2 8.23.19"/></svg>
          </div>
          <CardTitle className="text-xl text-white">Welcome back</CardTitle>
          <CardDescription className="text-white/60">
            Sign in to your Summit Forms account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  {...register('email')}
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" type="password" required {...register('password')} />
              </Field>
              <Field>
                <Button type="submit" className="w-full bg-gradient-to-r from-primary to-primary/80 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
                  Sign In
                </Button>
                <Button variant="outline" type="button" className="w-full border-white/10 bg-white/5 text-white hover:bg-white/10">
                  Sign in with Google
                </Button>
                <FieldDescription className="text-center text-white/50">
                  Don&apos;t have an account?{" "}
                  <a href="/signup" className="text-primary hover:text-primary/80 underline-offset-4 hover:underline">Sign up</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
