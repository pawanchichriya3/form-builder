'use client'
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUser } from "~/hooks/api/auth";
import { trpc } from "~/trpc/client";

export default function Home() {
  console.log("HOME RENDERED");
  const {user, isLoading} = useUser();
  const router = useRouter();

  useEffect(() => {


  if (user?.id) {
    console.log("redirecting dashboard");
    router.replace("/dashboard");
  } else {
    console.log("redirecting login");
    router.replace("/login");
  }
}, [user, isLoading, router]);
  return (
    <main className="relative min-h-screen min-w-screen flex justify-center items-center overflow-hidden">
      <div className="absolute inset-0 mountain-bg">
        <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 300" fill="none" preserveAspectRatio="none">
          <path d="M0 300V220L240 140L480 200L720 80L960 160L1200 60L1440 140V300H0Z" fill="oklch(0.16 0.035 260 / 50%)" />
          <path d="M0 300V260L300 190L600 250L900 170L1200 230L1440 210V300H0Z" fill="oklch(0.12 0.025 260 / 70%)" />
        </svg>
      </div>
      <div className="relative z-10 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 shadow-lg shadow-primary/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="size-5 text-primary-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m8 3 4 8 5-5 5 15H2L8 3z"/><path d="M4.14 15.08c2.62-1.57 5.24-1.43 7.86.42 2.74 1.94 5.49 2 8.23.19"/></svg>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-white/90">Summit Forms</h1>
        <p className="text-white/40 text-sm mt-1">Redirecting…</p>
      </div>
    </main>
  );
}
