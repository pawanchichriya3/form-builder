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
    <main className="min-h-screen min-w-screen flex justify-center items-center">
      <div>
        <h1 className="text-3xl">{JSON.stringify(user)}</h1>
        <h2></h2>
      </div>
    </main>
  );
}
